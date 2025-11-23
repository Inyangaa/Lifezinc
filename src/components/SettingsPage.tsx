import { useState, useEffect } from 'react';
import { ArrowLeft, Crown, CheckCircle } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getFaithTraditions } from '../utils/faithEncouragement';
import { GUIDANCE_VOICES } from '../utils/guidanceVoices';

interface SettingsPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

export function SettingsPage({ onBack, onNavigate }: SettingsPageProps) {
  const { subscription, isPro } = useSubscription();
  const { user } = useAuth();
  const [faithEnabled, setFaithEnabled] = useState(false);
  const [selectedFaith, setSelectedFaith] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('gentle_therapist');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const faithTraditions = getFaithTraditions();

  useEffect(() => {
    loadFaithPreferences();
  }, [user]);

  const loadFaithPreferences = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from('user_preferences')
      .select('faith_support_enabled, faith_tradition, guidance_voice')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setFaithEnabled(data.faith_support_enabled || false);
      setSelectedFaith(data.faith_tradition || '');
      setSelectedVoice(data.guidance_voice || 'gentle_therapist');
    }
  };

  const saveFaithPreferences = async () => {
    if (!user?.id) return;

    setSaving(true);
    setSaveMessage('');

    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          faith_support_enabled: faithEnabled,
          faith_tradition: selectedFaith,
          guidance_voice: selectedVoice,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating faith preferences:', error);
        setSaveMessage('Failed to save preferences');
      } else {
        setSaveMessage('Preferences saved successfully');
      }
    } else {
      const { error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          faith_support_enabled: faithEnabled,
          faith_tradition: selectedFaith,
          guidance_voice: selectedVoice,
        });

      if (error) {
        console.error('Error creating faith preferences:', error);
        setSaveMessage('Failed to save preferences');
      } else {
        setSaveMessage('Preferences saved successfully');
      }
    }

    setSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Settings</h2>

          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {isPro && <Crown className="w-5 h-5 text-amber-500" />}
                    <span className="font-semibold text-gray-900">
                      {isPro ? 'Pro Plan' : 'Free Plan'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {isPro
                      ? 'Access to all premium features'
                      : 'Upgrade to unlock advanced features'
                    }
                  </p>
                </div>
                {onNavigate && !isPro && (
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Upgrade
                  </button>
                )}
                {onNavigate && isPro && (
                  <button
                    onClick={() => onNavigate('pricing')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Manage
                  </button>
                )}
              </div>
            </div>

            <ThemeSelector />

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guidance Voice</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose the personality style for your emotional guidance
              </p>
              <div className="grid gap-3">
                {GUIDANCE_VOICES.map((voice) => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedVoice === voice.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{voice.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{voice.name}</h4>
                          {selectedVoice === voice.id && (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{voice.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spiritual Support</h3>
              <div className="space-y-6">
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label htmlFor="faith-toggle" className="font-medium text-gray-900 cursor-pointer">
                        Enable Faith Support
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive spiritual encouragement based on your faith tradition
                      </p>
                    </div>
                    <button
                      id="faith-toggle"
                      onClick={() => setFaithEnabled(!faithEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        faithEnabled ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          faithEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {faithEnabled && (
                  <div className="space-y-3 animate-in fade-in duration-300">
                    <label className="block text-sm font-medium text-gray-900">
                      Select Your Spiritual Tradition
                    </label>
                    <div className="grid gap-3">
                      {faithTraditions.map((tradition) => (
                        <button
                          key={tradition.id}
                          onClick={() => setSelectedFaith(tradition.id)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedFaith === tradition.id
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{tradition.icon}</span>
                              <div>
                                <div className="font-semibold text-gray-900">{tradition.name}</div>
                                <div className="text-sm text-gray-600">{tradition.book}</div>
                              </div>
                            </div>
                            {selectedFaith === tradition.id && (
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={saveFaithPreferences}
                      disabled={saving || !selectedFaith}
                      className="w-full mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>

                    {saveMessage && (
                      <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-800 text-sm text-center">
                        {saveMessage}
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> After completing your emotional transformation in the journal, you'll
                        receive a verse from your selected tradition that relates to your emotional state, along
                        with a gentle reflection prompt. This feature is completely optional and respectful of
                        all traditions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
