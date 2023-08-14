import { ImageFunction, defineCollection, z } from "astro:content";

const roundedSkill = (image: ImageFunction) =>
  z.object({
    name: z.string(),
    percent: z.number().min(0).max(100),
    img: image().optional(),
  });
const framework = z.object({
  name: z.string(),
  list: z.string().array().optional(),
});
const interest = (image: ImageFunction) =>
  z.object({
    name: z.string(),
    img: image(),
  });
const social = (image: ImageFunction) =>
  z.object({
    icon: image().optional(),
    href: z.string().url(),
  });
const certificate = (image: ImageFunction) =>
  z.object({
    img: image(),
    href: z.string(),
  });
const project = (image: ImageFunction) =>
  z.object({
    img: image(),
    href: z.string(),
    name: z.string(),
    description: z.string(),
  });

const portfolio = defineCollection({
  type: "data",
  schema: ({ image }) =>
    z.object({
      aboutMe: z.object({
        name: z.string(),
        occupation: z.string(),
        about1: z.string(),
        about2: z.string(),
        about3: z.string(),
      }),
      hardSkills: z.object({
        languages: roundedSkill(image).array(),
        programmingLanguages: roundedSkill(image).array(),
        softwareSkills: roundedSkill(image).array(),
        UXResearchSkills: z.string().array(),
        UXDesignSkills: z.string().array(),
        UIDesignSkills: z.string().array(),
        productManagmentSkills: z.string().array(),
        frameworkSkills: framework.array(),
      }),
      softSkills: z.string().array(),
      certificates: certificate(image).array(),
      projects: project(image).array(),
      interests: interest(image).array(),
      socials: z.object({
        telegram: social(image),
        instagram: social(image),
        linkedin: social(image),
        email: social(image),
      }),
      metadata: z.object({
        description: z.string(),
        keywords: z.string().array(),
      }),
      resumeUrl: z.string(),
    }),
});

const cases = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      figmaUrl: z.string().url(),
      behanceUrl: z.string().url(),
      title: z.string(),
      description: z.string(),
      heroImg: image(),
      boxart: image(),
      date: z.date(),
    }),
});

export const collections = {
  portfolio,
  cases,
};
