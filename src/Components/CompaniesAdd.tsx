
import Container from "./Container";


const CompaniesAdd = () => {
    const logo = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxW_40wth1e4ORrF2cnchbPx8hSNnZWkO-sg&s"
  return (
    <section className="w-full -mt-10 pt-24 pb-20 bg-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">

       <div className="space-y-4 mb-14">
  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
    Companies We Helped Grow
  </h3>
  {/* <p className="text-gray-500 text-sm md:text-base max-w-md">
    Trusted by startups and leading companies worldwide
  </p> */}
</div>

        {/* Logos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
          
          <img
            src={logo}
            alt="Company 1"
            className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300"
          />

          <img
            src={logo}
            alt="Company 2"
            className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300"
          />

          <img
            src={logo}
            alt="Company 3"
            className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300"
          />

          <img
            src={logo}
            alt="Company 4"
            className="h-10 object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300"
          />

        </div>

      </Container>
    </section>
  );
};

export default CompaniesAdd;