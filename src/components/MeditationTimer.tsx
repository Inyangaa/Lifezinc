import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface MeditationTimerProps {
  onClose: () => void;
}

export function MeditationTimer({ onClose }: MeditationTimerProps) {
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<'breath' | 'meditation' | 'body-scan'>('breath');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercises = {
    breath: {
      title: 'Box Breathing',
      description: '4-4-4-4 breathing pattern for calm and focus',
      phases: [
        { name: 'inhale', duration: 4, instruction: 'Breathe In' },
        { name: 'hold', duration: 4, instruction: 'Hold' },
        { name: 'exhale', duration: 4, instruction: 'Breathe Out' },
        { name: 'rest', duration: 4, instruction: 'Hold Empty' },
      ],
    },
    meditation: {
      title: 'Mindfulness Meditation',
      description: 'Focus on your breath and observe your thoughts',
    },
    'body-scan': {
      title: 'Body Scan',
      description: 'Progressive relaxation from head to toe',
    },
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playCompletionSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (isRunning && selectedExercise === 'breath') {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
      let currentPhaseIndex = 0;
      let phaseTime = 0;

      breathIntervalRef.current = setInterval(() => {
        phaseTime++;
        if (phaseTime >= 4) {
          phaseTime = 0;
          currentPhaseIndex = (currentPhaseIndex + 1) % 4;
          setBreathPhase(phases[currentPhaseIndex]);
        }
      }, 1000);
    } else {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    }

    return () => {
      if (breathIntervalRef.current) {
        clearInterval(breathIntervalRef.current);
      }
    };
  }, [isRunning, selectedExercise]);

  const playCompletionSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzbJ7fHMgDEGHm7A7+OZURE');
    audio.play().catch(() => {});
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration * 60);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setBreathPhase('inhale');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  const getBreathCircleScale = () => {
    if (!isRunning) return 1;
    switch (breathPhase) {
      case 'inhale':
        return 1.5;
      case 'exhale':
        return 0.7;
      default:
        return 1.2;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mindfulness Practice</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2">
            {Object.entries(exercises).map(([key, exercise]) => (
              <button
                key={key}
                onClick={() => {
                  setSelectedExercise(key as any);
                  resetTimer();
                }}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedExercise === key
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-sm text-gray-900">{exercise.title}</div>
                <div className="text-xs text-gray-600 mt-1">{exercise.description}</div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center">
            {selectedExercise === 'breath' && (
              <div className="relative flex items-center justify-center h-64">
                <div
                  className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 transition-all duration-[4000ms] ease-in-out"
                  style={{
                    transform: `scale(${getBreathCircleScale()})`,
                    opacity: isRunning ? 0.8 : 0.5,
                  }}
                ></div>
                <div className="relative z-10 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {isRunning ? exercises.breath.phases.find(p => p.name === breathPhase)?.instruction : 'Ready'}
                  </div>
                  <div className="text-6xl font-bold text-white">{formatTime(timeLeft)}</div>
                </div>
              </div>
            )}

            {selectedExercise !== 'breath' && (
              <div className="text-center">
                <Clock className="w-24 h-24 text-emerald-600 mx-auto mb-4" />
                <div className="text-6xl font-bold text-gray-900 mb-2">{formatTime(timeLeft)}</div>
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {!isRunning && timeLeft === selectedDuration * 60 && (
            <div className="flex gap-2 justify-center">
              {[3, 5, 10, 15, 20].map((duration) => (
                <button
                  key={duration}
                  onClick={() => {
                    setSelectedDuration(duration);
                    setTimeLeft(duration * 60);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDuration === duration
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={toggleTimer}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {timeLeft === selectedDuration * 60 ? 'Start' : 'Resume'}
                </>
              )}
            </button>

            {timeLeft !== selectedDuration * 60 && (
              <button
                onClick={resetTimer}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            )}
          </div>

          {timeLeft === 0 && (
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-emerald-700 font-semibold">Session Complete! Great work on your practice.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
