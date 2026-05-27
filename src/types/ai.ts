export type AIPlanType = "nutrition" | "training" | "running";

export type AIPlanRequest = {
  type: AIPlanType;
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: string;
  trainingLevel: string;
};

export type AIPlanResponse = {
  title: string;
  summary: string;
  recommendations: string[];
  warnings: string[];
};