import Container from "./Container";

const CTA = () => {
    const dashboardImage = "https://cdn.prod.website-files.com/68e9e85a5b12150471bd3ee4/68fe9aaac9f42a7fef9e97eb_marketing-campaign-dashboard.svg"
  return (
    <section className="w-full py-24">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 md:px-16 py-14 text-white">
          
          <div className="grid md:grid-cols-2 items-center gap-10">
            
            {/* Left Side */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Start posting <br /> jobs today
              </h2>

              <p className="text-blue-100 text-lg">
                Start posting jobs for only <span className="font-semibold">$10</span>.
              </p>

              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300 shadow-lg">
                Sign Up For Free
              </button>
            </div>

            {/* Right Side */}
            <div className="relative flex justify-center md:justify-end">
              <img
                src={dashboardImage}
                alt="Dashboard Preview"
                className="w-full max-w-md drop-shadow-2xl"
              />
            </div>

          </div>

          {/* Optional decorative blur */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

        </div>

      </Container>
    </section>
  );
};

export default CTA;