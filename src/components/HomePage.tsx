import { Recycle, Calendar, TrendingUp, BookHeart, Wrench, LogOut, Settings, Users, User, History, Trophy, BookOpen, Heart, Stethoscope, BarChart3, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { SOSButton } from './SOSButton';

interface HomePageProps {
  onStartJournal: () => void;
  onNavigate: (page: 'calendar' | 'insights' | 'tools' | 'favorites' | 'settings' | 'community' | 'profile' | 'history' | 'challenges' | 'resources' | 'chapters' | 'caregiver' | 'therapist-support' | 'analytics' | 'goals') => void;
}

export function HomePage({ onStartJournal, onNavigate }: HomePageProps) {
  const { signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-emerald-600 p-6 rounded-full shadow-lg">
            <Recycle className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            LifeZinc
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            Essential Nourishment for Mental Wellness
          </p>
        </div>

        <button
          onClick={onStartJournal}
          className="mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Start Journaling
        </button>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-4 mt-12">
          <button
            onClick={() => onNavigate('calendar')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Calendar</p>
          </button>

          <button
            onClick={() => onNavigate('insights')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Insights</p>
          </button>

          <button
            onClick={() => onNavigate('favorites')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <BookHeart className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Favorites</p>
          </button>

          <button
            onClick={() => onNavigate('tools')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Wrench className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Tools</p>
          </button>

          <button
            onClick={() => onNavigate('community')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Community</p>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <User className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Profile</p>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <History className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">History</p>
          </button>

          <button
            onClick={() => onNavigate('challenges')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Trophy className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Challenges</p>
          </button>

          <button
            onClick={() => onNavigate('resources')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <BookOpen className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Resources</p>
          </button>

          <button
            onClick={() => onNavigate('chapters')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Life Chapters</p>
          </button>

          <button
            onClick={() => onNavigate('caregiver')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Heart className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Caregiver Mode</p>
          </button>

          <button
            onClick={() => onNavigate('therapist-support')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Stethoscope className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Find Therapist</p>
          </button>

          <button
            onClick={() => onNavigate('analytics')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <BarChart3 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Analytics</p>
          </button>

          <button
            onClick={() => onNavigate('goals')}
            className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <Target className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-900">Goals</p>
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
      <SOSButton />
    </div>
  );
}
