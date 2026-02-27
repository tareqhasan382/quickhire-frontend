import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import authImage from "../assets/auth.jpg";

import { useSignupMutation, useLoginMutation } from "../Redux/authApi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import toast from "react-hot-toast";
import { signupSchema, type SignupFormData } from "../validations/signup.validation";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [signup] = useSignupMutation();
  const [login] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Signup
      await signup(data).unwrap();

      // Auto Login
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      toast.success("Account created & logged in 🎉");
      navigate("/");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="md:w-1/2 bg-blue-600 flex items-center justify-center p-8">
          <div className="text-center text-white space-y-4">
            <h1 className="text-4xl font-bold">Join Us 🚀</h1>
            <p className="text-lg opacity-90">
              Create your account today
            </p>
            <img
              src={authImage}
              alt="Signup"
              className="mt-6 rounded-xl w-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-500 mt-1">
              Fill the details to get started
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            {/* NAME */}
            <div>
              <div className="relative">
                <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("name")}
                  placeholder="Full Name"
                  className="input pl-12"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <div className="relative">
                <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("email")}
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
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-btn"
            >
              {isSubmitting ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">OR</span>
            <hr className="flex-1" />
          </div>

          {/* SOCIAL */}
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

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;