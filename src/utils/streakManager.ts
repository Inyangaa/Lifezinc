import { supabase } from '../lib/supabase';

export async function updateUserStreak(userId: string) {
  const today = new Date().toISOString().split('T')[0];

  const { data: existingStreak, error: fetchError } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching streak:', fetchError);
    return;
  }

  if (!existingStreak) {
    const { error: insertError } = await supabase.from('user_streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_entry_date: today,
    });

    if (insertError) {
      console.error('Error creating streak:', insertError);
    }
    return;
  }

  const lastEntryDate = existingStreak.last_entry_date;

  if (lastEntryDate === today) {
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak = 1;
  if (lastEntryDate === yesterdayStr) {
    newStreak = existingStreak.current_streak + 1;
  }

  const longestStreak = Math.max(newStreak, existingStreak.longest_streak);

  const { error: updateError } = await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_entry_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating streak:', updateError);
  }
}

export async function checkAndAwardAchievements(userId: string) {
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('id')
    .eq('user_id', userId);

  const entryCount = entries?.length || 0;

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak, longest_streak')
    .eq('user_id', userId)
    .maybeSingle();

  const achievements = [];

  if (entryCount >= 1) achievements.push('first_entry');
  if (entryCount >= 3) achievements.push('three_entries');
  if (entryCount >= 10) achievements.push('ten_entries');
  if (entryCount >= 50) achievements.push('fifty_entries');
  if (entryCount >= 100) achievements.push('hundred_entries');

  if (streak) {
    if (streak.current_streak >= 3) achievements.push('three_day_streak');
    if (streak.current_streak >= 7) achievements.push('week_streak');
    if (streak.current_streak >= 30) achievements.push('month_streak');
    if (streak.longest_streak >= 7) achievements.push('best_week');
    if (streak.longest_streak >= 30) achievements.push('best_month');
  }

  const { data: existingAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_type')
    .eq('user_id', userId);

  const existingTypes = existingAchievements?.map((a) => a.achievement_type) || [];
  const newAchievements = achievements.filter((a) => !existingTypes.includes(a));

  if (newAchievements.length > 0) {
    const toInsert = newAchievements.map((type) => ({
      user_id: userId,
      achievement_type: type,
    }));

    await supabase.from('user_achievements').insert(toInsert);
  }

  return newAchievements;
}
