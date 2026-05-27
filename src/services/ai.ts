import { AIPlanRequest, AIPlanResponse } from "../types/ai";
import { supabase } from "./supabase";

export async function generateAIPlan(
  request: AIPlanRequest
): Promise<AIPlanResponse> {
  const { data, error } = await supabase.functions.invoke("generate-ai-plan", {
    body: request,
  });

  if (error) {
    throw error;
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AIPlanResponse;
}