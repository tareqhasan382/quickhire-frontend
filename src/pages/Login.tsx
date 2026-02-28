import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import authImage from "../assets/data_security.jpg";
import { useLoginMutation } from "../Redux/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";

/* =========================
   ZOD SCHEMA
========================= */
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, isError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await login(data).unwrap();
      toast.success("Login successful 🎉");
      const role = res?.data?.user?.role;

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };
  

  useEffect(() => {
    if (auth?.accessToken && auth.user) {
      // Redirect based on role
      if (auth.user.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [auth, navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 bg-blue-600 flex items-center justify-center p-8">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl font-bold">Welcome Back 👋</h1>
            <p className="text-lg opacity-90">
              Login to continue your journey
            </p>
            <img
              src={authImage}
              alt="Auth"
              className="mt-6 rounded-xl w-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Login to your account
            </h2>
            <p className="text-gray-500 mt-1">
              Enter your email & password
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* EMAIL */}
            <div>
              <div className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email address"
                  className="input pl-12"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <div className="relative">
                <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* ERROR */}
            {isError && (
              <p className="text-red-600 text-sm">
                Invalid email or password
              </p>
            )}

            <button
              disabled={isLoading}
              className="primary-btn disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">OR</span>
            <hr className="flex-1" />
          </div>

          {/* SOCIAL LOGIN */}
          <div className="flex gap-4">
            <button className="social-btn">
              <FcGoogle size={20} />
              Google
            </button>
            <button className="social-btn">
              <FaFacebookF size={20} className="text-blue-600" />
              Facebook
            </button>
          </div>

          {/* SIGNUP */}
          <p className="text-center text-gray-500 text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;