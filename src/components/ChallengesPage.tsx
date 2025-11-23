import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Calendar, CheckCircle, Circle, Award, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ChallengesPageProps {
  onBack: () => void;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration_days: number;
  theme: string;
  daily_prompts: string[];
  badge_name: string;
}

interface UserProgress {
  id: string;
  challenge_id: string;
  current_day: number;
  completed_days: number[];
  is_completed: boolean;
  started_at: string;
  completed_at: string | null;
}

export function ChallengesPage({ onBack }: ChallengesPageProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, [user]);

  const loadChallenges = async () => {
    if (!user) return;

    setLoading(true);

    const { data: challengesData } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('duration_days', { ascending: true });

    const { data: progressData } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', user.id);

    if (challengesData) {
      setChallenges(challengesData);
    }

    if (progressData) {
      const progressMap: Record<string, UserProgress> = {};
      progressData.forEach((p) => {
        progressMap[p.challenge_id] = p;
      });
      setUserProgress(progressMap);
    }

    setLoading(false);
  };

  const startChallenge = async (challengeId: string) => {
    if (!user) return;

    const { error } = await supabase.from('user_challenge_progress').insert({
      user_id: user.id,
      challenge_id: challengeId,
      current_day: 1,
      completed_days: [],
      is_completed: false,
    });

    if (!error) {
      await loadChallenges();
      setSelectedChallenge(null);
    }
  };

  const completeDay = async (challengeId: string, day: number) => {
    if (!user) return;

    const progress = userProgress[challengeId];
    if (!progress) return;

    const completedDays = [...progress.completed_days];
    if (!completedDays.includes(day)) {
      completedDays.push(day);
    }

    const challenge = challenges.find((c) => c.id === challengeId);
    const isCompleted = completedDays.length >= (challenge?.duration_days || 0);

    const updates: any = {
      completed_days: completedDays,
      current_day: Math.min(day + 1, challenge?.duration_days || 0),
      updated_at: new Date().toISOString(),
    };

    if (isCompleted) {
      updates.is_completed = true;
      updates.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('user_challenge_progress')
      .update(updates)
      .eq('id', progress.id);

    if (!error) {
      await loadChallenges();
    }
  };

  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      'self-love': 'from-pink-100 to-rose-100 border-pink-500',
      courage: 'from-orange-100 to-amber-100 border-orange-500',
      gratitude: 'from-purple-100 to-pink-100 border-purple-500',
      anxiety: 'from-blue-100 to-cyan-100 border-blue-500',
      joy: 'from-yellow-100 to-amber-100 border-yellow-500',
    };
    return colors[theme] || 'from-emerald-100 to-teal-100 border-emerald-500';
  };

  const getThemeIcon = (theme: string) => {
    return theme === 'courage' ? '🦁' : theme === 'gratitude' ? '🙏' : theme === 'anxiety' ? '🧘' : theme === 'joy' ? '✨' : '💖';
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
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-gray-900">Mood Challenges</h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {challenges.map((challenge) => {
                const progress = userProgress[challenge.id];
                const hasStarted = !!progress;
                const isCompleted = progress?.is_completed;
                const completedDays = progress?.completed_days || [];
                const progressPercent = hasStarted
                  ? (completedDays.length / challenge.duration_days) * 100
                  : 0;

                return (
                  <div
                    key={challenge.id}
                    className={`border-2 rounded-xl overflow-hidden ${
                      isCompleted ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                    }`}
                  >
                    <div className={`p-6 bg-gradient-to-r ${getThemeColor(challenge.theme)}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <span className="text-4xl">{getThemeIcon(challenge.theme)}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {challenge.title}
                              {isCompleted && <span className="ml-2 text-sm">✓</span>}
                            </h3>
                            <p className="text-gray-700">{challenge.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {challenge.duration_days} days
                              </span>
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                {challenge.badge_name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {hasStarted && !isCompleted && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-gray-700">
                            <span className="font-semibold">Progress</span>
                            <span>
                              {completedDays.length} / {challenge.duration_days} days
                            </span>
                          </div>
                          <div className="w-full bg-white/50 rounded-full h-3">
                            <div
                              className="bg-emerald-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                          <Trophy className="w-5 h-5" />
                          Challenge Completed! Badge Earned: {challenge.badge_name}
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-white">
                      {!hasStarted ? (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setSelectedChallenge(challenge);
                              setShowPrompts(true);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => startChallenge(challenge.id)}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2"
                          >
                            <Flame className="w-4 h-4" />
                            Start Challenge
                          </button>
                        </div>
                      ) : isCompleted ? (
                        <div className="text-sm text-gray-600">
                          Completed on {new Date(progress.completed_at!).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm font-semibold text-gray-900">Daily Progress</div>
                          <div className="grid grid-cols-7 gap-2">
                            {Array.from({ length: challenge.duration_days }).map((_, idx) => {
                              const dayNum = idx + 1;
                              const isCompleted = completedDays.includes(dayNum);
                              const isCurrent = progress.current_day === dayNum;

                              return (
                                <button
                                  key={dayNum}
                                  onClick={() => !isCompleted && completeDay(challenge.id, dayNum)}
                                  disabled={isCompleted}
                                  className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-500 text-white'
                                      : isCurrent
                                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  <span className="text-xs font-semibold">Day {dayNum}</span>
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4 mt-1" />
                                  ) : (
                                    <Circle className="w-4 h-4 mt-1" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              Today's Prompt (Day {progress.current_day}):
                            </div>
                            <p className="text-gray-700 italic">
                              {challenge.daily_prompts[progress.current_day - 1] || 'Complete your journal entry!'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {showPrompts && selectedChallenge && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedChallenge.title}
                    </h3>
                    <p className="text-gray-600">{selectedChallenge.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPrompts(false);
                      setSelectedChallenge(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900">Daily Prompts:</h4>
                  {selectedChallenge.daily_prompts.map((prompt, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-emerald-600 flex-shrink-0">
                        Day {idx + 1}
                      </span>
                      <p className="text-gray-700">{prompt}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    startChallenge(selectedChallenge.id);
                    setShowPrompts(false);
                    setSelectedChallenge(null);
                  }}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                >
                  Start This Challenge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
