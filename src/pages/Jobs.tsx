import { useState, useEffect } from "react";
import Container from "../Components/Container";
import { MapPin, Briefcase } from "lucide-react";
import { useGetJobsQuery, type JobQueryParams } from "../Redux/jobs/jobsApi";

const Jobs = () => {
  const [filters, setFilters] = useState<JobQueryParams>({
    page: 1,
    limit: 9,
    title: "",
    location: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Debounce state
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Apply debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, title: debouncedSearch, page: 1 }));
  }, [debouncedSearch]);

  const { data, isLoading, isError, refetch } = useGetJobsQuery(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, location: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [filters]);

  return (
    <section className="w-full py-24 bg-gray-50">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Jobs</h1>
          <p className="text-gray-600">Browse jobs by title or location</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by job title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="input flex-1"
          />
          <select
            value={filters.location}
            onChange={handleLocationChange}
            className="input flex-1"
          >
            <option value="">All Locations</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
          </select>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <p className="text-gray-500">Loading jobs...</p>
        ) : isError || !data ? (
          <p className="text-red-500">Failed to load jobs.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h2>
                    <p className="text-gray-600">{job.company}</p>

                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location?.city || "Remote"}</span>

                      <Briefcase className="w-4 h-4" />
                      <span>{job.category}</span>
                    </div>
                  </div>

                  <button className="mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              {Array.from(
                { length: Math.ceil(data.meta.total / data.meta.limit) },
                (_, i) => i + 1
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-4 py-2 rounded-lg ${
                    pageNum === filters.page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
};

export default Jobs;