import Container from "./Components/Container";

function App() {
  return (
    <Container className="font-rubik" >

      {/* Main hero area */}
      <div className="w-full flex justify-center items-center h-[265px] px-4">
        <h1 className="font-rubik font-extrabold uppercase text-center whitespace-nowrap
                 text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[11rem] xl:text-[11rem]
                 leading-[3.5rem] sm:leading-[5.5rem] md:leading-[9rem] lg:leading-[15rem] xl:leading-[19rem]
                 tracking-normal">
          DO IT <span className="text-blue-500">RIGHT</span>
        </h1>
      </div>

   
    </Container>
  );
}

export default App;
