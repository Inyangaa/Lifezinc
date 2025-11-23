import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { analyzeEmotionalAlignment, getAlignmentColorClass, getAlignmentBarColor, EmotionalAlignment } from '../utils/emotionalAlignment';

interface InsightsPageProps {
  onBack: () => void;
}

interface MoodCount {
  mood: string;
  count: number;
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_entry_date: string | null;
}

export function InsightsPage({ onBack }: InsightsPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);
  const [recentTrend, setRecentTrend] = useState<'up' | 'down' | 'neutral'>('neutral');
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');
  const [alignments, setAlignments] = useState<EmotionalAlignment[]>([]);

  useEffect(() => {
    loadInsights();
  }, [user, timeRange]);

  const loadInsights = async () => {
    if (!user) return;

    setLoading(true);

    const now = new Date();
    let startDate: Date | null = null;

    if (timeRange === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let query = supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .not('mood', 'is', null);

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading insights:', error);
      setLoading(false);
      return;
    }

    setTotalEntries(data.length);

    const moodMap: Record<string, number> = {};
    data.forEach((entry) => {
      moodMap[entry.mood] = (moodMap[entry.mood] || 0) + 1;
    });

    const sortedMoods = Object.entries(moodMap)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);

    setMoodCounts(sortedMoods);

    const alignmentData = analyzeEmotionalAlignment(data);
    setAlignments(alignmentData);

    const positiveMoods = ['happy', 'loved', 'peaceful', 'content', 'grateful', 'hopeful', 'relieved'];
    const negativeMoods = ['sad', 'anxious', 'frustrated', 'angry', 'hurt', 'worried', 'stressed', 'overwhelmed', 'guilty'];

    if (data.length >= 4) {
      const firstHalf = data.slice(0, Math.floor(data.length / 2));
      const secondHalf = data.slice(Math.floor(data.length / 2));

      const firstPositive = firstHalf.filter(e => positiveMoods.includes(e.mood)).length;
      const secondPositive = secondHalf.filter(e => positiveMoods.includes(e.mood)).length;

      const firstNegative = firstHalf.filter(e => negativeMoods.includes(e.mood)).length;
      const secondNegative = secondHalf.filter(e => negativeMoods.includes(e.mood)).length;

      const firstRatio = firstHalf.length > 0 ? firstPositive / firstHalf.length : 0;
      const secondRatio = secondHalf.length > 0 ? secondPositive / secondHalf.length : 0;

      if (secondRatio > firstRatio + 0.1) {
        setRecentTrend('up');
      } else if (secondRatio < firstRatio - 0.1) {
        setRecentTrend('down');
      } else {
        setRecentTrend('neutral');
      }
    }

    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak, last_entry_date')
      .eq('user_id', user.id)
      .maybeSingle();

    setStreak(streakData);
    setLoading(false);
  };

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😔',
      anxious: '😰',
      frustrated: '😤',
      tired: '😴',
      confused: '🤔',
      loved: '😍',
      angry: '😡',
      hurt: '😢',
      peaceful: '😌',
      worried: '😟',
      vulnerable: '🥺',
      disappointed: '😞',
      content: '🙂',
      stressed: '😣',
      grateful: '🤗',
      overwhelmed: '😩',
      numb: '😐',
      hopeful: '🥰',
      guilty: '😖',
      embarrassed: '😳',
      skeptical: '🤨',
      relieved: '😌',
      uncertain: '😕',
    };
    return emojiMap[mood] || '😐';
  };

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
            <h2 className="text-3xl font-bold text-gray-900">Your Insights</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'week'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'month'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Total Entries</div>
                  <div className="text-4xl font-bold text-gray-900">{totalEntries}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Current Streak</div>
                  <div className="text-4xl font-bold text-gray-900">{streak?.current_streak || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">days in a row</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="text-sm font-medium text-gray-600 mb-2">Longest Streak</div>
                  <div className="text-4xl font-bold text-gray-900">{streak?.longest_streak || 0}</div>
                  <div className="text-xs text-gray-500 mt-1">days</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Emotional Trend</h3>
                  {recentTrend === 'up' && <TrendingUp className="w-6 h-6 text-green-600" />}
                  {recentTrend === 'down' && <TrendingDown className="w-6 h-6 text-red-600" />}
                  {recentTrend === 'neutral' && <Minus className="w-6 h-6 text-gray-600" />}
                </div>
                <p className="text-gray-600">
                  {recentTrend === 'up' && 'Your emotional well-being is trending positively! Keep up the great work.'}
                  {recentTrend === 'down' && 'Things seem challenging lately. Remember to be kind to yourself.'}
                  {recentTrend === 'neutral' && 'Your emotions have been stable. Continue your journaling practice.'}
                </p>
              </div>

              {alignments.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-6 h-6 text-pink-600" />
                    <h3 className="text-lg font-bold text-gray-900">Your Emotional Strengths</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Positive themes emerging from your emotional journey
                  </p>
                  <div className="space-y-4">
                    {alignments.slice(0, 5).map((alignment) => (
                      <div key={alignment.theme} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{alignment.icon}</span>
                            <div>
                              <span className="font-semibold text-gray-900">{alignment.theme}</span>
                              <p className="text-xs text-gray-600">{alignment.description}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{alignment.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getAlignmentBarColor(alignment.color)} transition-all duration-500`}
                            style={{ width: `${alignment.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top Emotions</h3>
                <div className="space-y-3">
                  {moodCounts.slice(0, 8).map((item, index) => {
                    const percentage = totalEntries > 0 ? (item.count / totalEntries) * 100 : 0;
                    return (
                      <div key={item.mood} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getMoodEmoji(item.mood)}</span>
                            <span className="font-medium text-gray-900 capitalize">{item.mood}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {item.count} {item.count === 1 ? 'time' : 'times'} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {totalEntries === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No entries yet. Start journaling to see your insights!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
