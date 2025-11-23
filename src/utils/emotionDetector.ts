const emotionKeywords: Record<string, string[]> = {
  happy: ['happy', 'joy', 'joyful', 'excited', 'great', 'wonderful', 'amazing', 'fantastic', 'good', 'glad', 'pleased', 'delighted', 'cheerful'],
  sad: ['sad', 'down', 'depressed', 'unhappy', 'miserable', 'gloomy', 'melancholy', 'blue', 'heartbroken', 'crying'],
  anxious: ['anxious', 'nervous', 'worried', 'tense', 'uneasy', 'panic', 'fear', 'scared', 'terrified', 'afraid'],
  frustrated: ['frustrated', 'irritated', 'annoyed', 'impatient', 'exasperated'],
  tired: ['tired', 'exhausted', 'fatigued', 'weary', 'drained', 'sleepy', 'worn out'],
  confused: ['confused', 'puzzled', 'uncertain', 'bewildered', 'perplexed', 'lost'],
  loved: ['loved', 'cherished', 'adored', 'cared for', 'appreciated', 'valued'],
  angry: ['angry', 'mad', 'furious', 'rage', 'enraged', 'livid', 'outraged', 'irate'],
  hurt: ['hurt', 'wounded', 'pained', 'injured', 'damaged', 'suffering'],
  peaceful: ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed', 'at ease'],
  worried: ['worried', 'concerned', 'troubled', 'distressed', 'bothered', 'apprehensive'],
  vulnerable: ['vulnerable', 'exposed', 'weak', 'defenseless', 'fragile', 'sensitive'],
  disappointed: ['disappointed', 'let down', 'discouraged', 'disheartened', 'dismayed'],
  content: ['content', 'satisfied', 'fulfilled', 'comfortable', 'at peace'],
  stressed: ['stressed', 'pressured', 'overwhelmed', 'burdened', 'strained', 'tense'],
  grateful: ['grateful', 'thankful', 'appreciative', 'blessed', 'fortunate'],
  overwhelmed: ['overwhelmed', 'swamped', 'buried', 'inundated', 'overloaded'],
  numb: ['numb', 'empty', 'hollow', 'disconnected', 'detached', 'emotionless'],
  hopeful: ['hopeful', 'optimistic', 'positive', 'encouraged', 'confident'],
  guilty: ['guilty', 'ashamed', 'remorseful', 'regretful', 'sorry'],
  embarrassed: ['embarrassed', 'ashamed', 'humiliated', 'mortified', 'self-conscious'],
  skeptical: ['skeptical', 'doubtful', 'suspicious', 'questioning', 'uncertain'],
  relieved: ['relieved', 'unburdened', 'freed', 'lightened'],
  uncertain: ['uncertain', 'unsure', 'hesitant', 'ambivalent', 'doubtful'],
};

export function detectEmotion(text: string): string | null {
  const lowerText = text.toLowerCase();

  const emotionScores: Record<string, number> = {};

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > 0) {
      emotionScores[emotion] = score;
    }
  }

  if (Object.keys(emotionScores).length === 0) {
    return null;
  }

  const sortedEmotions = Object.entries(emotionScores).sort((a, b) => b[1] - a[1]);
  return sortedEmotions[0][0];
}
