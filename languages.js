/**
 * Languages Registry
 * Maps ISO 639-1 codes to display names, flags, and Speech Synthesis/Recognition locales.
 */

const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect', flag: '✨', tts: 'en-US' },
  { code: 'en', name: 'English', flag: '🇺🇸', tts: 'en-US' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', tts: 'es-ES' },
  { code: 'fr', name: 'French', flag: '🇫🇷', tts: 'fr-FR' },
  { code: 'de', name: 'German', flag: '🇩🇪', tts: 'de-DE' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', tts: 'hi-IN' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳', tts: 'zh-CN' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', flag: '🇹🇼', tts: 'zh-TW' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', tts: 'ja-JP' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', tts: 'ar-SA' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', tts: 'ru-RU' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', tts: 'pt-PT' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', tts: 'it-IT' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', tts: 'ko-KR' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', tts: 'nl-NL' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', tts: 'tr-TR' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', tts: 'pl-PL' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', tts: 'sv-SE' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', tts: 'uk-UA' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', tts: 'vi-VN' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', tts: 'id-ID' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', tts: 'th-TH' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', tts: 'el-GR' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', tts: 'cs-CZ' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', tts: 'da-DK' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', tts: 'fi-FI' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', tts: 'he-IL' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', tts: 'hu-HU' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', tts: 'no-NO' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', tts: 'ro-RO' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰', tts: 'sk-SK' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', tts: 'bn-BD' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', tts: 'ur-PK' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳', tts: 'ta-IN' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳', tts: 'te-IN' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳', tts: 'mr-IN' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳', tts: 'gu-IN' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳', tts: 'kn-IN' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳', tts: 'ml-IN' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳', tts: 'pa-IN' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷', tts: 'fa-IR' },
  { code: 'fil', name: 'Filipino (Tagalog)', flag: '🇵🇭', tts: 'fil-PH' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', tts: 'ms-MY' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪', tts: 'sw-KE' },
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦', tts: 'af-ZA' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱', tts: 'sq-AL' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬', tts: 'bg-BG' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷', tts: 'hr-HR' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪', tts: 'et-EE' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸', tts: 'is-IS' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻', tts: 'lv-LV' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹', tts: 'lt-LT' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸', tts: 'sr-RS' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮', tts: 'sl-SI' },
  { code: 'la', name: 'Latin', flag: '🏛️', tts: 'la' },
  { code: 'eo', name: 'Esperanto', flag: '🌐', tts: 'eo' }
];

// Quick pick popular languages
const POPULAR_LANGUAGES = ['en', 'es', 'fr', 'de', 'hi', 'zh', 'ja', 'ar', 'ru'];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LANGUAGES, POPULAR_LANGUAGES };
}
