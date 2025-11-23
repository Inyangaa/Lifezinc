interface TransformationStep {
  step: number;
  title: string;
  content: string;
  actionPrompt?: string;
}

interface EmotionalTransformation {
  beliefIdentification: TransformationStep;
  validation: TransformationStep;
  reframe: TransformationStep;
  actionGoal: TransformationStep;
}

const anxietyTransformations = {
  triggers: ['anxious', 'worried', 'nervous', 'panic', 'overwhelmed', 'scared', 'fear'],
  beliefPatterns: [
    "Something terrible is going to happen",
    "I can't handle this situation",
    "I'm going to lose control",
    "Everyone will judge me",
  ],
  validations: [
    "Your anxiety is real and valid. Your mind is trying to protect you from perceived danger.",
    "It makes sense that you feel worried - uncertainty can be deeply uncomfortable.",
    "These feelings don't make you weak. They show you care about the outcome.",
  ],
  reframes: [
    "Anxiety is information, not a prediction. My thoughts are not facts.",
    "I've felt this way before and gotten through it. I have the strength to handle uncertainty.",
    "This discomfort is temporary. I can take one small step at a time.",
  ],
  actions: [
    "Take 5 deep breaths and name 3 things you can see right now",
    "Write down your worst fear, then list 3 more realistic outcomes",
    "Text someone you trust: 'I'm feeling anxious but I'm working through it'",
  ],
};

const sadnessTransformations = {
  triggers: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'hurt'],
  beliefPatterns: [
    "I'll always feel this way",
    "Nothing will ever get better",
    "I'm not enough",
    "Nobody really cares about me",
  ],
  validations: [
    "Your sadness matters. It's okay to not be okay right now.",
    "Feeling this way doesn't mean you're broken - it means you're human.",
    "Your pain is valid, even if others don't understand it.",
  ],
  reframes: [
    "This feeling is temporary, even though it feels permanent right now.",
    "Sadness is a signal that something matters to me. That's not weakness - that's depth.",
    "I can hold space for this pain while also believing in better days ahead.",
  ],
  actions: [
    "Do one tiny thing that usually brings you joy - even for just 5 minutes",
    "Reach out to one person who makes you feel seen",
    "Write yourself a compassionate letter as if you were your own best friend",
  ],
};

const angerTransformations = {
  triggers: ['angry', 'frustrated', 'annoyed', 'furious', 'mad', 'irritated'],
  beliefPatterns: [
    "This shouldn't be happening",
    "They don't respect me",
    "I can't let this go unpunished",
    "I'm being treated unfairly",
  ],
  validations: [
    "Your anger is valid. It often signals that a boundary has been crossed.",
    "Feeling angry doesn't make you a bad person - it shows you have limits.",
    "Your frustration makes sense given what you're experiencing.",
  ],
  reframes: [
    "My anger is information about what I value and where I need boundaries.",
    "I can be firm without being destructive. Clarity is stronger than rage.",
    "What boundary do I need to set? How can I communicate my needs clearly?",
  ],
  actions: [
    "Take a 10-minute walk to cool down before responding",
    "Write an angry letter you'll never send - get it all out first",
    "Identify the specific boundary that was crossed and how to communicate it",
  ],
};

const guiltTransformations = {
  triggers: ['guilty', 'ashamed', 'embarrassed', 'regret'],
  beliefPatterns: [
    "I'm a bad person for feeling/doing this",
    "I should have known better",
    "I don't deserve forgiveness",
    "Everyone thinks less of me now",
  ],
  validations: [
    "Guilt shows you have a conscience and values. That's actually a good sign.",
    "Making mistakes is part of being human, not proof that you're broken.",
    "Your remorse shows growth - you're not the same person who made that choice.",
  ],
  reframes: [
    "I can learn from this without defining myself by it.",
    "Self-forgiveness is not excusing - it's allowing growth.",
    "What would I tell a friend in this situation? Can I offer myself that same compassion?",
  ],
  actions: [
    "Write down what you learned from this experience",
    "Make amends if possible, then release what you can't change",
    "Do one act of kindness for yourself as a step toward self-forgiveness",
  ],
};

const generalTransformations = {
  triggers: ['confused', 'lost', 'uncertain', 'overwhelmed', 'stressed', 'tired'],
  beliefPatterns: [
    "I should have it all figured out",
    "Everyone else seems to know what they're doing",
    "I'm failing at life",
  ],
  validations: [
    "It's okay not to have all the answers right now.",
    "Confusion is often a sign of growth - you're expanding beyond what you knew.",
    "You're doing better than you think. Progress isn't always visible.",
  ],
  reframes: [
    "Not knowing is uncomfortable, but it's also where growth happens.",
    "I can handle uncertainty one moment at a time.",
    "What's one small thing I do know? I can start there.",
  ],
  actions: [
    "Focus on just the next 24 hours - what's one small step you can take?",
    "List 3 things you've handled successfully in the past week",
    "Give yourself permission to rest without guilt",
  ],
};

export function generateEmotionalTransformation(
  mood: string,
  journalText: string
): EmotionalTransformation {
  let transformationSet = generalTransformations;

  if (anxietyTransformations.triggers.includes(mood.toLowerCase())) {
    transformationSet = anxietyTransformations;
  } else if (sadnessTransformations.triggers.includes(mood.toLowerCase())) {
    transformationSet = sadnessTransformations;
  } else if (angerTransformations.triggers.includes(mood.toLowerCase())) {
    transformationSet = angerTransformations;
  } else if (guiltTransformations.triggers.includes(mood.toLowerCase())) {
    transformationSet = guiltTransformations;
  }

  const randomBelief = transformationSet.beliefPatterns[
    Math.floor(Math.random() * transformationSet.beliefPatterns.length)
  ];
  const randomValidation = transformationSet.validations[
    Math.floor(Math.random() * transformationSet.validations.length)
  ];
  const randomReframe = transformationSet.reframes[
    Math.floor(Math.random() * transformationSet.reframes.length)
  ];
  const randomAction = transformationSet.actions[
    Math.floor(Math.random() * transformationSet.actions.length)
  ];

  return {
    beliefIdentification: {
      step: 1,
      title: 'Identify the Belief',
      content: `The thought pattern beneath this feeling might be: "${randomBelief}"`,
      actionPrompt: 'Does this resonate with what you\'re experiencing?',
    },
    validation: {
      step: 2,
      title: 'Validate Your Experience',
      content: randomValidation,
      actionPrompt: 'Your feelings are real and they matter.',
    },
    reframe: {
      step: 3,
      title: 'Rewrite Your Story',
      content: randomReframe,
      actionPrompt: 'This is a perspective that honors both your pain and your strength.',
    },
    actionGoal: {
      step: 4,
      title: 'Take Micro-Action',
      content: randomAction,
      actionPrompt: 'One small step toward healing.',
    },
  };
}
