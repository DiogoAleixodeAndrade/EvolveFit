import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type Achievement = {
  id: string;
  achievementKey: string;
  title: string;
  description: string;
  unlockedAt: string;
};

export async function fetchAchievements(): Promise<Achievement[]> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((achievement) => ({
    id: achievement.id,
    achievementKey: achievement.achievement_key,
    title: achievement.title,
    description: achievement.description,
    unlockedAt: achievement.unlocked_at,
  }));
}

export async function unlockAchievement(
  achievementKey: string,
  title: string,
  description: string
) {
  const userId = await getCurrentUserId();

  const { data: existing } = await supabase
    .from("user_achievements")
    .select("id")
    .eq("user_id", userId)
    .eq("achievement_key", achievementKey)
    .maybeSingle();

  if (existing) {
    return;
  }

  const { error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_key: achievementKey,
      title,
      description,
    });

  if (error) {
    throw error;
  }
}