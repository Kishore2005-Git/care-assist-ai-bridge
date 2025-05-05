interface TranslateOptions {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

interface DetectLanguageResponse {
  language: string;
  isReliable: boolean;
  confidence: number;
}

// Function to detect language from text
export async function detectLanguage(text: string): Promise<string> {
  try {
    // First try to use browser's navigator.language
    const browserLanguage = navigator.language || 'en-US';
    
    // If text is empty, default to browser language
    if (!text.trim()) {
      return browserLanguage.split('-')[0];
    }
    
    // For short texts, it's challenging to detect language accurately
    if (text.length < 10) {
      return browserLanguage.split('-')[0];
    }
    
    // Use Google Translate API to detect language
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${getGoogleApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error detecting language:', data.error);
      return browserLanguage.split('-')[0];
    }
    
    // Return detected language code
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Error detecting language:', error);
    return 'en'; // Default to English on error
  }
}

// Function to translate text
export async function translateText({ 
  text, 
  targetLanguage, 
  sourceLanguage 
}: TranslateOptions): Promise<string> {
  try {
    // If source and target are the same, return original text
    if (sourceLanguage && sourceLanguage === targetLanguage) {
      return text;
    }
    
    // Skip translation if text is empty
    if (!text.trim()) {
      return text;
    }
    
    // Use Google Translate API
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${getGoogleApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
        ...(sourceLanguage && { source: sourceLanguage }),
        format: 'text'
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Error translating text:', data.error);
      return text; // Return original text on error
    }
    
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    return text; // Return original text on error
  }
}

// Function to get Google API key
// This is using a placeholder approach - replace with your API key management method
function getGoogleApiKey(): string {
  // For demonstration purposes, we're using localStorage
  // In a production app, you should use environment variables or a secure API
  const apiKey = localStorage.getItem('GOOGLE_TRANSLATE_API_KEY');
  if (!apiKey) {
    throw new Error('Google Translate API key not found. Please set it in the settings.');
  }
  return apiKey;
}

// Save API key to localStorage
export function setGoogleApiKey(apiKey: string): void {
  localStorage.setItem('GOOGLE_TRANSLATE_API_KEY', apiKey);
}

// Get user's preferred language
export function getUserLanguage(): string {
  // First check if user has a saved preference
  const savedLanguage = localStorage.getItem('userLanguagePreference');
  if (savedLanguage) {
    return savedLanguage;
  }
  
  // Otherwise use browser language
  const browserLanguage = navigator.language || 'en-US';
  return browserLanguage.split('-')[0]; // Extract primary language code (e.g., 'en' from 'en-US')
}

// Set user's preferred language
export function setUserLanguage(languageCode: string): void {
  localStorage.setItem('userLanguagePreference', languageCode);
}

// List of supported languages for UI
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
];
