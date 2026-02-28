import { useNavigate } from "react-router-dom";
import Container from "./Container";
import { ArrowUpRight } from "lucide-react";
import { useGetJobsQuery } from "../Redux/jobs/jobsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../Redux/store";
import logo from "../assets/logo.png"
const LatestJobsOpen = () => {
  const navigate = useNavigate();

  // Get filters from Redux (if you want location/title filtering)
  const filters = useSelector((state: RootState) => state.jobs.filters);

  // Fetch latest jobs, limit to 4
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
            Latest Jobs Open
          </h2>
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all"
          >
            Show all jobs <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : isError || !data ? (
          <p className="text-red-500">Failed to load jobs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.data.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="flex gap-4 p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl shadow-sm transition cursor-pointer"
              >
                {/* Left Side - Logo */}
                <img
                  src={logo}
                  alt={job.company}
                  className="w-16 h-16 object-contain rounded-lg"
                />

                {/* Right Side - Job Info */}
                <div className="flex flex-col justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>

                  <div className="flex gap-2 text-gray-500 text-sm mt-1">
                    <p>{job.company}</p>
                    <span>•</span>
                    <p>{job.location?.city || "Remote"}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                      Full Time
                    </span>
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default LatestJobsOpen;