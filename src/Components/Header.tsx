import Container from "./Container";
import image from "../assets/header-image.png";
import { Search, MapPin } from "lucide-react";

const Header = () => {
  return (
    <section className="w-full -mt-10 pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">
        
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Side */}
          <div className="space-y-8 relative">
            
            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                Discover <br />
                more than <span className="text-blue-600">5000+ Jobs</span>
              </h1>

              <p className="text-gray-600 text-lg max-w-lg">
                Great platform for job seekers searching for new career heights 
                and passionate about startups.
              </p>
            </div>

            {/* 🔥 Search Box (Overlay Version) */}
            <div className="absolute top-[220px] md:top-[340px] left-0 w-[130%] z-20">
              <div className="bg-white shadow-2xl rounded-2xl p-5">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  
                  {/* Job Input */}
                  <div className="flex items-center gap-3 w-full border rounded-lg px-4 py-3">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      className="w-full outline-none text-gray-700"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 w-full border rounded-lg px-4 py-3">
                    <MapPin className="text-gray-400 w-5 h-5" />
                    <select className="w-full outline-none text-gray-700 bg-transparent">
                      <option>Select Location</option>
                      <option>Dhaka</option>
                      <option>Chittagong</option>
                      <option>Sylhet</option>
                    </select>
                  </div>

                  {/* Button */}
                  <button className="w-full md:w-auto shrink-0 whitespace-nowrap bg-blue-600 text-white px-10 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
  Search Job
</button>

                </div>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="pt-40">
              <p className="text-gray-500 text-sm">
                Popular:{" "}
                <span className="text-gray-700 font-medium">
                  UI Designer, UX Researcher, Android, Admin
                </span>
              </p>
            </div>

          </div>

          {/* Right Side */}
          <div className="flex justify-center relative z-10">
            <img
              src={image}
              alt="Header Illustration"
              className="w-full max-w-md md:max-w-lg object-contain"
            />
          </div>

        </div>

      </Container>
    </section>
  );
};

export default Header;