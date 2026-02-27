import React from "react";
import Container from "./Container";
import {
  Palette,
  ShoppingCart,
  Megaphone,
  DollarSign,
  Monitor,
  Cpu,
  Briefcase,
  Users,
  ArrowUpRight,
} from "lucide-react";

const Category = () => {
  const categories = [
    { name: "Design", jobs: 235, icon: Palette },
    { name: "Sales", jobs: 180, icon: ShoppingCart },
    { name: "Marketing", jobs: 310, icon: Megaphone },
    { name: "Finance", jobs: 120, icon: DollarSign },
    { name: "Technology", jobs: 520, icon: Monitor },
    { name: "Engineering", jobs: 410, icon: Cpu },
    { name: "Business", jobs: 260, icon: Briefcase },
    { name: "Human Resource", jobs: 150, icon: Users },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <Container className="max-w-[1192px] px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Explore by Category
            </h2>
            <p className="text-gray-500 mt-2">
              Find your perfect job by category
            </p>
          </div>

          <button className="flex items-center gap-2 text-blue-600 font-medium hover:gap-3 transition-all">
            Show all jobs
            <ArrowUpRight size={18} />
          </button>
        </div>

        {/* Grid 4x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-gray-50 hover:bg-blue-50 p-6 rounded-2xl transition duration-300 cursor-pointer border border-transparent hover:border-blue-100"
              >
                <div className="flex items-start justify-between">
                  
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm group-hover:bg-blue-600 transition">
                    <Icon
                      className="text-blue-600 group-hover:text-white transition"
                      size={22}
                    />
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight
                    size={18}
                    className="text-gray-400 group-hover:text-blue-600 transition"
                  />
                </div>

                {/* Text */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {item.jobs} jobs available
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </Container>
    </section>
  );
};

export default Category;