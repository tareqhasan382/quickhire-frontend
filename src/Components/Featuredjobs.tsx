import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "./Container";
import { ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.png"
import { useGetJobsQuery } from "../Redux/jobs/jobsApi";
import type { RootState } from "../Redux/store";

const FeaturedJobs = () => {
  const navigate = useNavigate();

  // Get filters from Redux
  const filters = useSelector((state: RootState) => state.jobs.filters);

  // Limit featured jobs to 4
  const { data, isLoading, isError } = useGetJobsQuery({
    ...filters,
    page: 1,
    limit: 4,
  });

  return (
    <section className="w-full py-24 bg-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured Jobs
          </h2>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all"
          >
            Show all jobs <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Job Cards Grid */}
        {isLoading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : isError || !data ? (
          <p className="text-red-500">Failed to load jobs.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {data.data.map((job) => (
              <div
                key={job._id}
                className="bg-gray-50 hover:bg-blue-50 transition duration-300 rounded-2xl shadow-sm p-5 flex flex-col gap-4 cursor-pointer"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                {/* Top Row: Logo + Type */}
                <div className="flex items-center justify-between">
                  {/* Placeholder logo if no company logo */}
                  <img
                    src={ logo}
                    alt={job.company}
                    className="w-10 h-10 object-contain"
                  />
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Full Time
                  </span>
                </div>

                {/* Job Info */}
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <div className="flex text-gray-500 text-sm gap-2">
                    <p>{job.company}</p>
                    <span>•</span>
                    <p>{job.location?.city || "Remote"}</p>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-3">{job.description}</p>
                </div>

                {/* Skills (using category for simplicity) */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded-lg">
                    {job.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedJobs;