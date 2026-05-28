import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export type WeeklySummary = {
  mealsCount: number;
  waterMl: number;
  workoutsCount: number;
  runsCount: number;
  runDistanceKm: number;
  latestWeightKg: number | null;
};

function getDateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

export async function fetchWeeklySummary(): Promise<WeeklySummary> {
  const userId = await getCurrentUserId();
  const startDate = getDateDaysAgo(6);

  const [meals, water, workouts, runs, weights] = await Promise.all([
    supabase.from("meals").select("id").eq("user_id", userId).gte("meal_date", startDate),
    supabase.from("water_logs").select("amount_ml").eq("user_id", userId).gte("log_date", startDate),
    supabase.from("workouts").select("id").eq("user_id", userId).gte("workout_date", startDate),
    supabase.from("runs").select("distance_km").eq("user_id", userId).gte("run_date", startDate),
    supabase.from("weight_logs").select("weight_kg").eq("user_id", userId).order("log_date", { ascending: false }).limit(1),
  ]);

  return {
    mealsCount: meals.data?.length ?? 0,
    waterMl: water.data?.reduce((total, item) => total + item.amount_ml, 0) ?? 0,
    workoutsCount: workouts.data?.length ?? 0,
    runsCount: runs.data?.length ?? 0,
    runDistanceKm: runs.data?.reduce((total, item) => total + Number(item.distance_km), 0) ?? 0,
    latestWeightKg: weights.data?.[0]?.weight_kg ? Number(weights.data[0].weight_kg) : null,
  };
}