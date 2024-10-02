import zod from "zod";

export const zodUser = zod.object({
  username: zod
    .string()
    .min(3, { message: "username cannot be less than 3 character" }),
  email: zod.string().email({ message: "invalid email address" }),
  password: zod
    .string()
    .min(8, { message: "password length cannot be less than 8 character " })
    .max(15, { message: "password length cannot be more than 15 character" }),
});

export const loginUser = zod.object({
  // either they can login from username or email
  username: zod
    .string()
    .min(3, { message: "username cannot be less than 3 character" })
    .optional(),
  email: zod.string().email({ message: "invalid email address" }).optional(),
  password: zod
    .string()
    .min(8, { message: "password length cannot be less than 8 character " })
    .max(15, { message: "password length cannot be more than 15 character" }),
});

export const deleteUser = zod.object({
  email: zod.string().email({ message: "invalid email address" }),
  password: zod
    .string()
    .min(8, { message: "password length cannot be less than 8 character " })
    .max(15, { message: "password length cannot be more than 15 character" }),
});

export const updateUser = zod.object({
  email: zod.string().email({ message: "invalid email address" }).optional(),
  password: zod
    .string()
    .min(8, { message: "password length cannot be less than 8 character " })
    .max(15, { message: "password length cannot be more than 15 character" })
    .optional(),
  username: zod.string().optional(),
});

export const resetPasswordRequest = zod.object({
  newPassword: zod
    .string()
    .min(8, { message: "password length cannot be less than 8 character " })
    .max(15, { message: "password length cannot be more than 15 character" }),
});

export const resetRequest = zod.object({
  email: zod.string().email({ message: "invalid email address" }),
});
