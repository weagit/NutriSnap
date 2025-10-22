// src/services/apiClient.js
import { readAsStringAsync } from 'expo-file-system/legacy';
import { API_CONFIG, NUTRITION } from '../constants/constants';

// ⚠️ Pour Expo, utilise EXPO_PUBLIC_ prefix
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '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';

export async function analyzeMealFromImageAsync(imageUri, additionalDetails = '') {
  try {
    // 1. Lire l'image en base64
    const base64 = await readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // 2. Construire le prompt COMPLET pour Groq avec les détails additionnels
    let textPrompt = `You are a nutrition expert. Analyze this meal image and estimate:
1. The food name
2. Total calories (kcal) based on the visible portion size
3. Macronutrients: protein (g), carbs (g), fat (g)`;

    if (additionalDetails && additionalDetails.trim().length > 0) {
      textPrompt += `

  CRITICAL: The user has provided these additional details about the meal:
"${additionalDetails}"

You MUST take these details into account when calculating calories and macros. For example:
- If they mention "without meat" or "no cheese", reduce calories accordingly
- If they mention "double portion" or "extra cheese", increase calories accordingly  
- If they mention "0% fat" or "light", adjust fat content down
- If they mention specific ingredients, factor them into your calculation

Adjust your estimation based on these details!`;
    }

    textPrompt += `

Respond ONLY with valid JSON in this exact format:
{"name": "Pizza Margherita", "kcal": 450, "protein": 18, "carbs": 55, "fat": 16, "reasoning": "Brief explanation of how you calculated this"}

Be realistic about portion sizes visible in the image and apply the user's additional details.`;

    // 3. Appel à Groq Vision avec prompt complet
    const response = await fetch(API_CONFIG.GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: textPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_completion_tokens: API_CONFIG.MAX_TOKENS,
        temperature: API_CONFIG.TEMPERATURE,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0]?.message?.content;

    if (!rawContent) {
      throw new Error('No response from Groq');
    }

    // 4. Parser la réponse JSON de Groq
    let aiResult;
    try {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawContent;
      aiResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw:', rawContent);
      throw new Error('Could not parse AI response');
    }

    // 5. Valider et formater les données
    const name = aiResult.name || 'Unknown meal';
    const kcal = parseInt(aiResult.kcal) || NUTRITION.DEFAULT_CALORIES;
    const protein = parseInt(aiResult.protein) || Math.round(kcal * NUTRITION.PROTEIN_RATIO / NUTRITION.PROTEIN_CAL_PER_G);
    const carbs = parseInt(aiResult.carbs) || Math.round(kcal * NUTRITION.CARBS_RATIO / NUTRITION.CARBS_CAL_PER_G);
    const fat = parseInt(aiResult.fat) || Math.round(kcal * NUTRITION.FAT_RATIO / NUTRITION.FAT_CAL_PER_G);
    const reasoning = aiResult.reasoning || 'Standard portion estimation';

    // 6. Créer la description finale avec le raisonnement de l'IA
    let description = `🤖 ${name}\n📊 ${kcal} kcal | Protein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g\n💭 ${reasoning}`;
    
    if (additionalDetails && additionalDetails.trim().length > 0) {
      description += `\n📝 Your notes: "${additionalDetails}"`;
    }

    return {
      name: name,
      kcal: kcal,
      macros: {
        protein: protein,
        carbs: carbs,
        fat: fat
      },
      description: description,
      reasoning: reasoning,
      confidence: 95,
      additionalDetails: additionalDetails || null,
      source: 'groq-full-ai'
    };

  } catch (error) {
    console.error('Analysis error:', error);
    
    // Fallback en cas d'erreur
    return {
      name: 'Unknown meal',
      kcal: NUTRITION.DEFAULT_CALORIES,
      macros: { 
        protein: Math.round(NUTRITION.DEFAULT_CALORIES * NUTRITION.PROTEIN_RATIO / NUTRITION.PROTEIN_CAL_PER_G),
        carbs: Math.round(NUTRITION.DEFAULT_CALORIES * NUTRITION.CARBS_RATIO / NUTRITION.CARBS_CAL_PER_G),
        fat: Math.round(NUTRITION.DEFAULT_CALORIES * NUTRITION.FAT_RATIO / NUTRITION.FAT_CAL_PER_G)
      },
      description: `⚠️ Could not analyze image. Using default estimate ~${NUTRITION.DEFAULT_CALORIES} kcal. Please try again.`,
      reasoning: 'Fallback estimation',
      confidence: null,
      additionalDetails: additionalDetails || null,
      source: 'fallback'
    };
  }
}