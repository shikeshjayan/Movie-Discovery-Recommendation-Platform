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
const Signup = () => {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    console.log("FORM SUBMITTED", data);

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

      console.log("User created & data saved");
      navigate("/signin", {
        replace: true,
        state: { success: "Account created. Please log in." },
      });
    } catch (error) {
      console.log("Signup Error", error.code, error.message);
    }
  };

  const toggleVisibility = () => setShowPassword(!showPassword);
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
      <div className="bg-[#ECF0FF] w-full max-w-4xl h-150 flex rounded-lg shadow-lg overflow-hidden">
        {/* Left side */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="/signupCover.jpg"
            loading="eager"
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right side */}
        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Sign Up</h4>
          <h5
            onClick={() => navigate("/signin")}
            className="absolute top-4 right-4 text-blue-500 cursor-pointer"
          >
            Log In
          </h5>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="username" className="text-blue-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="border text-[#312F2C] border-blue-300 rounded px-3 py-2"
                {...register("name")}
              />
              <p>{errors.name?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border text-[#312F2C] border-blue-300 rounded px-3 py-2"
                {...register("email")}
              />
              <p>{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-blue-300">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  // Dynamic Type
                  type={showPassword ? "text" : "password"}
                  className="border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full pr-10"
                  {...register("password")}
                />

                {/* Icon Button */}
                <span
                  onClick={toggleVisibility}
                  className="absolute right-3 cursor-pointer text-[#312F2C]"
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              <p className="text-red-500 text-xs">{errors.password?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-blue-300">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="border text-[#312F2C] border-blue-300 rounded px-3 py-2 w-full pr-10"
                  {...register("confirmPassword")}
                />
                <span
                  onClick={toggleConfirmVisibility}
                  className="absolute right-3 cursor-pointer text-[#312F2C]"
                >
                  {showConfirmPassword ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </span>
              </div>
              <p className="text-red-500 text-xs">
                {errors.confirmPassword?.message}
              </p>
            </div>

            <button
              disabled={isSubmitting}
              className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
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
