import { useState, useEffect } from 'react';
import { ArrowLeft, Download, User, Calendar, TrendingUp, Award, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePageProps {
  onBack: () => void;
}

interface ProfileStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  topMood: string;
  achievementCount: number;
  firstEntryDate: string | null;
  gems: number;
}

interface JournalEntry {
  id: string;
  mood: string;
  original_text: string;
  reframed_text: string;
  tags: string[] | null;
  created_at: string;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadProfileStats();
  }, [user]);

  const loadProfileStats = async () => {
    if (!user) return;

    setLoading(true);

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('mood, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    const { data: streak } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('user_id', user.id);

    const { data: gamification } = await supabase
      .from('user_gamification')
      .select('gems')
      .eq('user_id', user.id)
      .maybeSingle();

    const moodCounts: Record<string, number> = {};
    entries?.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      }
    });

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    setStats({
      totalEntries: entries?.length || 0,
      currentStreak: streak?.current_streak || 0,
      longestStreak: streak?.longest_streak || 0,
      topMood,
      achievementCount: achievements?.length || 0,
      firstEntryDate: entries?.[0]?.created_at || null,
      gems: gamification?.gems || 0,
    });

    setLoading(false);
  };

  const exportAsText = async () => {
    if (!user) return;

    setExporting(true);

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('mood, original_text, reframed_text, tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!entries || entries.length === 0) {
      alert('No journal entries to export');
      setExporting(false);
      return;
    }

    let textContent = '='.repeat(60) + '\n';
    textContent += 'EMOTIONAL RECYCLE - JOURNAL EXPORT\n';
    textContent += '='.repeat(60) + '\n\n';
    textContent += `Exported: ${new Date().toLocaleString()}\n`;
    textContent += `Total Entries: ${entries.length}\n\n`;

    entries.forEach((entry: JournalEntry, index: number) => {
      textContent += '-'.repeat(60) + '\n';
      textContent += `Entry #${entries.length - index}\n`;
      textContent += `Date: ${new Date(entry.created_at).toLocaleString()}\n`;
      textContent += `Mood: ${entry.mood || 'N/A'}\n`;
      if (entry.tags && entry.tags.length > 0) {
        textContent += `Tags: ${entry.tags.join(', ')}\n`;
      }
      textContent += '\n';
      textContent += 'Original Thought:\n';
      textContent += entry.original_text + '\n\n';
      textContent += 'Reframed Perspective:\n';
      textContent += entry.reframed_text + '\n\n';
    });

    textContent += '='.repeat(60) + '\n';
    textContent += 'Thank you for using Emotional Recycle\n';
    textContent += '='.repeat(60) + '\n';

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotional-recycle-journal-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExporting(false);
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

  const getDaysSince = (dateStr: string | null) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Profile</h2>
            <button
              onClick={exportAsText}
              disabled={exporting || loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Exporting...' : 'Export Journal'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{user?.email}</div>
                  <div className="text-sm text-gray-600">
                    Member since {stats?.firstEntryDate
                      ? new Date(stats.firstEntryDate).toLocaleDateString()
                      : 'recently'
                    }
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Journey Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <div className="text-sm font-medium text-gray-600">Total Entries</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats?.totalEntries || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats?.firstEntryDate
                        ? `Over ${getDaysSince(stats.firstEntryDate)} days`
                        : 'Start your journey today'
                      }
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div className="text-sm font-medium text-gray-600">Current Streak</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats?.currentStreak || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Longest: {stats?.longestStreak || 0} days
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{getMoodEmoji(stats?.topMood || '')}</span>
                      <div className="text-sm font-medium text-gray-600">Most Common Mood</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 capitalize">
                      {stats?.topMood || 'N/A'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-600" />
                      <div className="text-sm font-medium text-gray-600">Hope Tokens</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats?.gems || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Seeds of hope planted
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <div className="text-sm font-medium text-gray-600">Achievements</div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{stats?.achievementCount || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Unlocked badges</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Export Your Journal</h3>
                <p className="text-gray-600 mb-4">
                  Download all your journal entries. Keep a backup or review your growth journey offline.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={exportAsText}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <Download className="w-5 h-5" />
                    {exporting ? 'Preparing Export...' : 'Download as TXT'}
                  </button>
                  <div className="text-center text-sm text-gray-500">
                    PDF export coming soon for Pro users
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
