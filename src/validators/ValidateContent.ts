import { z } from "zod";

export const schemaContent = z.object({
  contentId: z.string().optional(),
  link: z.string().url("Invalid URL"),
  type: z.enum(["image", "video", "article", "tweets"]),
  title: z
    .string()
    .min(10, "title must have minimum 10 characters!")
    .max(100, "title can have maximum 100 characters!"),
  tags: z.array(
    z
      .string()
      .min(5, "tag must have minimum 5 characters!")
      .max(20, "tag can have maximum 20 characters!")
  ),
});
