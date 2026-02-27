import Container from "./Container";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white backdrop-blur-md shadow-sm">
      <Container className="mx-auto max-w-[1192px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className=" flex items-center justify-center gap-10 ">
            {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="QuickHire Logo" className="w-9 h-9 object-contain" />
            <h3 className="text-xl font-bold text-gray-800">
              Quick<span className="text-blue-600">Hire</span>
            </h3>
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/jobs"
              className="text-gray-600 font-medium hover:text-blue-600 transition duration-200"
            >
              Find Jobs
            </a>

            <a
              href="/companies"
              className="text-gray-600 font-medium hover:text-blue-600 transition duration-200"
            >
              Browse Companies
            </a>
          </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-gray-700 font-medium hover:text-blue-600 transition duration-200"
            >
              Login
            </a>

            <a
              href="/signup"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-sm"
            >
              Sign Up
            </a>
          </div>

        </div>
      </Container>
    </nav>
  );
};

export default Navbar;