import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CalendarPageProps {
  onBack: () => void;
}

interface MoodData {
  date: string;
  mood: string;
  count: number;
}

const moodColors: Record<string, string> = {
  happy: 'bg-yellow-300',
  sad: 'bg-blue-400',
  anxious: 'bg-purple-400',
  frustrated: 'bg-orange-400',
  tired: 'bg-gray-400',
  confused: 'bg-pink-400',
  loved: 'bg-rose-400',
  angry: 'bg-red-500',
  hurt: 'bg-red-400',
  peaceful: 'bg-teal-300',
  worried: 'bg-indigo-400',
  vulnerable: 'bg-pink-300',
  disappointed: 'bg-slate-400',
  content: 'bg-green-300',
  stressed: 'bg-amber-500',
  grateful: 'bg-emerald-400',
  overwhelmed: 'bg-purple-500',
  numb: 'bg-gray-500',
  hopeful: 'bg-sky-400',
  guilty: 'bg-orange-500',
  embarrassed: 'bg-pink-500',
  skeptical: 'bg-slate-500',
  relieved: 'bg-teal-400',
  uncertain: 'bg-gray-400',
};

export function CalendarPage({ onBack }: CalendarPageProps) {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodData();
  }, [currentDate, user]);

  const loadMoodData = async () => {
    if (!user) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).toISOString();
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    const { data, error } = await supabase
      .from('journal_entries')
      .select('created_at, mood')
      .eq('user_id', user.id)
      .gte('created_at', firstDay)
      .lte('created_at', lastDay)
      .not('mood', 'is', null);

    if (error) {
      console.error('Error loading mood data:', error);
      setLoading(false);
      return;
    }

    const moodsByDate: Record<string, Record<string, number>> = {};
    data.forEach((entry) => {
      const date = new Date(entry.created_at).toISOString().split('T')[0];
      if (!moodsByDate[date]) {
        moodsByDate[date] = {};
      }
      moodsByDate[date][entry.mood] = (moodsByDate[date][entry.mood] || 0) + 1;
    });

    const processedData: MoodData[] = Object.entries(moodsByDate).map(([date, moods]) => {
      const dominantMood = Object.entries(moods).reduce((a, b) =>
        b[1] > a[1] ? b : a
      );
      return {
        date,
        mood: dominantMood[0],
        count: dominantMood[1],
      };
    });

    setMoodData(processedData);
    setLoading(false);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getMoodForDate = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return moodData.find(m => m.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Emotion Calendar</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <span className="text-lg font-semibold text-gray-900 min-w-[180px] text-center">
                {monthName}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square"></div>
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const moodForDay = getMoodForDate(day);
                  const isToday =
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                        moodForDay
                          ? `${moodColors[moodForDay.mood]} text-white shadow-md`
                          : 'bg-gray-50 text-gray-400'
                      } ${isToday ? 'ring-2 ring-emerald-600' : ''}`}
                      title={moodForDay ? `${moodForDay.mood} (${moodForDay.count})` : 'No entries'}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Emotion Colors</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {Object.entries(moodColors).slice(0, 12).map(([mood, color]) => (
                    <div key={mood} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${color}`}></div>
                      <span className="text-xs text-gray-600 capitalize">{mood}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
