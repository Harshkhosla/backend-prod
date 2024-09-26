import { z } from "zod";

// This is the zod implementation fot he checking of the input fileds that we are entring

export const userSchema = z.object({
  firstName: z.string().min(3, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  givenName: z.string().optional(),
  familyName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
