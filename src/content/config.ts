import { z, defineCollection } from "astro:content";

const wordCollection = defineCollection({
  type: "data",
  schema: z.object({
    mot: z.string(),
    nature: z.enum([
      "nom masculin",
      "nom féminin",
      "nom",
      "adjectif",
      "verbe",
      "adverbe",
    ]),
    nature_abbreviation: z.enum(["n.m.", "n.f.", "n.", "adj.", "v.", "adv."]),
    origine: z.string().optional(),
    definitions: z.string().array().nonempty(),
  }),
});

export const collections = {
  words: wordCollection,
};
