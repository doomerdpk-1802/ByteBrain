import { z } from "zod";

export const schemaContent = z.object({
  contentId: z.string().trim().optional(),
  link: z.string().url("Invalid URL").trim(),
  type: z.enum(["image", "video", "article", "tweets"]),
  title: z.string().max(20, "title can have maximum 20 characters!").trim(),
  linkText: z
    .string()
    .max(100, "title can have maximum 100 characters!")
    .trim(),
  tags: z.string().trim(),
});
