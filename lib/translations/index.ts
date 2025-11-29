import { en, Translations } from "./en";
import { es } from "./es";

export type Language = "en" | "es";

export const translations: Record<Language, Translations> = {
  en,
  es,
};

export type { Translations };
