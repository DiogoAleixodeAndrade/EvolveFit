import { initialDailyMissions } from "../data/missions";
import { DailyMission } from "../types/missions";
import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export async function fetchTotalXP(): Promise<number> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return 0;
  }

  return data.total_xp ?? 0;
}

export async function updateTotalXP(totalXP: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("profiles")
    .update({
      total_xp: totalXP,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function fetchTodayMissions(): Promise<DailyMission[]> {
  const userId = await getCurrentUserId();

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("daily_missions")
    .select("*")
    .eq("user_id", userId)
    .eq("mission_date", today)
    .order("created_at", { ascending: true });

  if (error) {
    return initialDailyMissions;
  }

  if (!data || data.length === 0) {
    await createTodayMissions();
    return initialDailyMissions;
  }

  return data.map((mission) => ({
    id: mission.mission_key,
    title: mission.title,
    description: mission.description,
    xpAction:
      mission.mission_key === "meal"
        ? "meal_logged"
        : mission.mission_key === "water"
          ? "water_goal_completed"
          : mission.mission_key === "workout"
            ? "workout_completed"
            : "run_completed",
    completed: mission.completed,
  }));
}

export async function createTodayMissions() {
  const userId = await getCurrentUserId();

  const today = new Date().toISOString().slice(0, 10);

  const missionsToInsert = initialDailyMissions.map((mission) => ({
    user_id: userId,
    mission_key: mission.id,
    title: mission.title,
    description: mission.description,
    xp: 0,
    completed: mission.completed,
    mission_date: today,
  }));

  const { error } = await supabase.from("daily_missions").insert(missionsToInsert);

  if (error) {
    throw error;
  }
}

export async function markMissionAsCompleted(missionId: string) {
  const userId = await getCurrentUserId();

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from("daily_missions")
    .update({ completed: true })
    .eq("user_id", userId)
    .eq("mission_key", missionId)
    .eq("mission_date", today);

  if (error) {
    throw error;
  }
}