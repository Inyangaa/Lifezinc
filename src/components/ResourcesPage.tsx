import { ArrowLeft, BookOpen, Brain, Heart, Lightbulb } from 'lucide-react';

interface ResourcesPageProps {
  onBack: () => void;
}

interface Resource {
  title: string;
  category: string;
  description: string;
  content: string[];
  icon: 'brain' | 'heart' | 'lightbulb';
}

const resources: Resource[] = [
  {
    title: 'Understanding Cognitive Distortions',
    category: 'CBT Techniques',
    description: 'Learn to identify and challenge unhelpful thought patterns',
    icon: 'brain',
    content: [
      'All-or-Nothing Thinking: Seeing things in black and white categories',
      'Overgeneralization: Making broad conclusions from single events',
      'Mental Filter: Focusing only on negatives while ignoring positives',
      'Catastrophizing: Expecting the worst possible outcome',
      'Emotional Reasoning: Believing feelings reflect reality',
      'Should Statements: Criticizing yourself with "should" and "must"',
    ],
  },
  {
    title: 'Building Emotional Resilience',
    category: 'Mental Health',
    description: 'Strategies to bounce back from life\'s challenges',
    icon: 'heart',
    content: [
      'Practice self-compassion: Treat yourself with the same kindness you would offer a good friend',
      'Develop a growth mindset: View challenges as opportunities to learn',
      'Build strong connections: Nurture relationships with supportive people',
      'Maintain healthy habits: Prioritize sleep, nutrition, and exercise',
      'Set realistic goals: Break large goals into smaller, achievable steps',
      'Practice gratitude: Regularly acknowledge what you appreciate in life',
    ],
  },
  {
    title: 'The RAIN Technique',
    category: 'Mindfulness',
    description: 'A four-step practice for working with difficult emotions',
    icon: 'lightbulb',
    content: [
      'Recognize: Acknowledge what you\'re feeling without judgment',
      'Allow: Let the emotion be present without trying to fix or change it',
      'Investigate: Explore the emotion with curiosity and kindness',
      'Nurture: Offer yourself compassion and understanding',
      'This technique helps create space between you and your emotions, allowing for wiser responses.',
    ],
  },
  {
    title: 'Managing Anxiety Attacks',
    category: 'Coping Skills',
    description: 'Practical steps to navigate moments of intense anxiety',
    icon: 'brain',
    content: [
      'Recognize the signs: Racing heart, sweating, shortness of breath',
      'Remember it will pass: Anxiety attacks are temporary, usually peaking within 10 minutes',
      'Practice grounding: Use the 5-4-3-2-1 technique to stay present',
      'Focus on breathing: Try box breathing (4-4-4-4 count)',
      'Challenge catastrophic thoughts: Ask yourself "What evidence supports this fear?"',
      'Have a safety plan: Know who to call and what helps you feel safe',
    ],
  },
  {
    title: 'Self-Care is Not Selfish',
    category: 'Wellness',
    description: 'Understanding the importance of prioritizing your needs',
    icon: 'heart',
    content: [
      'Self-care is essential for mental health, not a luxury',
      'You cannot pour from an empty cup: Taking care of yourself allows you to better care for others',
      'Set boundaries: It\'s okay to say no to protect your wellbeing',
      'Listen to your body: Rest when tired, eat when hungry, seek help when needed',
      'Schedule self-care: Make it a non-negotiable part of your routine',
      'Small acts matter: Even 5 minutes of intentional self-care can make a difference',
    ],
  },
  {
    title: 'Dealing with Perfectionism',
    category: 'Personal Growth',
    description: 'Breaking free from the perfectionism trap',
    icon: 'lightbulb',
    content: [
      'Recognize that perfectionism often stems from fear of judgment or failure',
      'Progress over perfection: Focus on moving forward rather than being flawless',
      'Challenge "should" thinking: Replace rigid rules with flexible preferences',
      'Celebrate small wins: Acknowledge effort and progress, not just outcomes',
      'Practice self-compassion: Treat mistakes as learning opportunities',
      'Set realistic standards: Ask yourself "What would I expect from a friend in this situation?"',
    ],
  },
];

export function ResourcesPage({ onBack }: ResourcesPageProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'brain':
        return Brain;
      case 'heart':
        return Heart;
      case 'lightbulb':
        return Lightbulb;
      default:
        return BookOpen;
    }
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
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-gray-900">Mental Wellness Resources</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Evidence-based information and techniques to support your mental health journey
          </p>

          <div className="space-y-6">
            {resources.map((resource, index) => {
              const Icon = getIcon(resource.icon);
              return (
                <div
                  key={index}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors"
                >
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-3 rounded-lg">
                        <Icon className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-emerald-700 mb-1">
                          {resource.category}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {resource.title}
                        </h3>
                        <p className="text-gray-700">{resource.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white">
                    <ul className="space-y-3">
                      {resource.content.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-emerald-600 font-bold flex-shrink-0 mt-1">
                            •
                          </span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-2">Professional Support</h3>
            <p className="text-gray-700 text-sm mb-3">
              While these resources are helpful, they are not a substitute for professional mental health care. If you're experiencing severe symptoms or a mental health crisis, please reach out to a qualified mental health professional.
            </p>
            <div className="text-sm text-gray-600">
              <strong>Crisis Resources:</strong>
              <br />
              National Suicide Prevention Lifeline: 988
              <br />
              Crisis Text Line: Text HOME to 741741
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
