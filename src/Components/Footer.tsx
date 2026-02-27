import Container from "./Container";
import logo from "../assets/logo.png";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-24 font-rubik bg-black text-white py-16 w-full">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">

          {/* Logo */}
          <div className="space-y-4 col-span-2">
            <div className="flex items-center gap-2">
              <img src={logo} alt="QuickHire Logo" className="w-9 h-9 object-contain" />
              <h3 className="text-xl font-bold">
                Quick<span className="text-blue-500">Hire</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted platform to find jobs & grow careers.
            </p>
          </div>

          {/* About */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">About</h4>
            <div className="flex flex-col gap-1 text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-500 transition">Companies</a>
              <a href="#" className="hover:text-blue-500 transition">Pricing</a>
              <a href="#" className="hover:text-blue-500 transition">Terms</a>
              <a href="#" className="hover:text-blue-500 transition">Advice</a>
              <a href="#" className="hover:text-blue-500 transition">Privacy Policy</a>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white">Resources</h4>
            <div className="flex flex-col gap-1 text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-500 transition">Help Desk</a>
              <a href="#" className="hover:text-blue-500 transition">Guide</a>
              <a href="#" className="hover:text-blue-500 transition">Updates</a>
              <a href="#" className="hover:text-blue-500 transition">Contact Us</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h4 className="font-semibold text-white">Get Job Notifications</h4>
            <p className="text-gray-400 text-sm">
              The latest job news & articles sent to your inbox weekly.
            </p>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-800 pt-6 text-gray-400 text-sm">
          <p>© 2026 QuickHire. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#"><Facebook className="w-5 h-5 hover:text-blue-500 transition" /></a>
            <a href="#"><Instagram className="w-5 h-5 hover:text-pink-500 transition" /></a>
            <a href="#"><Linkedin className="w-5 h-5 hover:text-blue-600 transition" /></a>
            <a href="#"><Twitter className="w-5 h-5 hover:text-blue-400 transition" /></a>
          </div>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;