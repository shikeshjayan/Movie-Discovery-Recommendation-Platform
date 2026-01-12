import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validation/authSchema";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../context/ThemeProvider";
import BlurImage from "../ui/BlurImage";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**
 * Signup Component
 * ----------------
 * - Email/password sign-up with React Hook Form + Yup
 * - Password strength indicator
 * - Confirm password match indicator
 * - Form data persisted in localStorage (survives refresh)
 * - Clear form button to reset everything
 */
const Signup = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [matchStrength, setMatchStrength] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const confirmPasswordValue = watch("confirmPassword") || "";

  // ✅ Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("signupFormData");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.name) setValue("name", data.name);
        if (data.email) setValue("email", data.email);
        if (data.password) setValue("password", data.password);
        if (data.confirmPassword)
          setValue("confirmPassword", data.confirmPassword);
      } catch (e) {
        console.warn("Failed to parse saved signup data", e);
      }
    }
  }, [setValue]);

  // ✅ Save form values to localStorage whenever they change
  const name = useWatch({ control, name: "name" });
  const email = useWatch({ control, name: "email" });
  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  useEffect(() => {
    const data = { name, email, password, confirmPassword };
    localStorage.setItem("signupFormData", JSON.stringify(data));
  }, [name, email, password, confirmPassword]);

  // ✅ Password strength checker
  const checkStrength = (password) => {
    if (!password) return "";
    if (password.length < 6) return "Weak";
    if (
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return "Strong";
    }
    return "Medium";
  };

  // ✅ Progressive match indicator (password vs confirm password)
  useEffect(() => {
    setPasswordStrength(checkStrength(passwordValue));

    if (!confirmPasswordValue) {
      setMatchStrength("");
      return;
    }

    let matchCount = 0;
    for (let i = 0; i < confirmPasswordValue.length; i++) {
      if (passwordValue[i] === confirmPasswordValue[i]) {
        matchCount++;
      }
    }

    const similarity = (matchCount / passwordValue.length) * 100;

    if (
      similarity === 100 &&
      passwordValue.length === confirmPasswordValue.length
    ) {
      setMatchStrength("Perfect Match");
    } else if (similarity > 50) {
      setMatchStrength("Partially Matching");
    } else {
      setMatchStrength("No Match");
    }
  }, [passwordValue, confirmPasswordValue]);

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: data.name,
        email: data.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      // ✅ Clear saved form data after successful signup
      localStorage.removeItem("signupFormData");

      navigate("/signin", {
        replace: true,
        state: { success: "Account created. Please log in." },
      });

      reset();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage(
          "This email is already registered. Please log in instead."
        );
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password should be at least 6 characters.");
      } else {
        setErrorMessage("Sign up failed. Please try again.");
      }
    }
  };

  return (
    <section
      className={`min-h-screen w-screen grid place-items-center ${
        theme === "dark"
          ? "bg-[#312F2C] text-[#ECF0FF]"
          : "bg-[#ECF0FF] text-[#312F2C]"
      }`}
    >
      <div className="bg-[#ECF0FF] w-full max-w-4xl min-h-180 flex rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Cover image */}
        <div className="hidden md:block w-1/2 relative bg-gray-200">
          <BlurImage
            src="/signupCover.jpg"
            alt="Sign up cover"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Sign Up</h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Username */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-blue-500 font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`border text-[#312F2C] border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-500 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`border text-[#312F2C] border-blue-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-blue-500 font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`border text-[#312F2C] border-blue-300 rounded-md px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <img src="/open-eye.png" alt="" />
                  ) : (
                    <img src="/closed-eye.png" alt="" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
              {passwordStrength && (
                <p
                  className={`text-xs mt-1 ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Strength: {passwordStrength}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-blue-500 font-medium"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`border text-[#312F2C] border-blue-300 rounded-md px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 focus:outline-none cursor-pointer"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <img src="/open-eye.png" alt="" />
                  ) : (
                    <img src="/closed-eye.png" alt="" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
              {matchStrength && (
                <p
                  className={`text-xs mt-1 ${
                    matchStrength === "Perfect Match"
                      ? "text-green-500"
                      : matchStrength === "Partially Matching"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {matchStrength}
                </p>
              )}
            </div>

            {/* Inline error message */}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}

            {/* Submit & Clear */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </motion.button>

            <button
              type="button"
              onClick={() => {
                reset();
                localStorage.removeItem("signupFormData");
              }}
              className="text-sm text-gray-500 hover:text-red-700"
            >
              Clear form
            </button>
          </form>

          {/* Bottom navigation */}
          <p className="text-gray-500 text-sm mt-4 text-center">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
