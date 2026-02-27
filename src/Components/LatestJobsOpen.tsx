import React from "react";
import Container from "./Container";
import { ArrowUpRight } from "lucide-react";

const jobs = [
  {
    title: "Social Media Assistant",
    company: "Dropbox",
    location: "San Francisco, USA",
    type: "Full Time",
    skills: ["Marketing", "Design"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "UI/UX Designer",
    company: "Spotify",
    location: "London, UK",
    type: "Full Time",
    skills: ["Design", "UI/UX"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, USA",
    type: "Full Time",
    skills: ["Engineering", "Technology"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Sales Manager",
    company: "Amazon",
    location: "Seattle, USA",
    type: "Full Time",
    skills: ["Sales", "Business"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Social Media Assistant",
    company: "Dropbox",
    location: "San Francisco, USA",
    type: "Full Time",
    skills: ["Marketing", "Design"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "UI/UX Designer",
    company: "Spotify",
    location: "London, UK",
    type: "Full Time",
    skills: ["Design", "UI/UX"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Software Engineer",
    company: "Google",
    location: "Mountain View, USA",
    type: "Full Time",
    skills: ["Engineering", "Technology"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  },
  {
    title: "Sales Manager",
    company: "Amazon",
    location: "Seattle, USA",
    type: "Full Time",
    skills: ["Sales", "Business"],
    logo: "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg?semt=ais_rp_progressive&w=740&q=80",
  }

];

const LatestJobsOpen = () => {
  return (
    <section className="w-full py-24 bg-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest Jobs Open
          </h2>
          <button className="flex items-center gap-1 text-blue-600 font-medium hover:gap-2 transition-all">
            Show all jobs <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 bg-gray-50 hover:bg-blue-50 rounded-2xl shadow-sm transition cursor-pointer"
            >
              {/* Left Side - Logo */}
              <img
                src={job.logo}
                alt={job.company}
                className="w-16 h-16 object-contain rounded-lg"
              />

              {/* Right Side - Job Info */}
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                
                <div className="flex gap-2 text-gray-500 text-sm mt-1">
                  <p>{job.company}</p>
                  <span>•</span>
                  <p>{job.location}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                    {job.type}
                  </span>
                  {job.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
};

export default LatestJobsOpen;