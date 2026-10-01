/**
 * Translator Engine Module
 * Robust translation service supporting primary (Google Translate GTX API)
 * and secondary fallback providers (MyMemory & Lingva API) for 100% reliability.
 */

class TranslationEngine {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Main translate function with automated fallback
   * @param {string} text - Source text to translate
   * @param {string} sourceLang - ISO language code or 'auto'
   * @param {string} targetLang - ISO language code
   * @returns {Promise<{translatedText: string, detectedSourceLang: string, provider: string}>}
   */
  async translate(text, sourceLang = 'auto', targetLang = 'en') {
    const trimmed = text.trim();
    if (!trimmed) {
      return { translatedText: '', detectedSourceLang: sourceLang, provider: 'none' };
    }

    // Check cache
    const cacheKey = `${sourceLang}:${targetLang}:${trimmed}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let result = null;
    let lastError = null;

    // 1. Try Google Translate GTX API (Free high-performance endpoint)
    try {
      result = await this.translateGoogleGTX(trimmed, sourceLang, targetLang);
    } catch (err) {
      console.warn('Google Translate API failed, trying MyMemory API fallback...', err);
      lastError = err;
    }

    // 2. Fallback: MyMemory API
    if (!result) {
      try {
        result = await this.translateMyMemory(trimmed, sourceLang, targetLang);
      } catch (err) {
        console.warn('MyMemory API failed, trying Lingva API fallback...', err);
        lastError = err;
      }
    }

    // 3. Fallback: Lingva Translate API
    if (!result) {
      try {
        result = await this.translateLingva(trimmed, sourceLang, targetLang);
      } catch (err) {
        console.error('All translation providers failed.', err);
        lastError = err;
      }
    }

    if (!result) {
      throw new Error(lastError ? lastError.message : 'Translation failed across all API providers.');
    }

    // Save to cache (limit max cache size to 100)
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Primary Provider: Google Translate GTX Endpoint
   */
  async translateGoogleGTX(text, sourceLang, targetLang) {
    const sl = sourceLang === 'auto' ? 'auto' : sourceLang;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Google API returned status ${response.status}`);
    }

    const data = await response.json();
    
    // Parse response
    let translatedText = '';
    if (data && data[0] && Array.isArray(data[0])) {
      translatedText = data[0].map(item => item[0]).filter(Boolean).join('');
    }

    let detectedSource = sourceLang;
    if (data && data[2]) {
      detectedSource = data[2]; // Detected language code
    }

    if (!translatedText) {
      throw new Error('Google API returned empty result');
    }

    return {
      translatedText,
      detectedSourceLang: detectedSource,
      provider: 'Google Translate'
    };
  }

  /**
   * Fallback Provider 1: MyMemory Translation API
   */
  async translateMyMemory(text, sourceLang, targetLang) {
    const src = sourceLang === 'auto' ? 'autodetect' : sourceLang;
    const langpair = `${src}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`MyMemory API returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.responseData) {
      throw new Error('Invalid MyMemory response format');
    }

    const translatedText = data.responseData.translatedText;
    let detectedSource = sourceLang;
    if (data.responseData.detectedLanguage) {
      detectedSource = data.responseData.detectedLanguage;
    }

    return {
      translatedText,
      detectedSourceLang: detectedSource,
      provider: 'MyMemory'
    };
  }

  /**
   * Fallback Provider 2: Lingva API
   */
  async translateLingva(text, sourceLang, targetLang) {
    const src = sourceLang === 'auto' ? 'auto' : sourceLang;
    const url = `https://lingva.ml/api/v1/${src}/${targetLang}/${encodeURIComponent(text)}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lingva API returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.translation) {
      throw new Error('Invalid Lingva response format');
    }

    return {
      translatedText: data.translation,
      detectedSourceLang: data.info?.detectedSource || sourceLang,
      provider: 'Lingva'
    };
  }
}

const translator = new TranslationEngine();
