// src/services/apiClient.js
import { readAsStringAsync } from 'expo-file-system/legacy';

const GROQ_API_KEY = VITE_GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// 🤖 VERSION FULL IA : Groq calcule TOUT !
export async function analyzeMealFromImageAsync(imageUri, voiceDetails = '') {
  try {
    // 1. Lire l'image en base64
    const base64 = await readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // 2. 🎯 Construire le prompt COMPLET pour Groq
    let textPrompt = `You are a nutrition expert. Analyze this meal image and estimate:
1. The food name
2. Total calories (kcal) based on the visible portion size
3. Macronutrients: protein (g), carbs (g), fat (g)

Respond ONLY with valid JSON in this exact format:
{"name": "Pizza Margherita", "kcal": 450, "protein": 18, "carbs": 55, "fat": 16}

Be realistic about portion sizes visible in the image.`;

    // 🎤 Si l'user a ajouté des détails vocaux, on les inclut
    if (voiceDetails && voiceDetails.trim().length > 0) {
      textPrompt = `You are a nutrition expert. Analyze this meal image and estimate:
1. The food name
2. Total calories (kcal) based on the visible portion size
3. Macronutrients: protein (g), carbs (g), fat (g)

IMPORTANT: The user provided these additional details about the meal: "${voiceDetails}"
Take these details into account when estimating calories (e.g., "extra cheese" adds calories, "light version" reduces them, "with cream" adds fat, etc.).

Respond ONLY with valid JSON in this exact format:
{"name": "Pizza Margherita with extra cheese", "kcal": 580, "protein": 24, "carbs": 58, "fat": 22}

Be realistic about portion sizes and adjust for the user's specifications.`;
    }

    // 3. 🚀 Appel à Groq Vision avec prompt complet
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
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
        max_completion_tokens: 150,
        temperature: 0.3, // Un peu de créativité pour les estimations
        response_format: { type: "json_object" } // Force JSON response
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

    // 4. 🧠 Parser la réponse JSON de Groq
    let aiResult;
    try {
      // Nettoyer la réponse au cas où Groq ajoute du texte autour
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawContent;
      aiResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw:', rawContent);
      throw new Error('Could not parse AI response');
    }

    // 5. ✅ Valider et formater les données
    const name = aiResult.name || 'Unknown meal';
    const kcal = parseInt(aiResult.kcal) || 300;
    const protein = parseInt(aiResult.protein) || Math.round(kcal * 0.15 / 4);
    const carbs = parseInt(aiResult.carbs) || Math.round(kcal * 0.50 / 4);
    const fat = parseInt(aiResult.fat) || Math.round(kcal * 0.35 / 9);

    // 6. 📝 Créer la description finale
    let description = `AI Analysis: ${name}. Estimated ${kcal} kcal per serving.`;
    
    if (voiceDetails && voiceDetails.trim().length > 0) {
      description += ` (Adjusted for: "${voiceDetails}")`;
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
      confidence: 95, // Confiance élevée car c'est l'IA qui calcule
      voiceDetails: voiceDetails || null,
      source: 'groq-full-ai'
    };

  } catch (error) {
    console.error('Analysis error:', error);
    
    // 🆘 Fallback en cas d'erreur (pour pas bloquer l'app)
    return {
      name: 'Unknown meal',
      kcal: 300,
      macros: { protein: 15, carbs: 35, fat: 12 },
      description: 'Could not analyze image. Using default estimate ~300 kcal. Please try again.',
      confidence: null,
      voiceDetails: voiceDetails || null,
      source: 'fallback'
    };
  }
}