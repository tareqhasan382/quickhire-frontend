import Container from "./Container";

const Navbar = () => {
 

  return (
    <nav className="w-full fixed top-5 left-0 z-50">
      <Container className=" mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8 ">
        <div>
          <h1>Navbar</h1>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;