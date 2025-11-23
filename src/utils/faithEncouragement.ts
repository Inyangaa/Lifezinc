export interface FaithVerse {
  text: string;
  citation: string;
  reflection: string;
}

export interface FaithTradition {
  id: string;
  name: string;
  book: string;
  icon: string;
  verses: {
    anxiety: FaithVerse[];
    sadness: FaithVerse[];
    anger: FaithVerse[];
    guilt: FaithVerse[];
    stress: FaithVerse[];
    gratitude: FaithVerse[];
  };
}

const faithTraditions: FaithTradition[] = [
  {
    id: 'christianity',
    name: 'Christianity',
    book: 'Bible',
    icon: '✝',
    verses: {
      anxiety: [
        {
          text: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.',
          citation: 'John 14:27',
          reflection: 'How might this peace be available to you right now, even in the midst of your current struggle?',
        },
        {
          text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds.',
          citation: 'Philippians 4:6-7',
          reflection: 'What would it feel like to bring this worry to prayer instead of carrying it alone?',
        },
        {
          text: 'Cast all your anxieties on him, because he cares for you.',
          citation: '1 Peter 5:7',
          reflection: 'What specific anxiety could you surrender right now, trusting in divine care?',
        },
      ],
      sadness: [
        {
          text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
          citation: 'Psalm 34:18',
          reflection: 'How does it feel to know that your sadness doesn\'t push God away, but draws Him closer?',
        },
        {
          text: 'He heals the brokenhearted and binds up their wounds.',
          citation: 'Psalm 147:3',
          reflection: 'What wounds in your heart are ready for healing?',
        },
        {
          text: 'Blessed are those who mourn, for they shall be comforted.',
          citation: 'Matthew 5:4',
          reflection: 'Can you trust that comfort is coming, even if you can\'t feel it yet?',
        },
      ],
      anger: [
        {
          text: 'Be angry and do not sin; do not let the sun go down on your anger.',
          citation: 'Ephesians 4:26',
          reflection: 'How can you acknowledge your anger without letting it control your actions?',
        },
        {
          text: 'A soft answer turns away wrath, but a harsh word stirs up anger.',
          citation: 'Proverbs 15:1',
          reflection: 'What gentle response could you offer instead of reacting from anger?',
        },
        {
          text: 'Refrain from anger and turn from wrath; do not fret—it leads only to evil.',
          citation: 'Psalm 37:8',
          reflection: 'What harm might holding onto this anger cause you or others?',
        },
      ],
      guilt: [
        {
          text: 'If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.',
          citation: '1 John 1:9',
          reflection: 'What would it mean to fully receive forgiveness and release self-condemnation?',
        },
        {
          text: 'There is therefore now no condemnation for those who are in Christ Jesus.',
          citation: 'Romans 8:1',
          reflection: 'Can you accept that you are not defined by your mistakes?',
        },
        {
          text: 'As far as the east is from the west, so far does he remove our transgressions from us.',
          citation: 'Psalm 103:12',
          reflection: 'If divine forgiveness is complete, can you forgive yourself?',
        },
      ],
      stress: [
        {
          text: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
          citation: 'Matthew 11:28',
          reflection: 'What burden are you carrying that you could lay down right now?',
        },
        {
          text: 'Cast your burden on the Lord, and he will sustain you; he will never permit the righteous to be moved.',
          citation: 'Psalm 55:22',
          reflection: 'What would it look like to trust that you will be sustained through this?',
        },
        {
          text: 'The Lord is my strength and my shield; in him my heart trusts, and I am helped.',
          citation: 'Psalm 28:7',
          reflection: 'Where have you experienced divine strength in past difficulties?',
        },
      ],
      gratitude: [
        {
          text: 'Give thanks in all circumstances; for this is the will of God in Christ Jesus for you.',
          citation: '1 Thessalonians 5:18',
          reflection: 'Even in difficulty, what small thing can you be grateful for today?',
        },
        {
          text: 'This is the day that the Lord has made; let us rejoice and be glad in it.',
          citation: 'Psalm 118:24',
          reflection: 'How can you embrace this present moment with gratitude?',
        },
        {
          text: 'Oh give thanks to the Lord, for he is good, for his steadfast love endures forever.',
          citation: 'Psalm 107:1',
          reflection: 'What evidence of love and goodness can you see in your life today?',
        },
      ],
    },
  },
  {
    id: 'islam',
    name: 'Islam',
    book: 'Qur\'an',
    icon: '☪',
    verses: {
      anxiety: [
        {
          text: 'Indeed, in the remembrance of Allah do hearts find rest.',
          citation: 'Surah Ar-Ra\'d (13:28)',
          reflection: 'What practice of remembrance could bring peace to your anxious heart right now?',
        },
        {
          text: 'So truly with hardship comes ease. Truly with hardship comes ease.',
          citation: 'Surah Ash-Sharh (94:5-6)',
          reflection: 'How have you experienced ease following past difficulties? What hope does that give you?',
        },
        {
          text: 'And He is with you wherever you are.',
          citation: 'Surah Al-Hadid (57:4)',
          reflection: 'How does knowing you are never alone change your perspective on this challenge?',
        },
      ],
      sadness: [
        {
          text: 'Indeed, with hardship comes ease.',
          citation: 'Surah Ash-Sharh (94:6)',
          reflection: 'Can you trust that this difficult season will pass and ease will come?',
        },
        {
          text: 'Do not lose hope, nor be sad.',
          citation: 'Surah Al-Imran (3:139)',
          reflection: 'What small spark of hope can you hold onto today?',
        },
        {
          text: 'Allah does not burden a soul beyond that it can bear.',
          citation: 'Surah Al-Baqarah (2:286)',
          reflection: 'What inner strength do you have that you may not be recognizing right now?',
        },
      ],
      anger: [
        {
          text: 'Those who spend in prosperity and adversity, who restrain anger, and who pardon others. Allah loves the doers of good.',
          citation: 'Surah Al-Imran (3:134)',
          reflection: 'What would it look like to transform this anger into an act of grace?',
        },
        {
          text: 'Repel evil with that which is better.',
          citation: 'Surah Fussilat (41:34)',
          reflection: 'What positive action could you take instead of acting from anger?',
        },
        {
          text: 'And when they are angry, they forgive.',
          citation: 'Surah Ash-Shura (42:37)',
          reflection: 'Is there a possibility of forgiveness that could free you from this anger?',
        },
      ],
      guilt: [
        {
          text: 'Say: O My servants who have transgressed against themselves! Despair not of the mercy of Allah. Indeed, Allah forgives all sins.',
          citation: 'Surah Az-Zumar (39:53)',
          reflection: 'Can you accept that divine mercy is available to you, regardless of your mistakes?',
        },
        {
          text: 'And He is the Forgiving, the Loving.',
          citation: 'Surah Al-Buruj (85:14)',
          reflection: 'How might experiencing divine forgiveness help you forgive yourself?',
        },
        {
          text: 'Indeed, good deeds do away with misdeeds.',
          citation: 'Surah Hud (11:114)',
          reflection: 'What good can you do today to move forward from past mistakes?',
        },
      ],
      stress: [
        {
          text: 'Allah does not burden a soul beyond that it can bear.',
          citation: 'Surah Al-Baqarah (2:286)',
          reflection: 'What evidence shows you have the strength to handle what you\'re facing?',
        },
        {
          text: 'And whoever relies upon Allah - then He is sufficient for him.',
          citation: 'Surah At-Talaq (65:3)',
          reflection: 'What would change if you truly believed you would be provided for?',
        },
        {
          text: 'Unquestionably, by the remembrance of Allah hearts are assured.',
          citation: 'Surah Ar-Ra\'d (13:28)',
          reflection: 'What spiritual practice could bring you calm amidst this chaos?',
        },
      ],
      gratitude: [
        {
          text: 'If you are grateful, I will surely increase you in favor.',
          citation: 'Surah Ibrahim (14:7)',
          reflection: 'What blessing, however small, can you acknowledge with gratitude today?',
        },
        {
          text: 'And He gave you from all you asked of Him. And if you should count the favor of Allah, you could not enumerate them.',
          citation: 'Surah Ibrahim (14:34)',
          reflection: 'What gifts in your life might you be taking for granted?',
        },
        {
          text: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
          citation: 'Surah Al-Baqarah (2:152)',
          reflection: 'How does practicing gratitude deepen your spiritual connection?',
        },
      ],
    },
  },
  {
    id: 'judaism',
    name: 'Judaism',
    book: 'Torah',
    icon: '✡',
    verses: {
      anxiety: [
        {
          text: 'Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you; he will never leave you nor forsake you.',
          citation: 'Deuteronomy 31:6',
          reflection: 'What strength can you draw from knowing you\'re not facing this alone?',
        },
        {
          text: 'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?',
          citation: 'Psalm 27:1',
          reflection: 'When you remember divine protection, how does your fear change?',
        },
        {
          text: 'When you pass through the waters, I will be with you; and when you pass through the rivers, they will not sweep over you.',
          citation: 'Isaiah 43:2',
          reflection: 'How have you been carried through difficult times before?',
        },
      ],
      sadness: [
        {
          text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.',
          citation: 'Psalm 34:18',
          reflection: 'How does it feel to know your sadness doesn\'t distance you from the Divine?',
        },
        {
          text: 'Weeping may stay for the night, but rejoicing comes in the morning.',
          citation: 'Psalm 30:5',
          reflection: 'Can you trust that this darkness is temporary and light will return?',
        },
        {
          text: 'He heals the brokenhearted and binds up their wounds.',
          citation: 'Psalm 147:3',
          reflection: 'What wounds are you ready to allow healing to touch?',
        },
      ],
      anger: [
        {
          text: 'Do not be quickly provoked in your spirit, for anger resides in the lap of fools.',
          citation: 'Ecclesiastes 7:9',
          reflection: 'What wisdom might you find by pausing before reacting in anger?',
        },
        {
          text: 'The discretion of a man makes him slow to anger, and his glory is to overlook a transgression.',
          citation: 'Proverbs 19:11',
          reflection: 'Is there grace you could extend that would bring you more peace than holding onto anger?',
        },
        {
          text: 'Cease from anger and forsake wrath; do not fret—it only causes harm.',
          citation: 'Psalm 37:8',
          reflection: 'How is this anger affecting your own wellbeing?',
        },
      ],
      guilt: [
        {
          text: 'Have I any pleasure in the death of the wicked, declares the Lord God, and not rather that he should turn from his way and live?',
          citation: 'Ezekiel 18:23',
          reflection: 'Can you accept that transformation and redemption are always possible?',
        },
        {
          text: 'I have swept away your offenses like a cloud, your sins like the morning mist. Return to me, for I have redeemed you.',
          citation: 'Isaiah 44:22',
          reflection: 'What would it mean to accept that your mistakes don\'t define your future?',
        },
        {
          text: 'Let the wicked forsake their ways and the unrighteous their thoughts. Let them turn to the Lord, and he will have mercy on them.',
          citation: 'Isaiah 55:7',
          reflection: 'What new beginning is waiting for you on the other side of self-forgiveness?',
        },
      ],
      stress: [
        {
          text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.',
          citation: 'Psalm 23:1-3',
          reflection: 'What does rest and restoration look like for you right now?',
        },
        {
          text: 'Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.',
          citation: 'Psalm 55:22',
          reflection: 'What burden can you release, trusting you will be sustained?',
        },
        {
          text: 'In peace I will lie down and sleep, for you alone, Lord, make me dwell in safety.',
          citation: 'Psalm 4:8',
          reflection: 'What would it take for you to experience that kind of peace today?',
        },
      ],
      gratitude: [
        {
          text: 'Give thanks to the Lord, for he is good; his love endures forever.',
          citation: 'Psalm 107:1',
          reflection: 'What evidence of goodness and love can you see in your life today?',
        },
        {
          text: 'This is the day the Lord has made; let us rejoice and be glad in it.',
          citation: 'Psalm 118:24',
          reflection: 'How can you embrace this present moment with thankfulness?',
        },
        {
          text: 'I will give thanks to you, Lord, with all my heart; I will tell of all your wonderful deeds.',
          citation: 'Psalm 9:1',
          reflection: 'What wonderful moments or provisions can you acknowledge today?',
        },
      ],
    },
  },
  {
    id: 'hinduism',
    name: 'Hinduism',
    book: 'Bhagavad Gita',
    icon: '🕉',
    verses: {
      anxiety: [
        {
          text: 'You have the right to work, but never to the fruit of work. You should never engage in action for the sake of reward, nor should you long for inaction.',
          citation: 'Bhagavad Gita 2:47',
          reflection: 'What would change if you focused on your effort rather than controlling outcomes?',
        },
        {
          text: 'When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.',
          citation: 'Bhagavad Gita 6:19',
          reflection: 'What practice could help you find stillness amidst the chaos?',
        },
        {
          text: 'One who sees inaction in action, and action in inaction, is intelligent among men.',
          citation: 'Bhagavad Gita 4:18',
          reflection: 'How might surrendering control actually give you more peace?',
        },
      ],
      sadness: [
        {
          text: 'For that which is born, death is certain, and for the dead, birth is certain. Therefore grieve not over that which is unavoidable.',
          citation: 'Bhagavad Gita 2:27',
          reflection: 'What acceptance might bring you peace in this moment of grief?',
        },
        {
          text: 'A person is said to have achieved yoga, the union with the Self, when the perfectly disciplined mind gets freedom from all desires.',
          citation: 'Bhagavad Gita 6:18',
          reflection: 'What attachment is causing your suffering? What would releasing it feel like?',
        },
        {
          text: 'The soul is neither born, nor does it ever die; nor having once existed, does it ever cease to be. The soul is without birth, eternal, immortal, and ageless.',
          citation: 'Bhagavad Gita 2:20',
          reflection: 'How does remembering your eternal nature shift your perspective on this temporary pain?',
        },
      ],
      anger: [
        {
          text: 'From anger, delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost, one falls down again into the material pool.',
          citation: 'Bhagavad Gita 2:63',
          reflection: 'How is anger clouding your judgment and keeping you stuck?',
        },
        {
          text: 'One who is not disturbed in mind even amidst the threefold miseries or elated when there is happiness, and who is free from attachment, fear, and anger, is called a sage of steady mind.',
          citation: 'Bhagavad Gita 2:56',
          reflection: 'What would inner steadiness feel like, even in the face of this provocation?',
        },
        {
          text: 'Treating pleasure and pain, gain and loss, victory and defeat alike, engage in your duty. By doing so, you will not incur sin.',
          citation: 'Bhagavad Gita 2:38',
          reflection: 'How can you meet this situation with equanimity rather than reactive anger?',
        },
      ],
      guilt: [
        {
          text: 'Abandon all varieties of dharmas and simply surrender unto me alone. I shall liberate you from all sinful reactions; do not fear.',
          citation: 'Bhagavad Gita 18:66',
          reflection: 'What would complete surrender and release of guilt feel like for you?',
        },
        {
          text: 'Even if you are considered to be the most sinful of all sinners, when you are situated in the boat of transcendental knowledge you will be able to cross over the ocean of miseries.',
          citation: 'Bhagavad Gita 4:36',
          reflection: 'Can you trust that transformation is possible regardless of past mistakes?',
        },
        {
          text: 'Set thy heart upon thy work, but never on its reward.',
          citation: 'Bhagavad Gita 2:47',
          reflection: 'How can you move forward with right action, releasing attachment to past wrongs?',
        },
      ],
      stress: [
        {
          text: 'You have the right to work, but never to the fruit of work. Let not the fruits of action be your motive.',
          citation: 'Bhagavad Gita 2:47',
          reflection: 'What pressure would lift if you released attachment to specific outcomes?',
        },
        {
          text: 'Perform your obligatory duty, because action is indeed better than inaction.',
          citation: 'Bhagavad Gita 3:8',
          reflection: 'What is the next small, right action you can take without overthinking?',
        },
        {
          text: 'A person who is not disturbed by the incessant flow of desires—that enter like rivers into the ocean which is ever being filled but is always still—can alone achieve peace.',
          citation: 'Bhagavad Gita 2:70',
          reflection: 'How can you remain still and peaceful even as demands flow around you?',
        },
      ],
      gratitude: [
        {
          text: 'Whatever you do, whatever you eat, whatever you offer, whatever you give away, and whatever austerities you perform—do that as an offering to Me.',
          citation: 'Bhagavad Gita 9:27',
          reflection: 'How can you transform ordinary actions into sacred offerings of gratitude?',
        },
        {
          text: 'Content with whatever comes to him without effort, free from the pairs of opposites and envy, balanced in success and failure, he is not bound.',
          citation: 'Bhagavad Gita 4:22',
          reflection: 'What contentment might you find in accepting what is, rather than striving for what could be?',
        },
        {
          text: 'The yogis, abandoning attachment, act with body, mind, intelligence, and senses, for the sake of purification.',
          citation: 'Bhagavad Gita 5:11',
          reflection: 'What gift can you offer today from a place of pure gratitude rather than obligation?',
        },
      ],
    },
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    book: 'Sutras',
    icon: '☸',
    verses: {
      anxiety: [
        {
          text: 'Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.',
          citation: 'Buddha',
          reflection: 'What is actually happening right now in this present moment? Can you find peace here?',
        },
        {
          text: 'Nothing can harm you as much as your own thoughts unguarded.',
          citation: 'Buddha',
          reflection: 'What anxious thoughts are you giving power to? How can you observe them without believing them?',
        },
        {
          text: 'In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you.',
          citation: 'Buddha',
          reflection: 'What are you trying to control that might not be yours to hold?',
        },
      ],
      sadness: [
        {
          text: 'Pain is inevitable, suffering is optional.',
          citation: 'Buddha',
          reflection: 'While you can\'t control the pain, how might you reduce your suffering by changing your relationship to it?',
        },
        {
          text: 'Even death is not to be feared by one who has lived wisely.',
          citation: 'Buddha',
          reflection: 'What wisdom about impermanence might bring you peace in this difficult moment?',
        },
        {
          text: 'Every morning we are born again. What we do today is what matters most.',
          citation: 'Buddha',
          reflection: 'How can you honor this sadness while also embracing the fresh start of this moment?',
        },
      ],
      anger: [
        {
          text: 'Holding onto anger is like drinking poison and expecting the other person to die.',
          citation: 'Buddha',
          reflection: 'How is holding this anger affecting your own peace? What would releasing it feel like?',
        },
        {
          text: 'You will not be punished for your anger; you will be punished by your anger.',
          citation: 'Buddha',
          reflection: 'What harm is this anger causing you? How is it imprisoning you?',
        },
        {
          text: 'Conquer anger with non-anger. Conquer badness with goodness. Conquer meanness with generosity. Conquer dishonesty with truth.',
          citation: 'Dhammapada',
          reflection: 'What opposite quality could you embody that would transform this anger?',
        },
      ],
      guilt: [
        {
          text: 'If you truly loved yourself, you could never hurt another.',
          citation: 'Buddha',
          reflection: 'Can you see that your guilt shows your capacity for compassion? How can you extend that compassion to yourself?',
        },
        {
          text: 'Every experience, no matter how bad it seems, holds within it a blessing of some kind. The goal is to find it.',
          citation: 'Buddha',
          reflection: 'What have you learned from this mistake that could serve your growth?',
        },
        {
          text: 'Do not look back and grieve over the past, for it is gone; and do not be troubled about the future, for it has not yet come. Live in the present, and make it so beautiful that it will be worth remembering.',
          citation: 'Buddha',
          reflection: 'How can you create beauty in this present moment instead of dwelling in past guilt?',
        },
      ],
      stress: [
        {
          text: 'The root of suffering is attachment.',
          citation: 'Buddha',
          reflection: 'What outcome or expectation are you clinging to? What would loosening that grip feel like?',
        },
        {
          text: 'Peace comes from within. Do not seek it without.',
          citation: 'Buddha',
          reflection: 'What external thing are you waiting for to feel peace? How can you find it within yourself right now?',
        },
        {
          text: 'If you are quiet enough, you will hear the flow of the universe. You will feel its rhythm. Go with this flow. Happiness lies ahead.',
          citation: 'Buddha',
          reflection: 'What would it feel like to stop resisting and flow with what is?',
        },
      ],
      gratitude: [
        {
          text: 'Let us rise up and be thankful, for if we didn\'t learn a lot today, at least we learned a little, and if we didn\'t learn a little, at least we didn\'t get sick, and if we got sick, at least we didn\'t die; so, let us all be thankful.',
          citation: 'Buddha',
          reflection: 'What small thing, easily overlooked, can you be grateful for today?',
        },
        {
          text: 'Thousands of candles can be lighted from a single candle, and the life of the candle will not be shortened. Happiness never decreases by being shared.',
          citation: 'Buddha',
          reflection: 'How can you share your gratitude with others today?',
        },
        {
          text: 'The way is not in the sky. The way is in the heart.',
          citation: 'Buddha',
          reflection: 'How does gratitude open your heart and show you the path forward?',
        },
      ],
    },
  },
];

export function getFaithTraditions(): FaithTradition[] {
  return faithTraditions;
}

export function getFaithVerse(
  faithTraditionId: string,
  emotionCategory: 'anxiety' | 'sadness' | 'anger' | 'guilt' | 'stress' | 'gratitude'
): FaithVerse | null {
  const tradition = faithTraditions.find((t) => t.id === faithTraditionId);
  if (!tradition) return null;

  const verses = tradition.verses[emotionCategory];
  if (!verses || verses.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
}

export function categorizeEmotion(mood: string): 'anxiety' | 'sadness' | 'anger' | 'guilt' | 'stress' | 'gratitude' {
  const lowerMood = mood.toLowerCase();

  const anxietyTerms = ['anxious', 'worried', 'nervous', 'panic', 'fear', 'scared', 'afraid'];
  const sadnessTerms = ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'hurt', 'heartbroken'];
  const angerTerms = ['angry', 'frustrated', 'annoyed', 'furious', 'mad', 'irritated', 'rage'];
  const guiltTerms = ['guilty', 'ashamed', 'embarrassed', 'regret', 'remorse'];
  const stressTerms = ['stressed', 'overwhelmed', 'pressured', 'exhausted', 'tired', 'drained'];
  const gratitudeTerms = ['grateful', 'thankful', 'happy', 'joyful', 'peaceful', 'content', 'blessed'];

  if (anxietyTerms.some((term) => lowerMood.includes(term))) return 'anxiety';
  if (sadnessTerms.some((term) => lowerMood.includes(term))) return 'sadness';
  if (angerTerms.some((term) => lowerMood.includes(term))) return 'anger';
  if (guiltTerms.some((term) => lowerMood.includes(term))) return 'guilt';
  if (gratitudeTerms.some((term) => lowerMood.includes(term))) return 'gratitude';
  if (stressTerms.some((term) => lowerMood.includes(term))) return 'stress';

  return 'stress';
}
