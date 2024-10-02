import zod from "zod";
export const requestSlang = zod.object({
  requestedTerm: zod
    .string()
    .min(2, { message: "requested slang cannot be less than 2 character" }),
});

export const postSlang = zod.object({
  term: zod
    .string()
    .min(2, { message: "slang cannot be less than 2 character" }),
  definition: zod.string(),
  context: zod.string(),
  origin: zod.string().optional(),
});
