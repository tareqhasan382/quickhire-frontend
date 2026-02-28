import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "./Container";
import { useCreateJobMutation, useGetJobByIdQuery } from "../Redux/jobs/jobsApi";

const JobsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: job, isLoading, isError } = useGetJobByIdQuery(id || "");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApplyClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    resume_link: "",
    cover_note: "",
  });

  const [applyJob, { isLoading: isApplying }] = useCreateJobMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job?.data?._id) return;

    try {
      //await applyJob({ job_id: job.data._id, ...form }).unwrap();
      alert("Application submitted successfully!");
      setForm({ name: "", email: "", resume_link: "", cover_note: "" });
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Failed to submit application. Try again.");
    }
  };

  if (isLoading) return <p className="text-gray-500 text-center mt-10">Loading...</p>;
  if (isError || !job) return <p className="text-red-500 text-center mt-10">Job not found.</p>;

  return (
    <section className="py-24 bg-gray-50">
      <Container className="max-w-[800px]">
        <div className="bg-white p-8 rounded-2xl shadow-md space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{job.data.title}</h1>
          <p className="text-gray-600"><span className="font-semibold">Company:</span> {job.data.company}</p>
          <p className="text-gray-600"><span className="font-semibold">Category:</span> {job.data.category}</p>
          <p className="text-gray-600"><span className="font-semibold">Location:</span> {job.data.location?.city || "Remote"} ({job.data.location?.type})</p>
          <p className="text-gray-600"><span className="font-semibold">Job ID:</span> {job.data._id}</p>
          <p className="text-gray-600"><span className="font-semibold">Posted by User ID:</span> {job.data.user_id}</p>
          <p className="text-gray-600"><span className="font-semibold">Created At:</span> {new Date(job.data.createdAt).toLocaleString()}</p>
          <p className="text-gray-600"><span className="font-semibold">Updated At:</span> {new Date(job.data.updatedAt).toLocaleString()}</p>
          <p className="text-gray-700 mt-4">{job.data.description}</p>

          <button
            onClick={handleApplyClick}
            className="mt-6 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Apply Now
          </button>
        </div>
      </Container>

      {/* Apply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">Apply for {job.data.title}</h2>
            <p className="text-gray-600 mb-4">Please fill in your details to apply for this job.</p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border px-4 py-2 rounded-lg outline-none"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="border px-4 py-2 rounded-lg outline-none"
              />
              <input
                type="url"
                name="resume_link"
                placeholder="Resume Link"
                value={form.resume_link}
                onChange={handleChange}
                required
                className="border px-4 py-2 rounded-lg outline-none"
              />
              <textarea
                name="cover_note"
                placeholder="Cover Note"
                value={form.cover_note}
                onChange={handleChange}
                maxLength={1000}
                className="border px-4 py-2 rounded-lg outline-none"
              ></textarea>

              <button
                type="submit"
                disabled={isApplying}
                className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isApplying ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default JobsDetails;