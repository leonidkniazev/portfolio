import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import mdx from "@astrojs/mdx";
import { locales, defaultLang } from "./src/i18n/ui";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "~": "/src",
      },
    },
  },
  integrations: [
    solidJs(),
    i18n({
      locales,
      defaultLocale: defaultLang,
    }),
    mdx(),
    sitemap({
      i18n: {
        locales,
        defaultLocale: defaultLang,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale: defaultLang }),
    }),
  ],
  trailingSlash: "always",
  site: "https://www.leonidkniazev.com/",
});
