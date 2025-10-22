// src/constants/

// 🎨 COLORS - Palette de l'app
export const COLORS = {
  primary: '#35C5CF',      // Turquoise principal
  secondary: '#81C9F3',    // Bleu clair
  light: '#D9EFF5',        // Bleu très clair
  background: '#FAFAFA',   // Fond gris très clair
  border: '#EDEEF1',       // Bordure grise
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FFD93D',
  info: '#007AFF',
  
  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666',
  textTertiary: '#999',
  
  white: '#FFFFFF',
  black: '#000000',
};

// 📏 SIZES
export const SIZES = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
  },
  padding: {
    small: 12,
    medium: 16,
    large: 20,
  },
  fontSize: {
    tiny: 11,
    small: 13,
    regular: 15,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 28,
  },
};

// 🔐 API CONFIG
export const API_CONFIG = {
  GROQ_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: 'meta-llama/llama-4-scout-17b-16e-instruct',
  MAX_TOKENS: 250,
  TEMPERATURE: 0.3,
};

// ⚙️ APP CONFIG
export const APP_CONFIG = {
  MIN_DAILY_LIMIT: 500,
  DEFAULT_DAILY_LIMIT: 2000,
  IMAGE_QUALITY: 0.7,
  IMAGE_MAX_HEIGHT: 280,
};

// 📝 MESSAGES
export const MESSAGES = {
  SUCCESS: {
    MEAL_ADDED: 'Meal Added',
    LIMIT_UPDATED: 'Daily limit updated',
  },
  ERROR: {
    NO_PHOTO: 'Please take a photo first.',
    ANALYSIS_FAILED: 'Could not analyze this photo. Please try again.',
    CAMERA_PERMISSION: 'Camera permission is needed to scan meals.',
    INVALID_LIMIT: 'Enter a valid value (>500)',
  },
  CONGRATS: {
    TITLE: "Congratulations! You've reached your goal!",
    QUOTE: "Success is the sum of small efforts repeated day in and day out.",
  },
};

// 🍔 NUTRITION DEFAULTS
export const NUTRITION = {
  DEFAULT_CALORIES: 300,
  PROTEIN_RATIO: 0.15,
  CARBS_RATIO: 0.50,
  FAT_RATIO: 0.35,
  PROTEIN_CAL_PER_G: 4,
  CARBS_CAL_PER_G: 4,
  FAT_CAL_PER_G: 9,
};