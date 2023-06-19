import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";
import i18n from "astro-i18n-aut";

const defaultLocale = "ru";
const locales = {
  en: "en-US", // the `defaultLocale` value must present in `locales` keys
  ru: "ru-RU",
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    i18n({
      locales,
      defaultLocale,
    }),
  ],
  trailingSlash: "always",
});
