import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden items-center justify-center font-rubik">

      {/* Top spacing wrapper */}
      <div className="pt-[102px]">
        <Navbar />
      </div>

      {/* Page content */}
      <main className="mx-auto w-full">
        <Outlet />
      </main>
      <div className="">
        <Footer />
      </div>

    </div>
  );
};

export default Layout;
