import Category from "./Components/Category";
import CompaniesAdd from "./Components/CompaniesAdd";
import CTA from "./Components/CTA";
import FeaturedJobs from "./Components/Featuredjobs";
import Header from "./Components/Header";
import LatestJobsOpen from "./Components/LatestJobsOpen";

function App() {
  return (
    <div className=" w-full ">
      <Header/>
      <CompaniesAdd/>
      <Category/>
      <CTA/>
      <FeaturedJobs/>
      <LatestJobsOpen/>
    </div>
  );
}

export default App;
