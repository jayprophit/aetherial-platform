import { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, MapPin, DollarSign, Clock, Building, Loader2, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface Job {
  id: number;
  companyId: number;
  title: string;
  description: string;
  location: string;
  type: string;
  salary: string;
  requirements: string[];
  benefits: string[];
  createdAt: string;
  company?: {
    name: string;
    logo: string;
  };
}

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [error, setError] = useState('');

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote'];

  useEffect(() => {
    fetchJobs();
  }, [typeFilter, searchQuery, locationFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 20 };
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (locationFilter) {
        params.location = locationFilter;
      }
      const data = await api.jobs.getAll(params);
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: number) => {
    if (!user) {
      setError('Please login to apply for jobs');
      return;
    }

    try {
      await api.jobs.apply(jobId, {
        coverLetter: 'I am interested in this position.',
        resumeUrl: ''
      });
      setError('');
      alert('Application submitted successfully!');
    } catch (err) {
      setError('Failed to submit application');
      console.error('Error applying:', err);
    }
  };

  const formatSalary = (salary: string) => {
    const amount = parseFloat(salary);
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
              <Briefcase className="w-8 h-8 text-purple-600" />
              Job Marketplace
            </h1>
            <p className="text-slate-600 mt-1">Find your dream job from top companies</p>
          </div>
          {user && (
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
              Post a Job
            </button>
          )}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Job title or keywords..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Location..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3">{error}</p>
        )}
      </div>

      {/* Job Types Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex overflow-x-auto">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type.toLowerCase())}
              className={`px-6 py-4 font-medium border-b-2 whitespace-nowrap transition-colors ${
                typeFilter === type.toLowerCase()
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Jobs List */}
        {!loading && jobs.length > 0 && (
          <div className="p-6 space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    {/* Company Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {job.company?.logo ? (
                        <img
                          src={job.company.logo}
                          alt={job.company.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Building className="w-8 h-8 text-white" />
                      )}
                    </div>

                    {/* Job Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-slate-600 mb-3">
                        {job.company?.name || 'Company Name'}
                      </p>

                      {/* Job Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.salary)}/year</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Requirements */}
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements.slice(0, 5).map((req, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                              {req}
                            </span>
                          ))}
                          {job.requirements.length > 5 && (
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                              +{job.requirements.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Benefits */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.slice(0, 3).map((benefit, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                            >
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={!user}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  >
                    <Send className="w-4 h-4" />
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

