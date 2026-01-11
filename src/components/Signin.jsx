import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signinSchema } from "../validation/authSchema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

/**
 * Signin Component
 * Handles user authentication via Firebase email/password login.
 * Includes form validation using Yup and visibility toggles for the password field.
 */
const Signin = () => {
  // Navigation & Router hooks
  const navigate = useNavigate();
  const location = useLocation(); // Required to access navigation state (previous page)
  const { theme } = useContext(ThemeContext);

  // Local UI State
  const [showPassword, setShowPassword] = useState(false);

  // Form configuration with React Hook Form & Yup Validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signinSchema),
    mode: "onSubmit", // Validates only when user clicks submit
  });

  /**
   * Handles the form submission logic.
   * Attempts to sign in the user and redirects them upon success.
   * @param {Object} data - Form data containing email and password
   */
  const onSubmit = async (data) => {
    // console.log("LOGIN SUBMITTED", data); // Unnecessary for production

    try {
      // Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // console.log("Login Success:", userCredential.user); // Unnecessary for production

      // Redirect to the page they came from, or default to home
      // Note: location.state is set if you used <Navigate state={{ from: location }} /> elsewhere
      const redirectTo = location.state?.from || "/home";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      // Error handling based on Firebase error codes
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  /**
   * Toggles the password input visibility between 'text' and 'password'
   */
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <section
      className={`min-h-screen w-full flex items-center justify-center mx-auto ${
        theme === "dark"
          ? "bg-[#312F2C] text-[#ECF0FF]"
          : "bg-[#ECF0FF] text-[#312F2C]"
      }`}
    >
      {/* Main Card Container */}
      <div className="bg-[#ECF0FF] w-full max-w-4xl h-150 flex rounded-lg shadow-lg overflow-hidden">
        {/* Left Side - Image (Hidden on mobile) */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/signupCover.jpg"
            alt="Signin Cover"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy" // Optimization: Lazy load non-critical images
          />
        </div>

        {/* Right Side - Form */}
        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Log In</h4>

          {/* Navigation to Sign Up */}
          <h5
            onClick={() => navigate("/signup")}
            className="absolute top-4 right-4 text-blue-500 cursor-pointer hover:underline"
            role="button"
            tabIndex={0}
          >
            Sign Up
          </h5>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            noValidate // Disables browser default validation to use custom Yup validation
          >
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
                <p className="text-red-500 text-sm mt-1">
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
                  className={`border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button" // Prevent form submission
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
            </div>

            {/* Submit Button */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
