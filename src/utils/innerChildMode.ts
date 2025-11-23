export interface InnerChildPrompt {
  intro: string;
  placeholder: string;
  promptQuestion: string;
}

export const innerChildPrompts: InnerChildPrompt[] = [
  {
    intro: "Let's connect with your younger self",
    placeholder: "Dear younger me, I want you to know...",
    promptQuestion: "What does your younger self need to hear right now?",
  },
  {
    intro: "Your inner child is listening",
    placeholder: "I wish I could tell my younger self...",
    promptQuestion: "What comfort would you offer the child you once were?",
  },
  {
    intro: "Speak tenderly to who you were",
    placeholder: "If I could go back, I would say...",
    promptQuestion: "What wisdom would you share with your past self?",
  },
  {
    intro: "Embrace the child within",
    placeholder: "Dear little one, I see you and...",
    promptQuestion: "How can you nurture the part of you that still feels young and vulnerable?",
  },
];

export function getRandomInnerChildPrompt(): InnerChildPrompt {
  return innerChildPrompts[Math.floor(Math.random() * innerChildPrompts.length)];
}

export function generateInnerChildResponse(
  userMessage: string,
  mood: string
): string {
  const lowerMood = mood.toLowerCase();

  const responses: Record<string, string[]> = {
    anxious: [
      "Your younger self hears you, and wants you to know: you are safe now. The fears you carried then don't have to define you today. You've grown stronger than you ever imagined possible.",
      "Little you is so proud of how far you've come. Those worries you had? You faced them. You're here, breathing, growing. That takes courage.",
      "Your inner child feels your care. You're learning to protect yourself in ways no one else could. That's beautiful growth.",
    ],
    sad: [
      "Your younger self feels your tears, and wraps their small arms around you. You deserved more gentleness then, and you deserve it now. Let yourself grieve what was lost.",
      "Little you wants you to know: it's okay to feel sad. You're not broken. You're processing pain that was too big to hold alone. But you're not alone anymore.",
      "The child within you never blamed you. They just needed someone to see their hurt. You're seeing it now. That's healing.",
    ],
    angry: [
      "Your younger self finally has a voice through you. That anger? It's protecting the hurt that little one couldn't express. You're allowed to feel this.",
      "Little you needed someone to defend them. Now you're learning to stand up for yourself. That anger is power waiting to be transformed into boundaries.",
      "Your inner child is grateful you're finally listening to the 'no' they couldn't say back then. This anger is valid. Use it wisely.",
    ],
    hurt: [
      "Your younger self is holding your hand right now. They understand this pain because they felt it first. But together, you're learning to heal wounds that once felt permanent.",
      "Little you wants you to know: the hurt you feel is proof you had a tender heart worth protecting. You still do. You're learning to protect it now.",
      "Your inner child sees your pain and whispers: 'We survived then. We'll heal now. We're not alone anymore.'",
    ],
    stressed: [
      "Your younger self remembers feeling overwhelmed by expectations. They want you to know: you don't have to carry everything alone. It's okay to rest.",
      "Little you is reminding you that they just wanted to play, to breathe, to be enough. You're still enough, even when you're not productive.",
      "Your inner child is tugging your sleeve, asking you to slow down. They know something you forgot: joy matters more than achievement.",
    ],
    lonely: [
      "Your younger self knows this feeling. They spent time feeling invisible too. But you see them now. And in seeing them, you're learning to be the companion you always needed.",
      "Little you wants you to know: you were never too much or not enough. You were just looking for someone who understood. You're becoming that person.",
      "Your inner child is here with you. You're not alone. You carry within you the purest form of love—self-compassion awakening.",
    ],
    grateful: [
      "Your younger self is beaming with pride. Look how far you've come! Look at the love you're learning to give yourself. They always believed in you.",
      "Little you is dancing inside your heart. They feel your joy, your growth, your healing. This is what they always hoped for—you being free.",
      "Your inner child wants to celebrate with you! Every moment of growth is a gift to the little one who once felt stuck. You're giving them a future.",
    ],
  };

  const moodResponses = responses[lowerMood] || responses.sad;
  return moodResponses[Math.floor(Math.random() * moodResponses.length)];
}

export function generateInnerChildAffirmations(mood: string): string[] {
  const affirmations: Record<string, string[]> = {
    anxious: [
      "Little you is safe with big you now",
      "You are the protector your younger self needed",
      "Your fears from then don't control you now",
    ],
    sad: [
      "Your tears are healing the wounds of yesterday",
      "Little you's sadness is finally being held",
      "You're giving yourself the comfort you always deserved",
    ],
    angry: [
      "Your anger protects the child within",
      "You're learning to set boundaries little you couldn't",
      "This fire is transforming into healthy strength",
    ],
    hurt: [
      "You're tending to wounds little you couldn't heal alone",
      "Your compassion is mending old pain",
      "Every act of self-care heals your inner child",
    ],
    stressed: [
      "You're learning to give little you the rest they needed",
      "It's safe to slow down and breathe",
      "Your worth isn't measured by productivity",
    ],
    lonely: [
      "You're the friend your younger self always wanted",
      "Your inner child is held by your presence",
      "You belong to yourself, and that's enough",
    ],
    grateful: [
      "Little you is so proud of how you've grown",
      "You're living the life your younger self dreamed of",
      "Your healing is honoring the child you were",
    ],
  };

  return affirmations[mood.toLowerCase()] || affirmations.sad;
}

export function generateInnerChildRenewalStep(mood: string): string {
  const renewalSteps: Record<string, string> = {
    anxious: "Do something playful that little you loved—draw, swing, dance freely—for 10 minutes",
    sad: "Write a letter from your current self to your younger self, offering the comfort they needed",
    angry: "Draw or write about what little you needed to say but couldn't. Let it out safely.",
    hurt: "Hold your hand over your heart and tell your inner child: 'I'm here now, and I won't leave you'",
    stressed: "Take a 5-minute break to do something your child self found peaceful—look at clouds, hum a song, play with textures",
    lonely: "Imagine little you sitting beside you. Describe one thing you'd do together if you could",
    grateful: "Thank your younger self for surviving. List 3 things they did right that got you here",
  };

  return renewalSteps[mood.toLowerCase()] || renewalSteps.sad;
}
