import { z } from "zod";

export const RegisterDto = z
  .object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(15, "Username must be at most 15 characters")
      .regex(
        /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/? ]+$/,
        "Username can only contain letters, numbers, spaces, and special characters",
      ),
    email: z
      .string()
      .email("Invalid email format")
      .regex(
        /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email must contain at least one letter before @",
      )
      .nonempty("Email is required"),
    password: z.string().min(6, "Password is required"),
    confirmPassword: z.string().min(6).nonempty("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const LoginDto = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must contain at least one letter before @",
    ),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

export const ForgotPasswordDto = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .regex(
      /^(?=.*[a-zA-Z])[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must contain at least one letter before @",
    )
    .min(1, "Email is required"),
});

export const RoleSelectionDto = z.object({
  role: z.enum(["active-controller", "administrator", "observer"], {
    required_error: "Please select a role",
  }),
});

export const AreaSelectionDto = z.object({
  areas: z.array(z.string()).min(1, "Please select at least one area"),
  nextHours: z.number().min(1, "Next hours must be specified"),
});

export const ResetPasswordDto = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterData = z.infer<typeof RegisterDto>;
export type LoginData = z.infer<typeof LoginDto>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordDto>;
export type RoleSelectionData = z.infer<typeof RoleSelectionDto>;
export type AreaSelectionData = z.infer<typeof AreaSelectionDto>;
export type ResetPasswordData = z.infer<typeof ResetPasswordDto>;
