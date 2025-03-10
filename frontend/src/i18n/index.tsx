import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import resources from "./locales";

export const initI18n = () => {
  i18n
    .use(detector)
    .use(initReactI18next)
    .init({
      resources,
      lowerCaseLng: true,
      debug: true,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        lookupLocalStorage: "language",
        convertDetectedLanguage: (lng) => lng.replace("-", "_"),
        order: ["localStorage", "navigator"],
      },
    });
};
