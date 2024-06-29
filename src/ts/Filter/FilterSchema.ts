import z from "zod";

export const FilterSchema = z
  .union([z.literal("all"), z.literal("complete"), z.literal("active")])
  .default("all");

export type FilterSchemaType = z.infer<typeof FilterSchema>;
