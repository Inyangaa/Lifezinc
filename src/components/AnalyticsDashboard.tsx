import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Heart, Calendar, Zap, Award, Target, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AnalyticsDashboardProps {
  onBack: () => void;
}

interface MoodTrend {
  date: string;
  mood: string;
  count: number;
}

interface EmotionalPattern {
  emotion: string;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageMood: 'neutral',
    journalDaysThisMonth: 0,
    completedChallenges: 0,
    totalGems: 0,
    level: 1,
  });
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [emotionalPatterns, setEmotionalPatterns] = useState<EmotionalPattern[]>([]);
  const [topTags, setTopTags] = useState<{ tag: string; count: number }[]>([]);
  const [timeOfDayInsights, setTimeOfDayInsights] = useState({
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const { data: streakData } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: gamification } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: challenges } = await supabase
        .from('user_challenge_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_completed', true);

      const currentMonth = new Date().getMonth();
      const journalDaysThisMonth = entries?.filter(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.getMonth() === currentMonth;
      }).length || 0;

      const moodCounts: { [key: string]: number } = {};
      entries?.forEach(entry => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });
      const averageMood = Object.keys(moodCounts).reduce((a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
      );

      const moodTrendData: MoodTrend[] = [];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      last7Days.forEach(date => {
        const dayEntries = entries?.filter(e =>
          e.created_at.split('T')[0] === date
        ) || [];
        const moodCount: { [key: string]: number } = {};
        dayEntries.forEach(e => {
          if (e.mood) moodCount[e.mood] = (moodCount[e.mood] || 0) + 1;
        });
        const topMood = Object.keys(moodCount).reduce((a, b) =>
          moodCount[a] > moodCount[b] ? a : b, 'none'
        );
        if (topMood !== 'none') {
          moodTrendData.push({ date, mood: topMood, count: moodCount[topMood] });
        }
      });

      const tagCounts: { [key: string]: number } = {};
      entries?.forEach(entry => {
        entry.tags?.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const topTagsData = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }));

      const emotionCounts: { [key: string]: number[] } = {};
      entries?.forEach(entry => {
        if (entry.emotional_snapshot?.dominantEmotion) {
          const emotion = entry.emotional_snapshot.dominantEmotion;
          if (!emotionCounts[emotion]) emotionCounts[emotion] = [];
          emotionCounts[emotion].push(new Date(entry.created_at).getTime());
        }
      });

      const emotionalPatternsData: EmotionalPattern[] = Object.entries(emotionCounts)
        .map(([emotion, timestamps]) => {
          const recent = timestamps.filter(t => t > Date.now() - 14 * 24 * 60 * 60 * 1000).length;
          const older = timestamps.filter(t => t <= Date.now() - 14 * 24 * 60 * 60 * 1000).length;
          let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
          if (recent > older * 1.2) trend = 'increasing';
          if (recent < older * 0.8) trend = 'decreasing';
          return { emotion, frequency: timestamps.length, trend };
        })
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5);

      const timeOfDay = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      entries?.forEach(entry => {
        const hour = new Date(entry.created_at).getHours();
        if (hour >= 5 && hour < 12) timeOfDay.morning++;
        else if (hour >= 12 && hour < 17) timeOfDay.afternoon++;
        else if (hour >= 17 && hour < 21) timeOfDay.evening++;
        else timeOfDay.night++;
      });

      setStats({
        totalEntries: entries?.length || 0,
        currentStreak: streakData?.current_streak || 0,
        longestStreak: streakData?.longest_streak || 0,
        averageMood,
        journalDaysThisMonth,
        completedChallenges: challenges?.length || 0,
        totalGems: gamification?.gems || 0,
        level: gamification?.level || 1,
      });
      setMoodTrends(moodTrendData);
      setEmotionalPatterns(emotionalPatternsData);
      setTopTags(topTagsData);
      setTimeOfDayInsights(timeOfDay);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      joyful: 'bg-yellow-400',
      calm: 'bg-blue-400',
      anxious: 'bg-orange-400',
      sad: 'bg-gray-400',
      angry: 'bg-red-400',
      grateful: 'bg-green-400',
    };
    return colors[mood] || 'bg-gray-300';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return '↗';
    if (trend === 'decreasing') return '↘';
    return '→';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-emerald-600 text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Journey Analytics</h1>
          <p className="text-gray-600">Insights from your mental wellness journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-emerald-600" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalEntries}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Entries</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-gray-900">{stats.currentStreak}</span>
            </div>
            <p className="text-gray-600 font-medium">Day Streak</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-gray-900">{stats.totalGems}</span>
            </div>
            <p className="text-gray-600 font-medium">Total Gems</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">{stats.completedChallenges}</span>
            </div>
            <p className="text-gray-600 font-medium">Challenges</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Mood Trends (Last 7 Days)
            </h2>
            <div className="space-y-3">
              {moodTrends.length > 0 ? (
                moodTrends.map((trend, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-24">
                      {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMoodColor(trend.mood)}`}>
                      {trend.mood}
                    </div>
                    <span className="text-sm text-gray-500">x{trend.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No mood data yet. Start journaling to see trends!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-emerald-600" />
              Emotional Patterns
            </h2>
            <div className="space-y-3">
              {emotionalPatterns.length > 0 ? (
                emotionalPatterns.map((pattern, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTrendIcon(pattern.trend)}</span>
                      <span className="font-medium text-gray-900 capitalize">{pattern.emotion}</span>
                    </div>
                    <span className="text-sm text-gray-600">{pattern.frequency} times</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Keep journaling to discover emotional patterns</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-emerald-600" />
              Most Common Topics
            </h2>
            <div className="space-y-2">
              {topTags.length > 0 ? (
                topTags.map((tag, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">#{tag.tag}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${(tag.count / stats.totalEntries) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{tag.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Add tags to your entries to track topics</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Journaling Times</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">🌅 Morning (5am-12pm)</span>
                <span className="font-bold text-gray-900">{timeOfDayInsights.morning}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">☀️ Afternoon (12pm-5pm)</span>
                <span className="font-bold text-gray-900">{timeOfDayInsights.afternoon}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">🌆 Evening (5pm-9pm)</span>
                <span className="font-bold text-gray-900">{timeOfDayInsights.evening}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">🌙 Night (9pm-5am)</span>
                <span className="font-bold text-gray-900">{timeOfDayInsights.night}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
