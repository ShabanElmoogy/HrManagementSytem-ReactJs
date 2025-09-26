import type { State } from "../../types/State";
import type { Theme } from "@mui/material/styles";

export const getQualityScore = (state: State) => {
  let score = 40; // Base score
  if (state.nameEn) score += 20;
  if (state.nameAr) score += 20;
  if (state.code) score += 10;
  if (state.countryId && state.country) score += 10;
  return Math.min(score, 100);
};

export const getQualityLevel = (score: number, theme: Theme) => {
  if (score >= 90)
    return { level: "excellent", color: theme.palette.success.main } as const;
  if (score >= 75) return { level: "good", color: theme.palette.info.main } as const;
  if (score >= 60)
    return { level: "average", color: theme.palette.warning.main } as const;
  return { level: "poor", color: theme.palette.error.main } as const;
};
