import { useState } from 'react';
import { Briefcase, Search, MapPin, DollarSign, Clock, Building, Filter } from 'lucide-react';

export default function Jobs() {
  const [activeTab, setActiveTab] = useState('browse');

  const jobs = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `${['Senior', 'Junior', 'Mid-Level'][i % 3]} ${['Developer', 'Designer', 'Manager', 'Analyst'][i % 4]}`,
    company: `Company ${i + 1}`,
    location: ['Remote', 'New York', 'San Francisco', 'London'][i % 4],
    salary: `$${(Math.random() * 100 + 50).toFixed(0)}k - $${(Math.random() * 100 + 100).toFixed(0)}k`,
    type: ['Full-time', 'Part-time', 'Contract', 'Freelance'][i % 4],
    posted: `${i + 1} days ago`,
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=company${i}`,
    applicants: Math.floor(Math.random() * 200),
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-orange-600" />
              Job Search
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Find your dream job</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg">
            Post a Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Job title or keyword..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700 flex">
          {['browse', 'my-applications', 'saved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium border-b-2 ${
                activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent'
              }`}
            >
              {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6 hover:shadow-lg transition">
              <div className="flex gap-4">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                        <Building className="w-4 h-4" />
                        <span>{job.company}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                      Apply Now
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>{job.posted}</span>
                    <span>{job.applicants} applicants</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
