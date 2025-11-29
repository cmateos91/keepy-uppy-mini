"use client";

import { useLanguage } from "@/contexts/language-context";
import { Language } from "@/lib/translations";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-2 bg-gray-800/70 hover:bg-gray-700/70 rounded-lg transition-colors"
    >
      <span className="text-lg">
        {language === "en" ? "EN" : "ES"}
      </span>
      <span className="text-white/60 text-sm">
        {language === "en" ? "ES" : "EN"}
      </span>
    </button>
  );
}
