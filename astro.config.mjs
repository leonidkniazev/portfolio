import { defineConfig } from "astro/config";

import solidJs from "@astrojs/solid-js";
import i18n from "astro-i18n-aut";

const defaultLocale = "en";
const locales = {
  en: "en-US",
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
  experimental: {
    assets: true,
  },
  trailingSlash: "always",
});
