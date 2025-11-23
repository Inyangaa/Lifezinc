import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CommunityPageProps {
  onBack: () => void;
}

interface CommunityShare {
  id: string;
  reframe_text: string;
  mood: string | null;
  is_anonymous: boolean;
  reaction_count: number;
  created_at: string;
}

export function CommunityPage({ onBack }: CommunityPageProps) {
  const { user } = useAuth();
  const [shares, setShares] = useState<CommunityShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareForm, setShowShareForm] = useState(false);
  const [shareText, setShareText] = useState('');
  const [shareMood, setShareMood] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadShares();
  }, []);

  const loadShares = async () => {
    const { data, error } = await supabase
      .from('community_shares')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading shares:', error);
    } else {
      setShares(data || []);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    if (!shareText.trim() || !user) return;

    setSaving(true);
    const { data, error } = await supabase
      .from('community_shares')
      .insert([
        {
          user_id: user.id,
          reframe_text: shareText,
          mood: shareMood || null,
          is_anonymous: isAnonymous,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error sharing:', error);
    } else {
      setShares((prev) => [data, ...prev]);
      setShareText('');
      setShareMood('');
      setShowShareForm(false);
    }
    setSaving(false);
  };

  const handleReact = async (shareId: string) => {
    const share = shares.find((s) => s.id === shareId);
    if (!share) return;

    const { error } = await supabase
      .from('community_shares')
      .update({ reaction_count: share.reaction_count + 1 })
      .eq('id', shareId);

    if (error) {
      console.error('Error updating reaction:', error);
    } else {
      setShares((prev) =>
        prev.map((s) =>
          s.id === shareId ? { ...s, reaction_count: s.reaction_count + 1 } : s
        )
      );
    }
  };

  const getMoodEmoji = (mood: string | null) => {
    if (!mood) return '';
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😔',
      anxious: '😰',
      frustrated: '😤',
      tired: '😴',
      angry: '😡',
      peaceful: '😌',
      grateful: '🤗',
      hopeful: '🥰',
    };
    return emojiMap[mood] || '';
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
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-900">Community Wall</h2>
            </div>
            <button
              onClick={() => setShowShareForm(!showShareForm)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>

          {showShareForm && (
            <div className="mb-8 p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share Your Growth
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Inspire others by sharing how you've reframed a difficult emotion
              </p>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Share how you transformed a challenging emotion..."
                className="w-full min-h-[120px] p-4 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none resize-none mb-4"
              />
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="text"
                  value={shareMood}
                  onChange={(e) => setShareMood(e.target.value)}
                  placeholder="Original emotion (optional)"
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Share anonymously</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  disabled={!shareText.trim() || saving}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Sharing...' : 'Share with Community'}
                </button>
                <button
                  onClick={() => {
                    setShowShareForm(false);
                    setShareText('');
                    setShareMood('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : shares.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No shares yet</p>
              <p className="text-sm text-gray-500">
                Be the first to share your emotional growth journey
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      {share.mood && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getMoodEmoji(share.mood)}</span>
                          <span className="text-sm text-gray-600 capitalize">
                            {share.mood}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {share.reframe_text}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(share.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {share.is_anonymous ? ' • Anonymous' : ''}
                    </span>
                    <button
                      onClick={() => handleReact(share.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-white rounded-full hover:bg-pink-50 transition-colors group"
                    >
                      <Heart className="w-4 h-4 text-pink-500 group-hover:fill-pink-500 transition-all" />
                      <span className="text-sm text-gray-700">{share.reaction_count}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
