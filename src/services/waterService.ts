import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export async function addWater(amountMl: number) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("water_logs").insert({
    user_id: userId,
    amount_ml: amountMl,
  });

  if (error) {
    throw error;
  }
}

export async function fetchTodayWater(): Promise<number> {
  const userId = await getCurrentUserId();

  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("water_logs")
    .select("amount_ml")
    .eq("user_id", userId)
    .eq("log_date", today);

  if (error || !data) {
    return 0;
  }

  return data.reduce((total, item) => total + item.amount_ml, 0);
}