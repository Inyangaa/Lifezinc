import { useState } from 'react';
import { ArrowLeft, Heart, Users, Baby, UserCheck, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CaregiverPageProps {
  onBack: () => void;
}

const RELATIONSHIP_TYPES = [
  { id: 'child', label: 'Child', icon: <Baby className="w-5 h-5" /> },
  { id: 'partner', label: 'Partner', icon: <Heart className="w-5 h-5" /> },
  { id: 'parent', label: 'Parent', icon: <Users className="w-5 h-5" /> },
  { id: 'friend', label: 'Friend', icon: <UserCheck className="w-5 h-5" /> },
  { id: 'other', label: 'Other', icon: <Users className="w-5 h-5" /> },
];

export function CaregiverPage({ onBack }: CaregiverPageProps) {
  const { user } = useAuth();
  const [relationshipType, setRelationshipType] = useState('');
  const [relationshipName, setRelationshipName] = useState('');
  const [emotionObserved, setEmotionObserved] = useState('');
  const [context, setContext] = useState('');
  const [suggestedResponse, setSuggestedResponse] = useState('');
  const [saving, setSaving] = useState(false);

  const generateResponse = () => {
    const responses: Record<string, string> = {
      sad: `Validate their feelings: "I can see you're hurting." Offer presence: "I'm here with you." Avoid fixing immediately—just be present.`,
      anxious: `Stay calm yourself: "Let's take some slow breaths together." Help ground them: "What are three things you can see right now?" Reassure: "We'll get through this together."`,
      angry: `Stay composed: "I hear you're really upset." Set boundaries if needed: "It's okay to be angry, but not to hurt." Help them name it: "You feel angry because..."`,
      frustrated: `Acknowledge it: "That sounds really frustrating." Problem-solve together: "What would help right now?" Validate effort: "I see how hard you're trying."`,
      scared: `Provide safety: "You're safe. I'm here." Don't dismiss: "Tell me what scared you." Comfort physically if appropriate.`,
      hurt: `Empathize deeply: "That must have really hurt." Validate: "Your feelings make complete sense." Offer repair: "How can we make this better together?"`,
      overwhelmed: `Simplify: "Let's take one thing at a time." Offer help: "What's the most important thing right now?" Normalize: "It makes sense to feel overwhelmed."`,
      lonely: `Connect: "I'm glad you told me. You're not alone." Spend time together without agenda. Remind: "I care about you very much."`,
      excited: `Match their energy: "That's wonderful!" Ask questions: "Tell me more!" Share their joy: "I'm so happy for you!"`,
      happy: `Celebrate with them: "I love seeing you so happy!" Ask what made them happy. Join the moment fully.`,
    };

    const response = responses[emotionObserved.toLowerCase()] ||
      `Listen without judgment. Validate their experience: "That sounds really hard." Ask: "What do you need right now?" Be present rather than trying to fix.`;

    setSuggestedResponse(response);
  };

  const handleSubmit = async () => {
    if (!user || !relationshipType || !emotionObserved || !context) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('caregiver_logs').insert([
      {
        user_id: user.id,
        relationship_type: relationshipType,
        relationship_name: relationshipName || null,
        emotion_observed: emotionObserved,
        context,
        suggested_response: suggestedResponse,
      },
    ]);

    if (error) {
      console.error('Error saving log:', error);
      alert('Failed to save. Please try again.');
    } else {
      setRelationshipType('');
      setRelationshipName('');
      setEmotionObserved('');
      setContext('');
      setSuggestedResponse('');
      alert('Log saved successfully!');
    }

    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-rose-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Caregiver Mode</h2>
              <p className="text-gray-600">Log emotions you observe and get supportive guidance</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-blue-900">
              This is a private space for caregivers to process emotions they observe in others and receive guidance on how to respond with empathy. Your entries are completely separate from your personal journal.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Who are you logging for?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {RELATIONSHIP_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setRelationshipType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      relationshipType === type.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    {type.icon}
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {relationshipType && (
              <div className="animate-in fade-in duration-300">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  value={relationshipName}
                  onChange={(e) => setRelationshipName(e.target.value)}
                  placeholder="e.g., Emma, my daughter"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                What emotion did you observe?
              </label>
              <input
                type="text"
                value={emotionObserved}
                onChange={(e) => setEmotionObserved(e.target.value)}
                placeholder="e.g., sad, anxious, frustrated, excited"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                What happened? (Context)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Describe the situation..."
                className="w-full min-h-[120px] px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={generateResponse}
              disabled={!emotionObserved || !context}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Get Supportive Guidance
            </button>

            {suggestedResponse && (
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 animate-in fade-in duration-300">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Suggested Empathetic Response
                </h3>
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {suggestedResponse}
                </p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={saving || !relationshipType || !emotionObserved || !context}
              className="w-full py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {saving ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
