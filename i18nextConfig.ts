// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import kr from "./locales/kr/common.json";
import ru from "./locales/ru/common.json";
import uz from "./locales/uz/common.json";
import zh from "./locales/chinese/common.json";
import vi from "./locales/vietnamese/common.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    kr: { translation: kr },
    ru: { translation: ru },
    uz: { translation: uz },
    vi: { translation: vi },
    zh: { translation: zh },
  },
  lng: "kr", // default language
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;

// Optional helper to switch languages dynamically
export const changeLanguage = async (lang: "en" | "kr" | "ru") => {
  await i18n.changeLanguage(lang);
};
