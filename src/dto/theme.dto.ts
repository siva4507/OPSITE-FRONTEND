import { z } from "zod";

export const UpdateThemePayloadDto = z.object({
  bgImage: z.string().optional(),
  colorCode: z.string().optional(),
  opacity: z.number().optional(),
});

export type UpdateThemePayload = z.infer<typeof UpdateThemePayloadDto>;

export const ThemeDto = z.object({
  _id: z.string(),
  type: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  bgImage: z.string(),
  colorCode: z.string(),
  opacity: z.number(),
  default: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  __v: z.number(),
  imageUrl: z.string(),
  isSelected: z.enum(["custom", "systemtheme"]).optional(),
  theme: z
    .object({
      _id: z.string(),
      colorCode: z.string(),
      opacity: z.number(),
    })
    .optional(),
});

export const ThemeListResponseDto = z.object({
  message: z.string(),
  data: z.array(ThemeDto),
});

export type Theme = z.infer<typeof ThemeDto>;
export type ThemeListResponse = z.infer<typeof ThemeListResponseDto>;
