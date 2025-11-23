import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, Tag, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { analyzeJournalEntries, downloadTherapyExport } from '../utils/therapyExport';

interface HistoryPageProps {
  onBack: () => void;
}

interface JournalEntry {
  id: string;
  mood: string;
  original_text: string;
  reframed_text: string;
  tags: string[] | null;
  created_at: string;
}

const ENTRIES_PER_PAGE = 10;

export function HistoryPage({ onBack }: HistoryPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [user, currentPage]);

  const loadEntries = async () => {
    if (!user) return;

    setLoading(true);

    const { count } = await supabase
      .from('journal_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    setTotalEntries(count || 0);

    const from = (currentPage - 1) * ENTRIES_PER_PAGE;
    const to = from + ENTRIES_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, mood, original_text, reframed_text, tags, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error loading entries:', error);
    } else {
      setEntries(data || []);
    }

    const { data: allData } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setAllEntries(allData || []);

    setLoading(false);
  };

  const handleExportForTherapy = async () => {
    setExporting(true);
    try {
      const analysis = analyzeJournalEntries(allEntries);
      downloadTherapyExport(analysis);
    } catch (error) {
      console.error('Error exporting for therapy:', error);
      alert('Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const totalPages = Math.ceil(totalEntries / ENTRIES_PER_PAGE);

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

  const toggleEntry = (id: string) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

          <button
            onClick={handleExportForTherapy}
            disabled={exporting || allEntries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {exporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Export for Therapy</span>
                <Download className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mt-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Journal History</h2>
            <div className="text-sm text-gray-600">
              {totalEntries} {totalEntries === 1 ? 'entry' : 'entries'} total
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No journal entries yet.</p>
              <button
                onClick={onBack}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Start Journaling
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors"
                  >
                    <button
                      onClick={() => toggleEntry(entry.id)}
                      className="w-full p-4 text-left flex items-start justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                          <span className="font-semibold text-gray-900 capitalize">{entry.mood}</span>
                          <span className="text-sm text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(entry.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {entry.original_text}
                        </p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <div className="flex gap-1 flex-wrap">
                              {entry.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <ChevronRight
                          className={`w-5 h-5 text-gray-400 transition-transform ${
                            expandedEntry === entry.id ? 'rotate-90' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {expandedEntry === entry.id && (
                      <div className="px-4 pb-4 space-y-4 bg-gray-50">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Original Thought
                          </div>
                          <p className="text-gray-700">{entry.original_text}</p>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                            Reframed Perspective
                          </div>
                          <p className="text-gray-900 font-medium">{entry.reframed_text}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
