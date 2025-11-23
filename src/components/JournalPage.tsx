import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Award, Heart, Lightbulb, WifiOff, CheckCircle, AlertCircle, Baby, User } from 'lucide-react';
import { getRandomReframe } from '../utils/reframeMessages';
import { MoodSelector } from './MoodSelector';
import { VoiceInput } from './VoiceInput';
import { TagSelector } from './TagSelector';
import { SOSButton } from './SOSButton';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { updateUserStreak, checkAndAwardAchievements } from '../utils/streakManager';
import { detectEmotion } from '../utils/emotionDetector';
import { generateCoachingResponse } from '../utils/aiCoach';
import { savePendingEntry, getPendingEntries, removePendingEntry, isOnline, generateOfflineId } from '../utils/offlineStorage';
import { generateEmotionalTransformation } from '../utils/emotionalTransformation';
import { awardRewards } from '../utils/gamification';
import { getFaithVerse, categorizeEmotion, FaithVerse } from '../utils/faithEncouragement';
import { getRandomInnerChildPrompt, generateInnerChildResponse, generateInnerChildAffirmations, generateInnerChildRenewalStep } from '../utils/innerChildMode';
import { detectDistressLevel, shouldShowTherapistRecommendation } from '../utils/distressDetector';
import { TherapistRecommendationModal } from './TherapistRecommendationModal';

interface JournalPageProps {
  onBack: () => void;
}

export function JournalPage({ onBack }: JournalPageProps) {
  const { user } = useAuth();
  const [feelings, setFeelings] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reframeMessage, setReframeMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [offline, setOffline] = useState(!isOnline());
  const [pendingSync, setPendingSync] = useState(getPendingEntries().length);
  const [transformation, setTransformation] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [faithEnabled, setFaithEnabled] = useState(false);
  const [faithTradition, setFaithTradition] = useState<string>('');
  const [faithVerse, setFaithVerse] = useState<FaithVerse | null>(null);
  const [innerChildMode, setInnerChildMode] = useState(false);
  const [innerChildPrompt, setInnerChildPrompt] = useState(getRandomInnerChildPrompt());
  const [actionCompleted, setActionCompleted] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [coachingResponse, setCoachingResponse] = useState<{
    message: string;
    reflectionQuestion?: string;
    copingTechnique?: {
      title: string;
      description: string;
      steps: string[];
    };
  } | null>(null);
  const [showTherapistModal, setShowTherapistModal] = useState(false);
  const [distressInfo, setDistressInfo] = useState<{
    level: 'moderate' | 'high' | 'severe';
    recommendation: string;
  } | null>(null);

  useEffect(() => {
    loadFaithPreferences();
    loadChapters();
  }, [user]);

  const loadChapters = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('life_chapters')
      .select('id, title, color')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false });

    setChapters(data || []);
  };

  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      syncPendingEntries();
    };
    const handleOffline = () => setOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (isOnline() && pendingSync > 0) {
      syncPendingEntries();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadFaithPreferences = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('faith_support_enabled, faith_tradition, inner_child_mode')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setFaithEnabled(data.faith_support_enabled || false);
      setFaithTradition(data.faith_tradition || '');
      setInnerChildMode(data.inner_child_mode || false);
    }
  };

  const toggleInnerChildMode = async () => {
    const newMode = !innerChildMode;
    setInnerChildMode(newMode);

    if (newMode) {
      setInnerChildPrompt(getRandomInnerChildPrompt());
    }

    if (!user?.id) return;

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('user_preferences')
        .update({
          inner_child_mode: newMode,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          inner_child_mode: newMode,
        });
    }
  };

  const syncPendingEntries = async () => {
    const pending = getPendingEntries();
    if (pending.length === 0) return;

    for (const entry of pending) {
      const { error } = await supabase.from('journal_entries').insert([{
        text_entry: entry.text_entry,
        mood: entry.mood,
        tags: entry.tags,
        initial_reframe: entry.initial_reframe,
        user_id: entry.user_id,
      }]);

      if (!error) {
        removePendingEntry(entry.id);
      }
    }

    setPendingSync(getPendingEntries().length);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleVoiceTranscript = (transcript: string) => {
    setFeelings((prev) => (prev ? prev + ' ' + transcript : transcript));
  };

  useEffect(() => {
    if (feelings.trim().length > 20 && !selectedMood) {
      const detected = detectEmotion(feelings);
      if (detected) {
        setSelectedMood(detected);
      }
    }
  }, [feelings]);

  const handleRecycle = async () => {
    if (!feelings.trim()) return;

    setIsAnimating(true);
    const reframe = innerChildMode
      ? generateInnerChildResponse(feelings, selectedMood || 'neutral')
      : getRandomReframe();
    setReframeMessage(reframe);

    let emotionalTransform;
    if (innerChildMode) {
      emotionalTransform = {
        steps: [
          {
            title: 'Your Younger Self Hears You',
            description: reframe,
            icon: '👂',
          },
          {
            title: 'Inner Child Affirmations',
            description: 'Gentle truths for your younger self',
            icon: '💝',
            affirmations: generateInnerChildAffirmations(selectedMood || 'neutral'),
          },
          {
            title: 'Comfort & Nurture',
            description: 'You are giving yourself what you always needed',
            icon: '🤗',
          },
          {
            title: 'Healing Action',
            description: generateInnerChildRenewalStep(selectedMood || 'neutral'),
            icon: '🌱',
          },
        ],
      };
    } else {
      emotionalTransform = generateEmotionalTransformation(
        selectedMood || 'neutral',
        feelings
      );
    }
    setTransformation(emotionalTransform);
    setCurrentStep(0);

    if (faithEnabled && faithTradition) {
      const emotionCategory = categorizeEmotion(selectedMood || 'neutral');
      const verse = getFaithVerse(faithTradition, emotionCategory);
      setFaithVerse(verse);
    }

    const coaching = generateCoachingResponse(
      selectedMood || 'neutral',
      feelings,
      reframe
    );
    setCoachingResponse(coaching);

    setTimeout(() => setIsAnimating(false), 600);

    setIsSaving(true);
    try {
      if (!isOnline()) {
        const offlineEntry = {
          id: generateOfflineId(),
          text_entry: feelings,
          mood: selectedMood,
          tags: selectedTags.length > 0 ? selectedTags : null,
          initial_reframe: reframe,
          user_id: user?.id || '',
          created_at: new Date().toISOString(),
        };
        savePendingEntry(offlineEntry);
        setPendingSync(getPendingEntries().length);

        setTimeout(() => {
          setFeelings('');
          setSelectedMood(null);
          setSelectedTags([]);
          setReframeMessage('');
          setCoachingResponse(null);
          setTransformation(null);
          setCurrentStep(0);
          setFaithVerse(null);
        }, 2000);
      } else {
        const actionText = emotionalTransform.steps?.[3]?.description || emotionalTransform.steps?.[3]?.content || '';

        const { data: insertedData, error } = await supabase.from('journal_entries').insert([
          {
            text_entry: feelings,
            mood: selectedMood,
            tags: selectedTags.length > 0 ? selectedTags : null,
            initial_reframe: reframe,
            is_inner_child_mode: innerChildMode,
            action_text: actionText,
            action_completed: false,
            chapter_id: selectedChapter,
            user_id: user?.id,
          },
        ]).select();

        if (insertedData && insertedData[0]) {
          setCurrentEntryId(insertedData[0].id);
        }

        if (error) {
          console.error('Error saving entry:', error);
        } else {
          if (user?.id) {
            await updateUserStreak(user.id);
            const achievements = await checkAndAwardAchievements(user.id);
            if (achievements.length > 0) {
              setNewAchievements(achievements);
              setTimeout(() => setNewAchievements([]), 5000);
            }

            await awardRewards(user.id, 'journal_entry');

            const { data: recentEntries } = await supabase
              .from('journal_entries')
              .select('id')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(10);

            const distressResult = detectDistressLevel(
              feelings,
              selectedMood,
              recentEntries?.length || 0
            );

            if (insertedData && insertedData[0]) {
              await supabase.from('distress_tracking').insert({
                user_id: user.id,
                journal_entry_id: insertedData[0].id,
                distress_level: distressResult.level,
                triggers: distressResult.triggers,
                recommendation_shown: distressResult.shouldShowSupport,
              });
            }

            if (distressResult.shouldShowSupport && distressResult.level !== 'low') {
              const { data: recentDistress } = await supabase
                .from('distress_tracking')
                .select('distress_level, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

              const { data: lastRecommendation } = await supabase
                .from('therapist_recommendations')
                .select('shown_at')
                .eq('user_id', user.id)
                .order('shown_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              const daysSinceLast = lastRecommendation
                ? Math.floor((Date.now() - new Date(lastRecommendation.shown_at).getTime()) / (1000 * 60 * 60 * 24))
                : 999;

              const recentLevels = recentDistress?.map(d => d.distress_level) || [];

              if (shouldShowTherapistRecommendation(recentLevels, daysSinceLast)) {
                setDistressInfo({
                  level: distressResult.level as 'moderate' | 'high' | 'severe',
                  recommendation: distressResult.recommendation,
                });
                setShowTherapistModal(true);

                await supabase.from('therapist_recommendations').insert({
                  user_id: user.id,
                  category: selectedMood || 'general',
                  shown_at: new Date().toISOString(),
                });
              }
            }
          }

          setTimeout(() => {
            setFeelings('');
            setSelectedMood(null);
            setSelectedTags([]);
            setReframeMessage('');
            setCoachingResponse(null);
            setTransformation(null);
            setCurrentStep(0);
            setFaithVerse(null);
            setActionCompleted(false);
            setCurrentEntryId(null);
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          {offline && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm">
              <WifiOff className="w-4 h-4" />
              <span>Offline Mode</span>
              {pendingSync > 0 && <span className="font-semibold">({pendingSync} pending)</span>}
            </div>
          )}
        </div>

        <div className={`rounded-2xl shadow-xl p-6 md:p-10 space-y-6 ${
          innerChildMode
            ? 'bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50'
            : 'bg-white'
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h2 className="text-3xl font-bold text-gray-900">
                {innerChildMode ? innerChildPrompt.intro : "What's on your mind?"}
              </h2>
              <p className="text-gray-600">
                {innerChildMode
                  ? innerChildPrompt.promptQuestion
                  : "Share your feelings. We'll help you find a new perspective."}
              </p>
            </div>

            <button
              onClick={toggleInnerChildMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                innerChildMode
                  ? 'bg-pink-100 text-pink-700 border-2 border-pink-300 hover:bg-pink-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:bg-gray-200'
              }`}
              title={innerChildMode ? 'Switch to regular mode' : 'Switch to Inner Child mode'}
            >
              {innerChildMode ? (
                <>
                  <Baby className="w-4 h-4" />
                  <span className="hidden sm:inline">Inner Child</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Regular</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <MoodSelector
              selectedMood={selectedMood}
              onMoodSelect={setSelectedMood}
            />

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">
                Tell us more
              </label>
              <div className="flex gap-2">
                <textarea
                  value={feelings}
                  onChange={(e) => setFeelings(e.target.value)}
                  placeholder={innerChildMode ? innerChildPrompt.placeholder : "I'm feeling..."}
                  className={`flex-1 min-h-[180px] p-4 border-2 rounded-xl focus:outline-none resize-none text-gray-900 placeholder-gray-400 transition-colors ${
                    innerChildMode
                      ? 'border-pink-200 focus:border-pink-400 bg-white bg-opacity-70'
                      : 'border-gray-200 focus:border-emerald-500'
                  }`}
                />
                <div className="flex items-start">
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
              </div>
            </div>

            <TagSelector
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />

            {chapters.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">
                  Life Chapter (Optional)
                </label>
                <select
                  value={selectedChapter || ''}
                  onChange={(e) => setSelectedChapter(e.target.value || null)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-gray-900"
                >
                  <option value="">No chapter</option>
                  {chapters.map((chapter) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleRecycle}
              disabled={!feelings.trim() || isSaving}
              className={`w-full py-4 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-2 ${
                innerChildMode
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {innerChildMode ? <Baby className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              {isSaving ? 'Saving...' : innerChildMode ? 'Connect with Inner Child' : 'Recycle Emotion'}
            </button>
          </div>

          {transformation && (
            <div className="mt-6 space-y-4">
              <div className={`rounded-xl p-6 border-l-4 ${
                innerChildMode
                  ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-500'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-500'
              }`}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {innerChildMode ? (
                    <>
                      <Baby className="w-6 h-6 text-pink-600" />
                      Your Inner Child Healing Journey
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      Your Emotional Transformation Journey
                    </>
                  )}
                </h3>
                <p className="text-gray-700 mb-4">
                  {innerChildMode
                    ? 'Gentle steps to heal and nurture your younger self'
                    : 'Follow this 4-step process to transform your emotions into healing outcomes'}
                </p>
              </div>

              <div className="space-y-3">
                {Object.values(transformation).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-xl transition-all ${
                      idx === currentStep
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                        : idx < currentStep
                        ? 'border-gray-300 bg-gray-50 opacity-75'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            idx < currentStep
                              ? 'bg-emerald-500 text-white'
                              : idx === currentStep
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {idx < currentStep ? <CheckCircle className="w-5 h-5" /> : step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                          <p className="text-gray-800 leading-relaxed mb-2">{step.content}</p>
                          {step.actionPrompt && (
                            <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg">
                              <p className="text-sm text-gray-700 italic">{step.actionPrompt}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {idx === currentStep && currentStep < 3 && (
                        <button
                          onClick={async () => {
                            const newStep = currentStep + 1;
                            setCurrentStep(newStep);
                            if (newStep === 3 && user?.id) {
                              await awardRewards(user.id, 'transformation_complete');
                            }
                          }}
                          className="mt-3 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          Next Step
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}

                      {idx === currentStep && currentStep === 3 && (
                        <div className="mt-3 space-y-3">
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <p className="text-emerald-800 font-semibold flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Transformation Complete! You've taken meaningful steps toward healing.
                            </p>
                          </div>

                          {step.description && !innerChildMode && (
                            <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="text-2xl">🎯</div>
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 mb-2">Your Actionable Step</h5>
                                  <p className="text-gray-800 mb-3">{step.description}</p>
                                  <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                      type="checkbox"
                                      checked={actionCompleted}
                                      onChange={async (e) => {
                                        const completed = e.target.checked;
                                        setActionCompleted(completed);
                                        if (currentEntryId && user?.id) {
                                          await supabase
                                            .from('journal_entries')
                                            .update({ action_completed: completed })
                                            .eq('id', currentEntryId);
                                          if (completed) {
                                            await awardRewards(user.id, 'action_completed');
                                          }
                                        }
                                      }}
                                      className="w-5 h-5 rounded border-2 border-gray-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <span className={`font-medium transition-colors ${
                                      actionCompleted ? 'text-emerald-700 line-through' : 'text-gray-700 group-hover:text-emerald-600'
                                    }`}>
                                      {actionCompleted ? 'Completed! Great work!' : 'Mark as completed'}
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coachingResponse && transformation && currentStep === 3 && (
            <div className="mt-6 space-y-4">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start gap-3 mb-3">
                  <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Your AI Coach</h3>
                    <p className="text-gray-800 leading-relaxed">{coachingResponse.message}</p>
                  </div>
                </div>
              </div>

              {coachingResponse.reflectionQuestion && (
                <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Reflection</h4>
                      <p className="text-gray-700 italic">{coachingResponse.reflectionQuestion}</p>
                    </div>
                  </div>
                </div>
              )}

              {coachingResponse.copingTechnique && (
                <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                  <h4 className="font-bold text-gray-900 mb-2">Try This: {coachingResponse.copingTechnique.title}</h4>
                  <p className="text-gray-700 text-sm mb-3">{coachingResponse.copingTechnique.description}</p>
                  <ol className="space-y-2">
                    {coachingResponse.copingTechnique.steps.map((step, idx) => (
                      <li key={idx} className="text-gray-800 text-sm flex items-start">
                        <span className="font-semibold text-green-600 mr-2">{idx + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {faithVerse && faithEnabled && transformation && currentStep === 3 && (
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg border-2 border-amber-200 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                    <span className="text-4xl">
                      {faithTradition === 'christianity' && '✝'}
                      {faithTradition === 'islam' && '☪'}
                      {faithTradition === 'judaism' && '✡'}
                      {faithTradition === 'hinduism' && '🕉'}
                      {faithTradition === 'buddhism' && '☸'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Spiritual Encouragement</h3>
                  <p className="text-sm text-gray-600">From your faith tradition</p>
                </div>

                <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                  <p className="text-gray-800 text-lg leading-relaxed text-center font-serif italic mb-4">
                    "{faithVerse.text}"
                  </p>
                  <p className="text-center text-gray-600 text-sm">
                    — {faithVerse.citation}
                  </p>
                </div>

                <div className="bg-white bg-opacity-60 rounded-lg p-5 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">💭</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Gentle Reflection</h4>
                      <p className="text-gray-700 leading-relaxed">{faithVerse.reflection}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {newAchievements.length > 0 && (
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-l-4 border-purple-600 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">New Achievement Unlocked!</h3>
              </div>
              <div className="space-y-2">
                {newAchievements.map((achievement) => (
                  <p key={achievement} className="text-gray-800 capitalize">
                    {achievement.replace(/_/g, ' ')}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <SOSButton />
      {showTherapistModal && distressInfo && (
        <TherapistRecommendationModal
          isOpen={showTherapistModal}
          onClose={() => setShowTherapistModal(false)}
          onNavigateToSupport={() => {
            setShowTherapistModal(false);
            onBack();
          }}
          distressLevel={distressInfo.level}
          recommendation={distressInfo.recommendation}
        />
      )}
    </div>
  );
}
