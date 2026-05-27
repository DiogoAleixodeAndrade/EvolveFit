import { AIPlanResponse, AIPlanType } from "../types/ai";
import { getCurrentUserId } from "./profileService";
import { supabase } from "./supabase";

export async function saveAIPlan(
  planType: AIPlanType,
  plan: AIPlanResponse
) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("ai_plans").insert({
    user_id: userId,
    plan_type: planType,
    title: plan.title,
    summary: plan.summary,
    recommendations: plan.recommendations,
    warnings: plan.warnings,
  });

  if (error) {
    throw error;
  }
}

export async function fetchLatestAIPlan(
  planType: AIPlanType
): Promise<AIPlanResponse | null> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("ai_plans")
    .select("*")
    .eq("user_id", userId)
    .eq("plan_type", planType)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    title: data.title,
    summary: data.summary,
    recommendations: data.recommendations ?? [],
    warnings: data.warnings ?? [],
  };
}