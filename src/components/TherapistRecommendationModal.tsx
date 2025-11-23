import { useState } from 'react';
import { X, Heart, Phone, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

interface TherapistRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSupport: () => void;
  distressLevel: 'moderate' | 'high' | 'severe';
  recommendation: string;
}

export function TherapistRecommendationModal({
  isOpen,
  onClose,
  onNavigateToSupport,
  distressLevel,
  recommendation,
}: TherapistRecommendationModalProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!isOpen || dismissed) return null;

  const isCrisis = distressLevel === 'severe';

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCrisis ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <Heart className={`w-6 h-6 ${isCrisis ? 'text-red-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCrisis ? 'Please Consider Getting Help' : 'We Care About You'}
                </h2>
                <p className="text-gray-600">Professional support may help</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDismissed(true);
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isCrisis && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-900 font-semibold mb-2">
                    Your safety is our top priority
                  </p>
                  <p className="text-red-800 text-sm mb-3">
                    If you're having thoughts of suicide or self-harm, please reach out for immediate help.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="tel:988"
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm inline-flex"
                    >
                      <Phone className="w-4 h-4" />
                      Call 988 (Suicide & Crisis Lifeline)
                    </a>
                    <p className="text-red-700 text-xs">
                      Or text HOME to 741741 for 24/7 crisis support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-500 mb-4">
              <p className="text-gray-800 leading-relaxed mb-4">{recommendation}</p>
              <p className="text-gray-700 text-sm">
                LifeZinc has noticed patterns in your emotional entries that may benefit from professional guidance.
                This is a gentle nudge, not a diagnosis. You're in control of your healing journey.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Why This Suggestion?
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>You've been experiencing persistent difficult emotions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Professional therapists have specialized training to help</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Therapy provides tools and support that journaling alone may not</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">•</span>
                  <span>Seeking help is a sign of strength and self-care</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-900 text-sm">
                <strong>Important:</strong> LifeZinc is a wellness tool and does not replace professional mental health care.
                This recommendation is based on patterns in your journal entries and is meant to support your wellbeing.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                onNavigateToSupport();
                setDismissed(true);
              }}
              className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
            >
              Find Professional Support Near Me
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setDismissed(true);
                onClose();
              }}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Not Right Now
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              We won't show this again for at least 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
