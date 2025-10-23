import { z } from "zod";

//Aor & ActiveShift
export const AorIdDto = z.object({
  _id: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string().optional(),
  code: z.string().optional(),
  dailyHosLimit: z.number().optional(),
  weeklyHosLimit: z.number().optional(),
  emailDistributionList: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  companyId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const ShiftAorDto = z.object({
  _id: z.string(),
  aorId: z.string(),
  shiftId: z.string(),
  startTime: z.string(),
  status: z.string(),
  plannedDurationHours: z.number(),
  actualDurationHours: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean().optional(),
  aor: AorIdDto,
});

export const ActiveShiftDto = z.object({
  _id: z.string(),
  operatorId: z.string(),
  shiftStartTime: z.string(),
  shiftEndTime: z.string().nullable(),
  continuousRestHours: z.number(),
  ratingId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  shiftAors: z.array(ShiftAorDto),
});

export const ActiveShiftResponseDto = z.array(ActiveShiftDto);

export type AorId = z.infer<typeof AorIdDto>;
export type ShiftAor = z.infer<typeof ShiftAorDto>;
export type ActiveShift = z.infer<typeof ActiveShiftDto>;
export type ActiveShiftResponse = z.infer<typeof ActiveShiftResponseDto>;

export const ActiveShiftApiResponseDto = z.object({
  message: z.string(),
  data: ActiveShiftResponseDto,
});
export type ActiveShiftApiResponse = z.infer<typeof ActiveShiftApiResponseDto>;

//Shift Form Template
export const ShiftFormFieldDto = z.object({
  label: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  options: z.array(z.string()).optional(),
  title: z.string().optional(),
  required: z.boolean().optional(),
  alignment: z.string().optional(),
  order: z.number().optional(),
  extentsdefault: z.number().optional(),
  extentstrigger: z
    .object({
      options: z.array(z.string()),
    })
    .optional(),
  extents: z.array(z.any()).optional(),
  placeholder: z.string().optional(),
});

export const ShiftFormGroupDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  colorCode: z.string().optional(),
  alignment: z.string().optional(),
  fields: z.array(ShiftFormFieldDto),
});

export const ShiftFormSectionDto = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  order: z.number().optional(),
  group: z.array(ShiftFormGroupDto),
});

export const ShiftFormTemplateDto = z.record(ShiftFormSectionDto);

export const ShiftFormTemplateResponseDto = z.object({
  _id: z.string(),
  aorId: z.string(),
  title: z.string(),
  version: z.number(),
  description: z.string().optional(),
  formTemplate: ShiftFormTemplateDto,
  createdBy: z.string().optional(),
});

export type ShiftFormField = z.infer<typeof ShiftFormFieldDto>;
export type ShiftFormGroup = z.infer<typeof ShiftFormGroupDto>;
export type ShiftFormSection = z.infer<typeof ShiftFormSectionDto>;
export type ShiftFormTemplate = z.infer<typeof ShiftFormTemplateDto>;
export type ShiftFormTemplateResponse = z.infer<
  typeof ShiftFormTemplateResponseDto
>;

export const ShiftFormTemplateApiResponseDto = z.object({
  message: z.string(),
  data: ShiftFormTemplateResponseDto,
});
export type ShiftFormTemplateApiResponse = z.infer<
  typeof ShiftFormTemplateApiResponseDto
>;

export interface EndShiftResponse {
  message: string;
  data: {
    shiftId: string;
    status: string;
    endedAt: string;
  };
}
