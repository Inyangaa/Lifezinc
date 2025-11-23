export const reframeMessages = [
  "Every emotion is a teacher. What is this feeling trying to show you?",
  "You're experiencing this because you care deeply. That's a strength.",
  "Feelings are temporary visitors. This moment will pass, and you'll carry forward the wisdom.",
  "By acknowledging this emotion, you're already practicing courage and self-awareness.",
  "Your feelings are valid. They're part of your unique human experience.",
  "This emotion is information, not your identity. You are bigger than this moment.",
  "You've felt difficult things before and grown from them. You will again.",
  "Expressing your emotions is an act of self-care and healing.",
  "Every feeling you process makes space for more joy and peace.",
  "You're transforming pain into understanding. That's powerful growth.",
  "This emotion shows you're alive, present, and deeply feeling. That's beautiful.",
  "By naming your feelings, you're taking the first step toward freedom.",
  "Your emotional honesty is a gift you give yourself.",
  "Difficult emotions often precede meaningful breakthroughs.",
  "You're not stuck in this feeling. You're moving through it with intention."
];

export function getRandomReframe(): string {
  return reframeMessages[Math.floor(Math.random() * reframeMessages.length)];
}
