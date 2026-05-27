import { XPAction } from "./fitness";

export type DailyMission = {
  id: string;
  title: string;
  description: string;
  xpAction: XPAction;
  completed: boolean;
};