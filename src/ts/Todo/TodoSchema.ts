import z from "zod";

export const TodoSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required!")
    .max(50, "Maximum 50 characters!"),
  status: z.enum(["active", "complete"], {
    message: "Set status only between active and complete!",
  }),
});

export type TodoSchemaType = z.infer<typeof TodoSchema>;
