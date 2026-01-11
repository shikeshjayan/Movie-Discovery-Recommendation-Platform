import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validation/authSchema";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeContext } from "../context/ThemeProvider";

/**
 * Signup Component
 * Handles user registration via Firebase email/password.
 * On success, creates a user document in Firestore and redirects to login.
 */
const Signup = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Local state for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form setup with React Hook Form and Yup validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });

  /**
   * Handles form submission: creates a Firebase user and saves profile data.
   * @param {Object} data - Form data (name, email, password, confirmPassword)
   */
  const onSubmit = async (data) => {
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

      navigate("/signin", {
        replace: true,
        state: { success: "Account created. Please log in." },
      });

      // Clear the form after successful signup so it's clean next time
      reset();
    } catch (error) {
      // Handle common Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please log in instead.");
      } else if (error.code === "auth/invalid-email") {
        alert("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Sign up failed. Please try again.");
      }
    }
  };

  /**
   * Toggles password field visibility
   */
  const toggleVisibility = () => setShowPassword(!showPassword);

  /**
   * Toggles confirm password field visibility
   */
  const toggleConfirmVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <section
      className={`min-h-screen w-screen grid place-items-center ${
        theme === "dark"
          ? "bg-[#312F2C] text-[#ECF0FF]"
          : "bg-[#ECF0FF] text-[#312F2C]"
      }`}
    >
      {/* Main signup card */}
      <div className="bg-[#ECF0FF] w-full max-w-4xl h-150 flex rounded-lg shadow-lg overflow-hidden">
        {/* Left side - Cover image (hidden on mobile) */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/signupCover.jpg"
            alt="Sign up cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right side - Form */}
        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Sign Up</h4>

          {/* Navigation to Sign In */}
          <h5
            onClick={() => navigate("/signin")}
            className="absolute top-4 right-4 text-blue-500 cursor-pointer hover:underline"
            role="button"
            tabIndex={0}
          >
            Log In
          </h5>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate // Disable browser validation; rely on Yup
          >
            {/* Username Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-blue-300 font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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

            {/* Email Field */}
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-blue-300 font-medium">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="confirmPassword"
                className="text-blue-300 font-medium"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="absolute right-3 text-[#312F2C] focus:outline-none"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                  />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
