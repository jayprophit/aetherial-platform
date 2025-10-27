import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Link as LinkIcon, Edit, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.users.getById(user!.id);
      setProfile(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Please login to view profile</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Profile not found</h3>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Profile Info */}
        <div className="p-6">
          <div className="flex items-start gap-6 -mt-20">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full border-4 border-white flex items-center justify-center flex-shrink-0">
              <User className="w-16 h-16 text-white" />
            </div>

            {/* Name and Actions */}
            <div className="flex-1 mt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">
                    {profile.fullName}
                  </h1>
                  <p className="text-slate-600 mt-1">{profile.email}</p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-slate-700 mt-4">{profile.bio}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 pt-6 border-t border-slate-200">
                <div>
                  <div className="text-2xl font-bold text-slate-800">0</div>
                  <div className="text-sm text-slate-600">Posts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">0</div>
                  <div className="text-sm text-slate-600">Friends</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">0</div>
                  <div className="text-sm text-slate-600">Groups</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200 flex">
          <button className="px-6 py-4 font-medium border-b-2 border-blue-600 text-blue-600">
            Posts
          </button>
          <button className="px-6 py-4 font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-800">
            About
          </button>
          <button className="px-6 py-4 font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-800">
            Friends
          </button>
          <button className="px-6 py-4 font-medium border-b-2 border-transparent text-slate-600 hover:text-slate-800">
            Photos
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No posts yet</h3>
            <p className="text-slate-600">Share your first post!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

