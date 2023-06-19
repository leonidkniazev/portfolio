import { defineCollection, z } from "astro:content";

const interest = z.object({
  aboutMe: z.string(),
  projects: z.string(),
  skills: z.string(),
  contacts: z.string(),
  resume: z.string(),
});
const interests = defineCollection({
  type: "data",
  schema: z.object({
    interest,
  }),
});

export const collections = {
  translations: interests,
};
