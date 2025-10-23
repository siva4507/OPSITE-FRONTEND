import { useTranslation as useI18nTranslation } from "react-i18next";

export const useTranslation = (namespace = "common") => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    t,
    i18n,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language,
  };
};
