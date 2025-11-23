import { ArrowLeft, Check, Crown, Sparkles } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface PricingPageProps {
  onBack: () => void;
}

export function PricingPage({ onBack }: PricingPageProps) {
  const { subscription, isPro } = useSubscription();

  const freeTierFeatures = [
    'Basic journaling',
    'Mood tracking',
    'Emotion recycling',
    'Basic insights',
    'Community access',
    '10 journal entries history',
  ];

  const proTierFeatures = [
    'Everything in Free',
    'AI Coaching Companion',
    'Voice journaling',
    'Unlimited journal history',
    'Advanced analytics & insights',
    'PDF journal exports',
    'All mood challenges',
    'Priority support',
    'No ads',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade anytime for enhanced features
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-1">$0</div>
              <p className="text-gray-600">Forever free</p>
            </div>

            <ul className="space-y-4 mb-8">
              {freeTierFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {!isPro && subscription?.tier === 'free' && (
              <div className="text-center py-3 bg-emerald-50 text-emerald-700 font-semibold rounded-lg">
                Current Plan
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                BEST VALUE
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-1">$9.99</div>
              <p className="text-emerald-100">per month</p>
            </div>

            <ul className="space-y-4 mb-8">
              {proTierFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature}</span>
                </li>
              ))}
            </ul>

            {isPro ? (
              <div className="text-center py-3 bg-white/20 text-white font-semibold rounded-lg">
                Current Plan
              </div>
            ) : (
              <button className="w-full py-4 bg-white text-emerald-600 rounded-lg font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg">
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">
            Payment processing coming soon. All features currently available to all users!
          </p>
          <p className="text-sm">
            Cancel anytime. No hidden fees. 14-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
