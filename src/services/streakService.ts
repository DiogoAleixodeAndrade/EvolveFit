import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type UserStreak = {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().slice(0, 10);
}

export async function fetchStreak(): Promise<UserStreak> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      lastActiveDate: null,
    };
  }

  return {
    currentStreak: data.current_streak,
    bestStreak: data.best_streak,
    lastActiveDate: data.last_active_date,
  };
}

export async function registerDailyActivity(): Promise<UserStreak> {
  const userId = await getCurrentUserId();

  const current = await fetchStreak();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();

  if (current.lastActiveDate === today) {
    return current;
  }

  const newCurrentStreak =
    current.lastActiveDate === yesterday
      ? current.currentStreak + 1
      : 1;

  const newBestStreak = Math.max(current.bestStreak, newCurrentStreak);

  const { error } = await supabase.from("user_streaks").upsert({
    user_id: userId,
    current_streak: newCurrentStreak,
    best_streak: newBestStreak,
    last_active_date: today,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }

  return {
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    lastActiveDate: today,
  };
}