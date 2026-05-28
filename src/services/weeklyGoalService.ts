import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type WeeklyGoals = {
  mealsGoal: number;
  waterLitersGoal: number;
  workoutsGoal: number;
  runsGoal: number;
  distanceKmGoal: number;
};

export const defaultWeeklyGoals: WeeklyGoals = {
  mealsGoal: 21,
  waterLitersGoal: 14,
  workoutsGoal: 3,
  runsGoal: 2,
  distanceKmGoal: 10,
};

export async function fetchWeeklyGoals(): Promise<WeeklyGoals> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("weekly_goals")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    await upsertWeeklyGoals(defaultWeeklyGoals);
    return defaultWeeklyGoals;
  }

  return {
    mealsGoal: data.meals_goal,
    waterLitersGoal: Number(data.water_liters_goal),
    workoutsGoal: data.workouts_goal,
    runsGoal: data.runs_goal,
    distanceKmGoal: Number(data.distance_km_goal),
  };
}

export async function upsertWeeklyGoals(goals: WeeklyGoals) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("weekly_goals").upsert({
    user_id: userId,
    meals_goal: goals.mealsGoal,
    water_liters_goal: goals.waterLitersGoal,
    workouts_goal: goals.workoutsGoal,
    runs_goal: goals.runsGoal,
    distance_km_goal: goals.distanceKmGoal,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}