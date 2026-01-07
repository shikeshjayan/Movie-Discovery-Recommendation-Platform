import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { signinSchema } from "../validation/authSchema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signinSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data) => {
    console.log("LOGIN SUBMITTED", data);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log("Login Success:", userCredential.user);
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      }
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      }
    }
  };
  return (
    <section className="min-h-screen w-screen grid place-items-center bg-gray-100">
      <div className="bg-white w-full max-w-4xl h-125 flex rounded-lg shadow-lg overflow-hidden">
        {/* Left side */}
        <div className="hidden md:flex w-1/2 bg-red-400 items-center justify-center">
          <span className="text-white text-2xl font-bold">
            <img src="/signupCover.jpg" alt="" className="object-cover" />
          </span>
        </div>

        {/* Right side */}
        <div className="relative w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Log In</h4>
          <h5 className="absolute top-4 right-4 text-blue-500 cursor-pointer">
            Sign Up
          </h5>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-blue-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border border-blue-300 rounded px-3 py-2"
                {...register("email")}
              />
              <p>{errors.email?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-blue-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="border border-blue-300 rounded px-3 py-2"
                {...register("password")}
              />
              <p>{errors.password?.message}</p>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signin;
