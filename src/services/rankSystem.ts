export type HunterRank =
  | "E"
  | "D"
  | "C"
  | "B"
  | "A"
  | "S";

export function getHunterRank(totalXP: number): HunterRank {
  if (totalXP >= 10000) return "S";
  if (totalXP >= 7000) return "A";
  if (totalXP >= 4000) return "B";
  if (totalXP >= 2000) return "C";
  if (totalXP >= 800) return "D";

  return "E";
}

export function getRankColor(rank: HunterRank) {
  switch (rank) {
    case "S":
      return "#ffb703";

    case "A":
      return "#ef4444";

    case "B":
      return "#8b5cf6";

    case "C":
      return "#3b82f6";

    case "D":
      return "#22c55e";

    default:
      return "#94a3b8";
  }
}