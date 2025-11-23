export interface EmotionalAlignment {
  theme: string;
  description: string;
  score: number;
  color: string;
  icon: string;
}

const POSITIVE_THEMES = {
  hope: {
    keywords: ['hopeful', 'optimistic', 'better', 'future', 'improve', 'hope'],
    description: 'Looking forward with optimism',
    icon: '🌅',
    color: 'orange',
  },
  trust: {
    keywords: ['trust', 'believe', 'faith', 'confident', 'sure', 'certain'],
    description: 'Building confidence in yourself and others',
    icon: '🤝',
    color: 'blue',
  },
  gratitude: {
    keywords: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'gratitude'],
    description: 'Recognizing the good in your life',
    icon: '🙏',
    color: 'green',
  },
  forgiveness: {
    keywords: ['forgive', 'let go', 'release', 'acceptance', 'peace', 'move on'],
    description: 'Releasing resentment and finding peace',
    icon: '🕊️',
    color: 'teal',
  },
  courage: {
    keywords: ['brave', 'courage', 'face', 'overcome', 'strong', 'resilient'],
    description: 'Facing challenges with strength',
    icon: '💪',
    color: 'red',
  },
  compassion: {
    keywords: ['compassion', 'kindness', 'gentle', 'care', 'nurture', 'love'],
    description: 'Treating yourself and others with care',
    icon: '💝',
    color: 'pink',
  },
  growth: {
    keywords: ['learn', 'grow', 'develop', 'progress', 'evolve', 'better'],
    description: 'Embracing personal development',
    icon: '🌱',
    color: 'emerald',
  },
  joy: {
    keywords: ['joy', 'happy', 'delight', 'celebrate', 'excited', 'wonderful'],
    description: 'Finding moments of happiness',
    icon: '✨',
    color: 'yellow',
  },
};

export function analyzeEmotionalAlignment(entries: any[]): EmotionalAlignment[] {
  const alignments: EmotionalAlignment[] = [];

  for (const [theme, data] of Object.entries(POSITIVE_THEMES)) {
    let count = 0;

    entries.forEach((entry) => {
      const text = (
        entry.text_entry +
        ' ' +
        (entry.initial_reframe || '') +
        ' ' +
        (entry.reframed_perspective || '')
      ).toLowerCase();

      data.keywords.forEach((keyword) => {
        if (text.includes(keyword)) {
          count++;
        }
      });
    });

    const score = Math.min(100, Math.round((count / Math.max(entries.length, 1)) * 100));

    if (score > 0) {
      alignments.push({
        theme: theme.charAt(0).toUpperCase() + theme.slice(1),
        description: data.description,
        score,
        color: data.color,
        icon: data.icon,
      });
    }
  }

  return alignments.sort((a, b) => b.score - a.score);
}

export function getAlignmentColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-100 border-orange-300 text-orange-800',
    blue: 'bg-blue-100 border-blue-300 text-blue-800',
    green: 'bg-green-100 border-green-300 text-green-800',
    teal: 'bg-teal-100 border-teal-300 text-teal-800',
    red: 'bg-red-100 border-red-300 text-red-800',
    pink: 'bg-pink-100 border-pink-300 text-pink-800',
    emerald: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    yellow: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  };

  return colorMap[color] || 'bg-gray-100 border-gray-300 text-gray-800';
}

export function getAlignmentBarColor(color: string): string {
  const colorMap: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    teal: 'bg-teal-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    emerald: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
  };

  return colorMap[color] || 'bg-gray-500';
}
