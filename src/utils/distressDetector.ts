export interface DistressSignal {
  level: 'low' | 'moderate' | 'high' | 'severe';
  triggers: string[];
  recommendation: string;
  shouldShowSupport: boolean;
}

const highRiskKeywords = [
  'suicide', 'suicidal', 'kill myself', 'end it all', 'want to die',
  'no reason to live', 'better off dead', 'self harm', 'hurt myself',
  'overdose', 'jump off', 'hanging', 'gun', 'pills'
];

const severeDistressKeywords = [
  'hopeless', 'worthless', 'can\'t go on', 'give up', 'nobody cares',
  'want to disappear', 'numb', 'empty inside', 'can\'t take it',
  'everything hurts', 'constant pain', 'no way out'
];

const moderateDistressKeywords = [
  'depressed', 'anxious', 'panic', 'overwhelmed', 'exhausted',
  'can\'t sleep', 'crying', 'scared', 'alone', 'isolated',
  'breaking down', 'falling apart', 'drowning', 'suffocating'
];

const chronicPatternIndicators = [
  'always', 'never', 'every day', 'constantly', 'all the time',
  'again and again', 'keep feeling', 'won\'t stop', 'can\'t escape'
];

export function detectDistressLevel(
  text: string,
  mood: string | null,
  recentEntryCount: number = 0
): DistressSignal {
  const lowerText = text.toLowerCase();
  const triggers: string[] = [];

  const hasHighRisk = highRiskKeywords.some(keyword => {
    if (lowerText.includes(keyword)) {
      triggers.push(`Crisis language: "${keyword}"`);
      return true;
    }
    return false;
  });

  if (hasHighRisk) {
    return {
      level: 'severe',
      triggers,
      recommendation: 'Immediate professional support is strongly recommended. You deserve help right now.',
      shouldShowSupport: true,
    };
  }

  const severeCount = severeDistressKeywords.filter(keyword => {
    if (lowerText.includes(keyword)) {
      triggers.push(`Severe distress indicator: "${keyword}"`);
      return true;
    }
    return false;
  }).length;

  const moderateCount = moderateDistressKeywords.filter(keyword => {
    if (lowerText.includes(keyword)) {
      triggers.push(`Distress indicator: "${keyword}"`);
      return true;
    }
    return false;
  }).length;

  const hasChronicPattern = chronicPatternIndicators.some(keyword =>
    lowerText.includes(keyword)
  );

  const isNegativeMood = ['sad', 'anxious', 'angry', 'depressed', 'overwhelmed', 'hopeless'].includes(mood || '');

  if (severeCount >= 2 || (severeCount >= 1 && isNegativeMood && hasChronicPattern)) {
    return {
      level: 'high',
      triggers,
      recommendation: 'Talking to a professional could help you work through these difficult feelings.',
      shouldShowSupport: true,
    };
  }

  if (moderateCount >= 3 || (moderateCount >= 2 && recentEntryCount >= 5)) {
    return {
      level: 'moderate',
      triggers,
      recommendation: 'You\'ve been going through a lot. Consider reaching out for support.',
      shouldShowSupport: true,
    };
  }

  if (moderateCount >= 1 || (isNegativeMood && text.length > 300)) {
    return {
      level: 'low',
      triggers,
      recommendation: 'Keep expressing your feelings. Support is available if you need it.',
      shouldShowSupport: false,
    };
  }

  return {
    level: 'low',
    triggers: [],
    recommendation: '',
    shouldShowSupport: false,
  };
}

export function shouldShowTherapistRecommendation(
  recentDistressLevels: string[],
  daysSinceLastRecommendation: number
): boolean {
  if (daysSinceLastRecommendation < 7) {
    return false;
  }

  const highOrSevereCount = recentDistressLevels.filter(
    level => level === 'high' || level === 'severe'
  ).length;

  if (highOrSevereCount >= 1) {
    return true;
  }

  const moderateCount = recentDistressLevels.filter(
    level => level === 'moderate'
  ).length;

  if (moderateCount >= 3) {
    return true;
  }

  return false;
}
