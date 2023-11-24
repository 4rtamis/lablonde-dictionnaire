import { z, defineCollection } from "astro:content";

const wordCollection = defineCollection({
  type: "data",
  schema: z.object({
    mot: z.string(),
    prononciation: z.string(),
    nature: z.enum([
      "nom masculin",
      "nom féminin",
      "nom",
      "adjectif",
      "verbe",
      "adverbe",
    ]),
    nature_abbreviation: z.enum(["n.m.", "n.f.", "n.", "adj.", "v.", "adv."]),
    origonomen: z.string().optional(),
    origine: z.string().optional(),
    definitions: z.string().array().array().nonempty(),
  }),
});

export const collections = {
  words: wordCollection,
};
