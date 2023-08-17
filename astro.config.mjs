import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import i18n from "astro-i18n-aut";
import mdx from "@astrojs/mdx";
import { locales, defaultLang } from "./src/i18n/ui";

// https://astro.build/config
export default defineConfig({
  integrations: [
    solidJs(),
    i18n({
      locales,
      defaultLocale: defaultLang,
    }),
    mdx(),
  ],
  experimental: {
    assets: true,
  },
  trailingSlash: "always",
});
