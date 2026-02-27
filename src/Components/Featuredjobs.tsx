import React from "react";
import Container from "./Container";
import { ArrowUpRight } from "lucide-react";

const jobs = [
  {
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for an Email Marketing expert to help their team...",
    type: "Full Time",
    skills: ["Marketing", "Design"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "UI/UX Designer",
    company: "Spotify",
    location: "London, UK",
    description: "Join Spotify to design intuitive interfaces and experiences...",
    type: "Full Time",
    skills: ["Design", "UI/UX"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, USA",
    description: "Develop scalable software solutions for Google’s products...",
    type: "Full Time",
    skills: ["Engineering", "Technology"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Sales Manager",
    company: "Amazon",
    location: "Seattle, USA",
    description: "Lead a team of sales executives and grow revenue streams...",
    type: "Full Time",
    skills: ["Sales", "Business"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
    {
    title: "Email Marketing",
    company: "Revolut",
    location: "Madrid, Spain",
    description: "Revolut is looking for an Email Marketing expert to help their team...",
    type: "Full Time",
    skills: ["Marketing", "Design"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "UI/UX Designer",
    company: "Spotify",
    location: "London, UK",
    description: "Join Spotify to design intuitive interfaces and experiences...",
    type: "Full Time",
    skills: ["Design", "UI/UX"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, USA",
    description: "Develop scalable software solutions for Google’s products...",
    type: "Full Time",
    skills: ["Engineering", "Technology"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Sales Manager",
    company: "Amazon",
    location: "Seattle, USA",
    description: "Lead a team of sales executives and grow revenue streams...",
    type: "Full Time",
    skills: ["Sales", "Business"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
];

const FeaturedJobs = () => {
  return (
    <section className="w-full py-24 bg-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Featured Jobs
          </h2>
          <button className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all">
            Show all jobs <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-gray-50 hover:bg-blue-50 transition duration-300 rounded-2xl shadow-sm p-5 flex flex-col gap-4 cursor-pointer"
            >
              {/* Top Row: Logo + Type */}
              <div className="flex items-center justify-between">
                <img src={job.logo} alt={job.company} className="w-10 h-10 object-contain" />
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>

              {/* Job Info */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                <div className="flex text-gray-500 text-sm gap-2">
                  <p>{job.company}</p>
                  <span>•</span>
                  <p>{job.location}</p>
                </div>
                <p className="text-gray-500 text-sm">{job.description}</p>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default FeaturedJobs;