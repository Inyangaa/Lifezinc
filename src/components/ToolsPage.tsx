import { useState } from 'react';
import { ArrowLeft, Wind, Heart, Sparkles, RefreshCw, Timer } from 'lucide-react';
import { MeditationTimer } from './MeditationTimer';

interface ToolsPageProps {
  onBack: () => void;
}

type Tool = 'breathing' | 'affirmations' | 'grounding' | 'meditation' | null;

const affirmations = [
  "I am worthy of love and respect.",
  "My feelings are valid and important.",
  "I choose to focus on what I can control.",
  "I am growing stronger every day.",
  "It's okay to ask for help when I need it.",
  "I deserve peace and happiness.",
  "My journey is unique and valuable.",
  "I trust myself to make good decisions.",
  "I am resilient and capable.",
  "Today, I choose kindness toward myself.",
  "I release what I cannot change.",
  "I am doing the best I can.",
  "My emotions do not define me.",
  "I am enough, just as I am.",
  "I celebrate my progress, no matter how small.",
];

const groundingSteps = [
  "Name 5 things you can see around you",
  "Identify 4 things you can touch",
  "Notice 3 things you can hear",
  "Find 2 things you can smell",
  "Acknowledge 1 thing you can taste",
];

export function ToolsPage({ onBack }: ToolsPageProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [groundingStep, setGroundingStep] = useState(0);
  const [showMeditation, setShowMeditation] = useState(false);

  const startBreathing = () => {
    setActiveTool('breathing');
    setBreathingPhase('inhale');
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingSteps.length - 1) {
      setGroundingStep(groundingStep + 1);
    } else {
      setGroundingStep(0);
    }
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Coping Tools</h2>

          {!activeTool ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={startBreathing}
                className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <Wind className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Breathing Exercise</h3>
                <p className="text-gray-600 text-sm">
                  Calm your mind with guided deep breathing
                </p>
              </button>

              <button
                onClick={() => setActiveTool('affirmations')}
                className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <Heart className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Affirmations</h3>
                <p className="text-gray-600 text-sm">
                  Positive reminders to boost your mood
                </p>
              </button>

              <button
                onClick={() => setActiveTool('grounding')}
                className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <Sparkles className="w-12 h-12 text-emerald-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Grounding Technique</h3>
                <p className="text-gray-600 text-sm">
                  Connect with the present moment using your senses
                </p>
              </button>

              <button
                onClick={() => setShowMeditation(true)}
                className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1 text-left"
              >
                <Timer className="w-12 h-12 text-amber-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Meditation Timer</h3>
                <p className="text-gray-600 text-sm">
                  Guided meditation with breathing exercises
                </p>
              </button>
            </div>
          ) : activeTool === 'breathing' ? (
            <div className="text-center py-12">
              <div className="mb-8">
                <div
                  className={`w-32 h-32 mx-auto rounded-full transition-all duration-4000 ${
                    breathingPhase === 'inhale'
                      ? 'bg-blue-400 scale-150'
                      : breathingPhase === 'hold'
                      ? 'bg-purple-400 scale-150'
                      : 'bg-teal-400 scale-100'
                  }`}
                  style={{
                    animation:
                      breathingPhase === 'inhale'
                        ? 'breathe-in 4s ease-in-out'
                        : breathingPhase === 'exhale'
                        ? 'breathe-out 4s ease-in-out'
                        : 'none',
                  }}
                ></div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {breathingPhase === 'inhale' && 'Breathe In'}
                {breathingPhase === 'hold' && 'Hold'}
                {breathingPhase === 'exhale' && 'Breathe Out'}
              </h3>

              <p className="text-gray-600 mb-8">
                {breathingPhase === 'inhale' && 'Inhale deeply through your nose'}
                {breathingPhase === 'hold' && 'Hold your breath gently'}
                {breathingPhase === 'exhale' && 'Exhale slowly through your mouth'}
              </p>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    const phases: Array<'inhale' | 'hold' | 'exhale'> = ['inhale', 'hold', 'exhale'];
                    const currentIndex = phases.indexOf(breathingPhase);
                    setBreathingPhase(phases[(currentIndex + 1) % phases.length]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Phase
                </button>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : activeTool === 'affirmations' ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-purple-600 mx-auto mb-8" />
              <div className="max-w-2xl mx-auto mb-8">
                <p className="text-2xl font-semibold text-gray-900 leading-relaxed">
                  {affirmations[currentAffirmation]}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={nextAffirmation}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Next Affirmation
                </button>
                <button
                  onClick={() => setActiveTool(null)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  5-4-3-2-1 Grounding Technique
                </h3>
                <p className="text-gray-600 mb-8 text-center">
                  Use your five senses to ground yourself in the present moment
                </p>

                <div className="space-y-6">
                  {groundingSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl transition-all ${
                        index === groundingStep
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-l-4 border-emerald-600 scale-105'
                          : index < groundingStep
                          ? 'bg-gray-50 opacity-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-lg font-medium text-gray-900">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center mt-8">
                  {groundingStep < groundingSteps.length - 1 ? (
                    <button
                      onClick={nextGroundingStep}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button
                      onClick={nextGroundingStep}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Start Over
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveTool(null);
                      setGroundingStep(0);
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          {showMeditation && (
            <MeditationTimer onClose={() => setShowMeditation(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
