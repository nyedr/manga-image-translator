import type { TranslatorKey } from "@/types";

export function getTranslatorName(key: TranslatorKey): string {
  if (key === "none") return "No Text";
  const keyParts = key.split("_");
  return keyParts
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
