export const languageOptions = [
  { value: "CHS", label: "简体中文" },
  { value: "CHT", label: "繁體中文" },
  { value: "CSY", label: "čeština" },
  { value: "NLD", label: "Nederlands" },
  { value: "ENG", label: "English" },
  { value: "FRA", label: "français" },
  { value: "DEU", label: "Deutsch" },
  { value: "HUN", label: "magyar nyelv" },
  { value: "ITA", label: "italiano" },
  { value: "JPN", label: "日本語" },
  { value: "KOR", label: "한국어" },
  { value: "PLK", label: "polski" },
  { value: "PTB", label: "português" },
  { value: "ROM", label: "limba română" },
  { value: "RUS", label: "русский язык" },
  { value: "ESP", label: "español" },
  { value: "TRK", label: "Türk dili" },
  { value: "UKR", label: "українська мова" },
  { value: "VIN", label: "Tiếng Việt" },
  { value: "ARA", label: "العربية" },
  { value: "CNR", label: "crnogorski jezik" },
  { value: "SRP", label: "српски језик" },
  { value: "HRV", label: "hrvatski jezik" },
  { value: "THA", label: "ภาษาไทย" },
  { value: "IND", label: "Indonesia" },
  { value: "FIL", label: "Wikang Filipino" },
];

export const detectionResolutions = [1024, 1536, 2048, 2560];

export const inpaintingSizes = [512, 1024, 2048, 2560];

export const textDetectorOptions = [
  { value: "default", label: "Default" },
  { value: "ctd", label: "CTD" },
  { value: "paddle", label: "Paddle" },
];

export const inpainterOptions = [
  { value: "default", label: "Default" },
  { value: "lama_large", label: "Lama (Large)" },
  { value: "lama_mpe", label: "Lama (MPE)" },
  { value: "sd", label: "Stable Diffusion" },
  { value: "none", label: "None" },
  { value: "original", label: "Original" },
];

export const ocrOptions = [
  { value: "32px", label: "32px" },
  { value: "48px", label: "48px" },
  { value: "48px_ctc", label: "48px CTC" },
  { value: "mocr", label: "Manga OCR" },
];

export const rendererOptions = [
  { value: "default", label: "Default" },
  { value: "manga2eng", label: "Manga2Eng" },
  { value: "none", label: "None" },
];

export const textDirectionOptions = [
  { value: "auto", label: "Auto" },
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
];

export const fontOptions = [
  { value: "fonts/anime_ace_3.ttf", label: "Anime Ace 3" },
  { value: "fonts/anime_ace.ttf", label: "Anime Ace" },
  {
    value: "fonts/Arial-Unicode-Regular.ttf",
    label: "Arial Unicode Regular",
  },
  { value: "fonts/comic shanns 2.ttf", label: "Comic Shanns 2" },
  { value: "fonts/msgothic.ttc", label: "MS Gothic" },
  { value: "fonts/msyh.ttc", label: "Microsoft YaHei" },
  {
    value: "fonts/NotoSansMonoCJK-VF.ttf.ttc",
    label: "Noto Sans Mono CJK",
  },
];

export const imageMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/bmp",
  "image/webp",
];
