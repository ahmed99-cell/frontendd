import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
 
import fr from './assets/locales/fr/translation.json';
import en from './assets/locales/en/translation.json';
 
const savedLanguage = localStorage.getItem('language') || 'en';
 
 
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      fr: {
        translation: fr,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
 
export default i18n;