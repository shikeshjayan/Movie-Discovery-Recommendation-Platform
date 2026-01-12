import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signinSchema } from "../validation/authSchema";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import BlurImage from "../ui/BlurImage";
import { motion } from "framer-motion";
/**
 * Signin Component
 * ----------------
 * Login form with:
 * - Email + password fields
 * - Remember Me (localStorage + sessionStorage)
 * - Password visibility toggle
 * - Password strength indicator
 * - Forgot password handler
 * - Redirect after login
 */
const Signin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signinSchema),
    mode: "onSubmit",
  });

  const passwordValue = watch("password");

  // ✅ Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = sessionStorage.getItem("rememberPassword");

    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true); // auto-check "Remember Me"
    }
    if (savedPassword) {
      setValue("password", savedPassword);
    }
  }, [setValue]);

  // ✅ Toggle password visibility
  const toggleVisibility = () => setShowPassword((prev) => !prev);

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

  // ✅ Update strength on password change
  useEffect(() => {
    setPasswordStrength(checkStrength(passwordValue));
  }, [passwordValue]);

  // ✅ Handle form submission
  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // ✅ Save or clear credentials based on "Remember Me"
      if (rememberMe) {
        localStorage.setItem("rememberEmail", data.email);
        sessionStorage.setItem("rememberPassword", data.password);
      } else {
        localStorage.removeItem("rememberEmail");
        sessionStorage.removeItem("rememberPassword");
      }

      // ✅ Redirect to intended page or fallback to /home
      const redirectTo = location.state?.from || "/home";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  // ✅ Handle forgot password
  const handleForgotPassword = async () => {
    const email = watch("email");
    if (!email) {
      alert("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert("Failed to send reset email");
    }
  };

  return (
    <section
      className={`min-h-screen w-full flex items-center justify-center mx-auto ${
        theme === "dark"
          ? "bg-[#312F2C] text-[#ECF0FF]"
          : "bg-[#ECF0FF] text-[#312F2C]"
      }`}
    >
      <div className="bg-[#ECF0FF] w-full max-w-4xl h-150 flex rounded shadow-lg overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:block w-1/2 relative">
          <BlurImage
            src="/signupCover.jpg"
            alt="Signin Cover"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Sign In</h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-300 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-blue-300 font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute right-3 text-[#312F2C] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
              {passwordStrength && (
                <p
                  className={`text-sm mt-1 ${
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

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <motion.input
                  whileHover={{
                    borderColor: "#0073ff",
                    boxShadow: "0 5px 20px rgba(0,116,224,0.15)",
                  }}
                  whileFocus={{
                    scale: 1.03,
                    letterSpacing: "-0.5px",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="text-blue-500 text-sm">
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-500 text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <div className="flex justify-center gap-2 mt-4 text-sm">
            <p className="text-gray-500">Don't have an account?</p>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signin;
