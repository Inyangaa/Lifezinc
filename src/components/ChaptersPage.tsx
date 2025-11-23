import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, BookOpen, Calendar, Edit2, Trash2, TrendingUp, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChaptersPageProps {
  onBack: () => void;
}

interface LifeChapter {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  color: string;
  created_at: string;
}

interface ChapterStats {
  entryCount: number;
  topMood: string;
  moodCounts: Record<string, number>;
}

const CHAPTER_COLORS = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-100 border-blue-300 text-blue-800' },
  { name: 'Green', value: 'green', class: 'bg-green-100 border-green-300 text-green-800' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-100 border-purple-300 text-purple-800' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-100 border-orange-300 text-orange-800' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-100 border-pink-300 text-pink-800' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-100 border-teal-300 text-teal-800' },
  { name: 'Red', value: 'red', class: 'bg-red-100 border-red-300 text-red-800' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
];

export function ChaptersPage({ onBack }: ChaptersPageProps) {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<LifeChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<LifeChapter | null>(null);
  const [chapterStats, setChapterStats] = useState<Record<string, ChapterStats>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    color: 'blue',
  });

  useEffect(() => {
    loadChapters();
  }, [user]);

  const loadChapters = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('life_chapters')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error loading chapters:', error);
    } else {
      setChapters(data || []);
      await loadChapterStats(data || []);
    }

    setLoading(false);
  };

  const loadChapterStats = async (chapterList: LifeChapter[]) => {
    if (!user) return;

    const stats: Record<string, ChapterStats> = {};

    for (const chapter of chapterList) {
      const { data } = await supabase
        .from('journal_entries')
        .select('mood')
        .eq('user_id', user.id)
        .eq('chapter_id', chapter.id);

      const entries = data || [];
      const moodCounts: Record<string, number> = {};

      entries.forEach((entry) => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });

      const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none';

      stats[chapter.id] = {
        entryCount: entries.length,
        topMood,
        moodCounts,
      };
    }

    setChapterStats(stats);
  };

  const handleCreateChapter = async () => {
    if (!user || !formData.title.trim()) return;

    const { error } = await supabase.from('life_chapters').insert([
      {
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        color: formData.color,
      },
    ]);

    if (error) {
      console.error('Error creating chapter:', error);
      alert('Failed to create chapter. Please try again.');
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        color: 'blue',
      });
      setShowCreateForm(false);
      loadChapters();
    }
  };

  const handleUpdateChapter = async () => {
    if (!editingChapter || !formData.title.trim()) return;

    const { error } = await supabase
      .from('life_chapters')
      .update({
        title: formData.title,
        description: formData.description || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        color: formData.color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingChapter.id);

    if (error) {
      console.error('Error updating chapter:', error);
      alert('Failed to update chapter. Please try again.');
    } else {
      setEditingChapter(null);
      setFormData({
        title: '',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        color: 'blue',
      });
      loadChapters();
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter? Journal entries will not be deleted, just unlinked.')) return;

    const { error } = await supabase.from('life_chapters').delete().eq('id', chapterId);

    if (error) {
      console.error('Error deleting chapter:', error);
      alert('Failed to delete chapter. Please try again.');
    } else {
      loadChapters();
    }
  };

  const startEditing = (chapter: LifeChapter) => {
    setEditingChapter(chapter);
    setFormData({
      title: chapter.title,
      description: chapter.description || '',
      start_date: chapter.start_date.split('T')[0],
      end_date: chapter.end_date ? chapter.end_date.split('T')[0] : '',
      color: chapter.color,
    });
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingChapter(null);
    setFormData({
      title: '',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      color: 'blue',
    });
  };

  const getColorClass = (color: string) => {
    return CHAPTER_COLORS.find((c) => c.value === color)?.class || CHAPTER_COLORS[0].class;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Chapter</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Life Chapters</h2>
              <p className="text-gray-600">Organize your emotional journey into meaningful periods</p>
            </div>
          </div>

          {showCreateForm && (
            <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., After College, New Job, Healing Journey"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What makes this chapter significant?"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date (Leave blank if ongoing)
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {CHAPTER_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setFormData({ ...formData, color: color.value })}
                        className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                          formData.color === color.value
                            ? color.class + ' ring-2 ring-offset-2 ring-emerald-500'
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={editingChapter ? handleUpdateChapter : handleCreateChapter}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    {editingChapter ? 'Update Chapter' : 'Create Chapter'}
                  </button>
                  <button
                    onClick={cancelForm}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No chapters yet</p>
              <p className="text-gray-400 mb-6">
                Create chapters to organize your emotional journey
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Chapter
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {chapters.map((chapter) => {
                const stats = chapterStats[chapter.id];
                const isOngoing = !chapter.end_date;

                return (
                  <div
                    key={chapter.id}
                    className={`p-6 rounded-xl border-2 ${getColorClass(chapter.color)} transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{chapter.title}</h3>
                          {isOngoing && (
                            <span className="px-3 py-1 bg-white bg-opacity-60 rounded-full text-xs font-bold">
                              ONGOING
                            </span>
                          )}
                        </div>

                        {chapter.description && (
                          <p className="text-sm opacity-90 mb-3">{chapter.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(chapter.start_date)}
                              {chapter.end_date && ` - ${formatDate(chapter.end_date)}`}
                            </span>
                          </div>

                          {stats && (
                            <>
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span>{stats.entryCount} entries</span>
                              </div>

                              {stats.topMood !== 'none' && (
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>
                                    Most: {stats.topMood.charAt(0).toUpperCase() + stats.topMood.slice(1)}
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(chapter)}
                          className="p-2 bg-white bg-opacity-60 hover:bg-opacity-100 rounded-lg transition-all"
                          title="Edit chapter"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="p-2 bg-white bg-opacity-60 hover:bg-opacity-100 rounded-lg transition-all"
                          title="Delete chapter"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
