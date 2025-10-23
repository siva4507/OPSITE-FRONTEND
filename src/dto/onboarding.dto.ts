import { z } from "zod";

//Roles
export const RolesResponseDto = z.array(
  z.object({
    _id: z.string(),
    name: z.string(),
  }),
);

export type Role = z.infer<typeof RolesResponseDto>[number];
export type RolesResponse = z.infer<typeof RolesResponseDto>;

export const RolesApiResponseDto = z.object({
  message: z.string(),
  data: RolesResponseDto,
});
export type RolesApiResponse = z.infer<typeof RolesApiResponseDto>;

//Quality of Sleep
export const QualityOfSleepDto = z.object({
  _id: z.string(),
  quality: z.string(),
  rating: z.string(),
});

export const QualityOfSleepResponseDto = z.object({
  message: z.string(),
  data: z.array(QualityOfSleepDto),
});

export type QualityOfSleep = z.infer<typeof QualityOfSleepDto>;
export type QualityOfSleepResponse = z.infer<typeof QualityOfSleepResponseDto>;

//Weather Location
export const WeatherLocationDto = z.object({
  latitude: z.number(),
  longitude: z.number(),
  city: z.string(),
  state: z.string(),
});

//Area of Responsibility
export const AreaOfResponsibilityDto = z.object({
  aors: z.array(
    z.object({
      _id: z.string(),
      name: z.string(),
      description: z.string(),
      code: z.string(),
      dailyHosLimit: z.number(),
      weeklyHosLimit: z.number(),
      emailDistributionList: z.array(z.string()),
      isActive: z.boolean(),
      isLocked: z.boolean(),
      weatherLocation: WeatherLocationDto,
      lockedByName: z.string().optional(),
    }),
  ),
  recentAor: z.array(z.string()),
  activeAors: z.array(z.string()),
});

export const AreasOfResponsibilityResponseDto = AreaOfResponsibilityDto;
export type AreaOfResponsibility = z.infer<typeof AreaOfResponsibilityDto>;
export type AreasOfResponsibilityResponse = z.infer<
  typeof AreasOfResponsibilityResponseDto
>;

export const AreasOfResponsibilityApiResponseDto = z.object({
  message: z.string(),
  data: AreaOfResponsibilityDto,
});
export type AreasOfResponsibilityApiResponse = z.infer<
  typeof AreasOfResponsibilityApiResponseDto
>;

//Controller User
export const ControllerUserDto = z.object({
  _id: z.string(),
  username: z.string(),
});

export const ControllerUserResponseDto = z.array(ControllerUserDto);

export const ControllerUserApiResponseDto = z.object({
  message: z.string(),
  data: ControllerUserResponseDto,
});

export type ControllerUser = z.infer<typeof ControllerUserDto>;
export type ControllerUserResponse = z.infer<typeof ControllerUserResponseDto>;
export type ControllerUserApiResponse = z.infer<
  typeof ControllerUserApiResponseDto
>;

//Shift Assignment
export const ShiftAssignmentDto = z.object({
  aorId: z
    .array(z.string())
    .min(1, "At least one area of responsibility must be selected"),
  ratingId: z.string().min(1, "Quality rating must be selected").optional(),
  continuousRestHours: z
    .number()
    .min(1, "Rest hours must be specified")
    .optional(),
  loginTime: z.string().optional(),
});

export type ShiftAssignmentData = z.infer<typeof ShiftAssignmentDto>;

//Company
export const CompanyDto = z.object({
  _id: z.string(),
  name: z.string(),
});

export const CompanyResponseDto = z.array(CompanyDto);

export const CompanyListApiResponseDto = z.object({
  message: z.string(),
  data: z.array(CompanyDto),
});

export type Company = z.infer<typeof CompanyDto>;
export type CompanyResponse = z.infer<typeof CompanyResponseDto>;
export type CompanyListApiResponse = z.infer<typeof CompanyListApiResponseDto>;

//Upload Signature
export const UploadSignatureResponseDto = z.object({
  message: z.string(),
  data: z.object({
    path: z.string(),
  }),
});

export type UploadSignatureResponse = z.infer<
  typeof UploadSignatureResponseDto
>;

export type ImpersonateResponse = {
  token: string;
};