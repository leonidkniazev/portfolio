import { defineCollection, z } from "astro:content";

const aboutMe = z.object({
  name: z.string(),
  occupation: z.string(),
  about1: z.string(),
  about2: z.string(),
  about3: z.string(),
});

const roundedSkill = z.object({
  name: z.string(),
  percent: z.number().min(0).max(100),
  img: z.string().optional(),
});
const framework = z.object({
  name: z.string(),
  list: z.string().array().optional(),
});
const interest = z.object({
  name: z.string(),
  img: z.string(),
});
const social = z.object({
  icon: z.string().optional(),
  href: z.string().url(),
});
const certificate = z.object({
  img: z.string(),
  href: z.string(),
});
const project = z.object({
  img: z.string(),
  href: z.string(),
  name: z.string(),
  description: z.string(),
});
const metadata = z.object({
  description: z.string(),
  keywords: z.string().array(),
});

const portfolio = defineCollection({
  type: "data",
  schema: z.object({
    aboutMe,
    hardSkills: z.object({
      languages: roundedSkill.array(),
      programmingLanguages: roundedSkill.array(),
      softwareSkills: roundedSkill.array(),
      UXResearchSkills: z.string().array(),
      UXDesignSkills: z.string().array(),
      UIDesignSkills: z.string().array(),
      productManagmentSkills: z.string().array(),
      frameworkSkills: framework.array(),
    }),
    softSkills: z.string().array(),
    certificates: certificate.array(),
    projects: project.array(),
    interests: interest.array(),
    socials: z.object({
      telegram: social,
      instagram: social,
      linkedin: social,
      email: social,
    }),
    metadata,
    resumeUrl: z.string(),
  }),
});

export const collections = {
  portfolio: portfolio,
};
