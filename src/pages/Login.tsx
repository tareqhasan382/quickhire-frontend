import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa6";
import { Link } from "react-router-dom";
import authImage from "../assets/data_security.jpg"
const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 mt-20 md:mt-0">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row">

        {/* Left Branding */}
        <div className="md:w-1/2 bg-blue-600 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
            <p className="text-lg">Login to continue shopping</p>
            <img
              src={authImage}
              alt="Sneakers"
              className="mt-6 rounded-xl object-cover w-full"
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center gap-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Login to Your Account
          </h2>
          <p className="text-gray-500">
            Enter your email & password to login
          </p>

          <form className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
            />

            <button className="primary-btn">
              Login
            </button>
          </form>

          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-400">OR</span>
            <hr className="flex-1" />
          </div>

          <div className="flex gap-4">
            <button className="social-btn">
              <FcGoogle size={20} /> Google
            </button>
            <button className="social-btn">
              <FaFacebookF size={20} /> Facebook
            </button>
          </div>

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