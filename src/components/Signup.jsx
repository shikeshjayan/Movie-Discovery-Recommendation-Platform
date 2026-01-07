import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../validation/authSchema";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
const Signup = () => {
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
    } catch (error) {
      console.log("Signup Error", error.code, error.message);
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
          <h4 className="text-2xl font-semibold mb-6 text-blue-500">Sign Up</h4>
          <h5 className="absolute top-4 right-4 text-blue-500 cursor-pointer">
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
                className="border border-blue-300 rounded px-3 py-2"
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

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-blue-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="border border-blue-300 rounded px-3 py-2"
                {...register("confirmPassword")}
              />
              <p>{errors.confirmPassword?.message}</p>
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
