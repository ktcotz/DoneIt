import z from "zod";

export enum TodoStatus {
  Active = "active",
  Complete = "complete",
}

export const TodoSchemaID = z.object({
  id: z.string(),
});

export const TodoDataSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required!")
    .max(50, "Maximum 50 characters!"),
  status: z.enum(["active", "complete"], {
    message: "Set status only between active and complete!",
  }),
});

export const TodoSchema = z.intersection(TodoSchemaID, TodoDataSchema);

export type TodoSchemaType = z.infer<typeof TodoSchema>;
