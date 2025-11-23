export interface GuidanceVoice {
  id: string;
  name: string;
  description: string;
  icon: string;
  toneAdjustment: (message: string) => string;
}

export const GUIDANCE_VOICES: GuidanceVoice[] = [
  {
    id: 'gentle_therapist',
    name: 'Gentle Therapist',
    description: 'Warm, compassionate, and non-judgmental',
    icon: '🌸',
    toneAdjustment: (message: string) => {
      return message
        .replace(/You should/g, 'You might consider')
        .replace(/You need to/g, 'It could be helpful to')
        .replace(/Try to/g, 'Perhaps you could');
    },
  },
  {
    id: 'practical_coach',
    name: 'Practical Coach',
    description: 'Direct, action-oriented, and motivating',
    icon: '💪',
    toneAdjustment: (message: string) => {
      const prefix = "Let's get practical. ";
      return prefix + message
        .replace(/might/g, 'will')
        .replace(/could/g, 'can')
        .replace(/perhaps/g, 'definitely');
    },
  },
  {
    id: 'wise_elder',
    name: 'Wise Elder',
    description: 'Patient, philosophical, and grounded',
    icon: '🌳',
    toneAdjustment: (message: string) => {
      const prefix = "In my experience, ";
      return prefix + message
        .replace(/right now/g, 'in this moment')
        .replace(/quickly/g, 'in time')
        .replace(/problem/g, 'opportunity for growth');
    },
  },
  {
    id: 'mindful_teacher',
    name: 'Mindful Teacher',
    description: 'Present-focused, curious, and observant',
    icon: '🧘',
    toneAdjustment: (message: string) => {
      const prefix = "Notice what's present. ";
      return prefix + message
        .replace(/feel/g, 'observe')
        .replace(/think/g, 'notice')
        .replace(/should/g, 'might explore');
    },
  },
  {
    id: 'empowering_friend',
    name: 'Empowering Friend',
    description: 'Enthusiastic, supportive, and uplifting',
    icon: '🔥',
    toneAdjustment: (message: string) => {
      const prefix = "You've got this! ";
      return prefix + message
        .replace(/difficult/g, 'challenging but doable')
        .replace(/hard/g, 'tough but you\'re tougher')
        .replace(/struggle/g, 'growth opportunity');
    },
  },
];

export function getGuidanceVoice(voiceId: string): GuidanceVoice {
  return GUIDANCE_VOICES.find((v) => v.id === voiceId) || GUIDANCE_VOICES[0];
}

export function adjustMessageTone(message: string, voiceId: string): string {
  const voice = getGuidanceVoice(voiceId);
  return voice.toneAdjustment(message);
}

export function getVoiceSpecificPrompt(voiceId: string, basePrompt: string): string {
  const voicePrompts: Record<string, string> = {
    gentle_therapist: `${basePrompt} (Respond with warmth and compassion)`,
    practical_coach: `${basePrompt} (Give direct, actionable guidance)`,
    wise_elder: `${basePrompt} (Offer wisdom from experience)`,
    mindful_teacher: `${basePrompt} (Guide with mindful awareness)`,
    empowering_friend: `${basePrompt} (Encourage with energy and enthusiasm)`,
  };

  return voicePrompts[voiceId] || basePrompt;
}
