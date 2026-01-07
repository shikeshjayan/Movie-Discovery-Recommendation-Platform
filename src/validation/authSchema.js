import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be less than 30 characters"),

  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      "Password must contain uppercase, lowercase and a number"
    ),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

export const signinSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email"),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
