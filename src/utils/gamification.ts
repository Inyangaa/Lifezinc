import { supabase } from '../lib/supabase';

export interface SkillBadge {
  id: string;
  name: string;
  description: string;
  earnedAt: string;
  icon: string;
}

export interface UserGameStats {
  gems: number;
  level: number;
  xp: number;
  skillBadges: SkillBadge[];
}

const SKILL_BADGES = {
  self_compassion_beginner: {
    name: 'Self-Compassion Beginner',
    description: 'Completed first self-love journal entry',
    icon: '💚',
    requirement: 'first_self_love_entry',
  },
  self_compassion_warrior: {
    name: 'Self-Compassion Warrior',
    description: 'Completed 7-day self-love challenge',
    icon: '💪',
    requirement: 'complete_self_love_challenge',
  },
  resilience_builder: {
    name: 'Resilience Builder',
    description: 'Maintained a 7-day journaling streak',
    icon: '🛡️',
    requirement: '7_day_streak',
  },
  emotional_explorer: {
    name: 'Emotional Explorer',
    description: 'Logged 10 different emotions',
    icon: '🧭',
    requirement: '10_emotions',
  },
  transformation_master: {
    name: 'Transformation Master',
    description: 'Completed 10 emotional transformations',
    icon: '✨',
    requirement: '10_transformations',
  },
  assertiveness_champion: {
    name: 'Assertiveness Champion',
    description: 'Practiced boundary-setting in 5 entries',
    icon: '🎯',
    requirement: '5_boundary_entries',
  },
  mindfulness_practitioner: {
    name: 'Mindfulness Practitioner',
    description: 'Used meditation timer 10 times',
    icon: '🧘',
    requirement: '10_meditations',
  },
  community_supporter: {
    name: 'Community Supporter',
    description: 'Gave 20 hearts in community',
    icon: '❤️',
    requirement: '20_community_hearts',
  },
};

const XP_REWARDS = {
  journal_entry: 10,
  transformation_complete: 25,
  challenge_day: 15,
  streak_maintained: 5,
  meditation_session: 10,
  community_share: 15,
  community_support: 3,
};

const GEM_REWARDS = {
  journal_entry: 5,
  transformation_complete: 15,
  challenge_day: 10,
  streak_milestone: 25,
  meditation_session: 8,
  skill_badge_earned: 50,
};

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function xpForNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp);
  return currentLevel * 100 - currentXp;
}

export async function getUserGameStats(userId: string): Promise<UserGameStats | null> {
  const { data, error } = await supabase
    .from('user_gamification')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching game stats:', error);
    return null;
  }

  if (!data) {
    const { data: newData, error: insertError } = await supabase
      .from('user_gamification')
      .insert({ user_id: userId, gems: 0, level: 1, xp: 0, skill_badges: [] })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating game stats:', insertError);
      return null;
    }

    return {
      gems: newData.gems,
      level: newData.level,
      xp: newData.xp,
      skillBadges: newData.skill_badges || [],
    };
  }

  return {
    gems: data.gems,
    level: data.level,
    xp: data.xp,
    skillBadges: data.skill_badges || [],
  };
}

export async function awardGems(userId: string, activityType: keyof typeof GEM_REWARDS): Promise<void> {
  const gems = GEM_REWARDS[activityType] || 0;
  if (gems === 0) return;

  const { data: current } = await supabase
    .from('user_gamification')
    .select('gems')
    .eq('user_id', userId)
    .single();

  if (current) {
    await supabase
      .from('user_gamification')
      .update({
        gems: current.gems + gems,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: activityType,
      gems_earned: gems,
      xp_earned: 0,
    });
  }
}

export async function awardXP(userId: string, activityType: keyof typeof XP_REWARDS): Promise<void> {
  const xp = XP_REWARDS[activityType] || 0;
  if (xp === 0) return;

  const { data: current } = await supabase
    .from('user_gamification')
    .select('xp, level')
    .eq('user_id', userId)
    .single();

  if (current) {
    const newXP = current.xp + xp;
    const newLevel = calculateLevel(newXP);

    await supabase
      .from('user_gamification')
      .update({
        xp: newXP,
        level: newLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: activityType,
      gems_earned: 0,
      xp_earned: xp,
    });
  }
}

export async function awardRewards(userId: string, activityType: string): Promise<void> {
  if (activityType in GEM_REWARDS) {
    await awardGems(userId, activityType as keyof typeof GEM_REWARDS);
  }
  if (activityType in XP_REWARDS) {
    await awardXP(userId, activityType as keyof typeof XP_REWARDS);
  }
}

export async function checkAndAwardSkillBadge(
  userId: string,
  badgeId: keyof typeof SKILL_BADGES
): Promise<boolean> {
  const { data: current } = await supabase
    .from('user_gamification')
    .select('skill_badges')
    .eq('user_id', userId)
    .single();

  if (!current) return false;

  const badges = current.skill_badges || [];
  const alreadyHas = badges.some((b: any) => b.id === badgeId);

  if (alreadyHas) return false;

  const badgeInfo = SKILL_BADGES[badgeId];
  const newBadge = {
    id: badgeId,
    name: badgeInfo.name,
    description: badgeInfo.description,
    icon: badgeInfo.icon,
    earnedAt: new Date().toISOString(),
  };

  await supabase
    .from('user_gamification')
    .update({
      skill_badges: [...badges, newBadge],
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  await awardGems(userId, 'skill_badge_earned');

  return true;
}
