import { useState } from "react";
import Container from "../Components/Container";
import {
  useGetJobsQuery,
  useCreateJobMutation,
  useDeleteJobMutation,
} from "../Redux/jobs/jobsApi";
import { useGetApplicationsQuery } from "../Redux/application/applicationApi";
import toast from "react-hot-toast";
import { JOB_CATEGORIES, JOB_LOCATION_TYPES } from "../types/jobEnums";

/* ================= TYPES ================= */
type JobCategory = (typeof JOB_CATEGORIES)[number];
type JobLocationType = (typeof JOB_LOCATION_TYPES)[number];

/* ================= POPUP ================= */
const Popup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 font-bold text-gray-500"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

/* ================= DASHBOARD ================= */
const Dashboard = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  /* ===== SINGLE SOURCE OF TRUTH ===== */
  const [newJob, setNewJob] = useState<{
    title: string;
    company: string;
    category: JobCategory | "";
    locationType: JobLocationType | "";
    city: string;
    description: string;
  }>({
    title: "",
    company: "",
    category: "",
    locationType: "",
    city: "",
    description: "",
  });

  /* ================= API ================= */
  const { data: jobsData, isLoading, refetch } = useGetJobsQuery({
    page: 1,
    limit: 20,
  });

  const { data: applicationsData } = useGetApplicationsQuery({
    page: 1,
    limit: 50,
  });

  const [createJob, { isLoading: creating }] = useCreateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  /* ================= HELPERS ================= */
  const updateJob = (key: keyof typeof newJob, value: string) => {
    setNewJob((prev) => ({ ...prev, [key]: value }));
  };

  const validateJob = () => {
    if (!newJob.title) return "Title is required";
    if (!newJob.company) return "Company is required";
    if (!newJob.category) return "Category is required";
    if (!newJob.locationType) return "Location type is required";
    if (newJob.locationType !== "Remote" && !newJob.city)
      return "City is required";
    if (!newJob.description) return "Description is required";
    return null;
  };

  /* ================= CREATE ================= */
  const handleCreateJob = async () => {
    const error = validateJob();
    if (error) return toast.error(error);

    try {
      await createJob({
        title: newJob.title,
        company: newJob.company,
        category: newJob.category,
        description: newJob.description,
        location: {
          type: newJob.locationType,
          city:
            newJob.locationType === "Remote"
              ? undefined
              : newJob.city,
        },
      }).unwrap();

      toast.success("Job created successfully");
      setIsCreateOpen(false);
      refetch();

      setNewJob({
        title: "",
        company: "",
        category: "",
        locationType: "",
        city: "",
        description: "",
      });
    } catch {
      toast.error("Failed to create job");
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteJobId) return;

    try {
      await deleteJob(deleteJobId).unwrap();
      toast.success("Job deleted");
      setDeleteJobId(null);
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <Container className="max-w-[1200px]">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Job
          </button>
        </div>

        {/* ================= JOBS TABLE ================= */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Company</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3">Applications</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                jobsData?.data.map((job) => {
                  const apps =
                    applicationsData?.data.filter(
                      (a) => a.job_id === job._id
                    ) || [];

                  return (
                    <tr
                      key={job._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{job.title}</td>
                      <td className="p-3">{job.company}</td>
                      <td className="p-3">{job.category}</td>
                      <td className="p-3">
                        {job.location?.type}
                        {job.location?.city &&
                          ` • ${job.location.city}`}
                      </td>
                      <td className="p-3">{apps.length}</td>
                      <td className="p-3">
                        <button
                          onClick={() => setDeleteJobId(job._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ================= CREATE MODAL ================= */}
        <Popup isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Create Job</h2>

          <div className="space-y-3">
            <input
              className="input"
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => updateJob("title", e.target.value)}
            />

            <input
              className="input"
              placeholder="Company"
              value={newJob.company}
              onChange={(e) => updateJob("company", e.target.value)}
            />

            <select
              className="input"
              value={newJob.category}
              onChange={(e) =>
                updateJob("category", e.target.value)
              }
            >
              <option value="">Select Category</option>
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={newJob.locationType}
              onChange={(e) =>
                updateJob("locationType", e.target.value)
              }
            >
              <option value="">Select Location Type</option>
              {JOB_LOCATION_TYPES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            {newJob.locationType !== "Remote" && (
              <input
                className="input"
                placeholder="City"
                value={newJob.city}
                onChange={(e) => updateJob("city", e.target.value)}
              />
            )}

            <textarea
              className="input"
              rows={4}
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) =>
                updateJob("description", e.target.value)
              }
            />

            <button
              onClick={handleCreateJob}
              disabled={creating}
              className="bg-blue-600 text-white py-2 rounded w-full"
            >
              {creating ? "Creating..." : "Create Job"}
            </button>
          </div>
        </Popup>

        {/* ================= DELETE MODAL ================= */}
        <Popup
          isOpen={!!deleteJobId}
          onClose={() => setDeleteJobId(null)}
        >
          <h2 className="text-xl font-bold mb-3">Confirm Delete</h2>
          <p className="mb-4">This action cannot be undone.</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteJobId(null)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </Popup>
      </Container>
    </section>
  );
};

export default Dashboard;