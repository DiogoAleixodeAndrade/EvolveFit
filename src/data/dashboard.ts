import {
  Activity,
  Bot,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Shield,
  Target,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react-native";
import { colors } from "../constants/theme";

export const playerStats = [
  {
    id: "streak",
    icon: Flame,
    iconColor: colors.warning,
    value: "0",
    label: "Streak",
  },
  {
    id: "xp",
    icon: Zap,
    iconColor: colors.secondary,
    value: "120",
    label: "XP",
  },
  {
    id: "missions",
    icon: Trophy,
    iconColor: colors.success,
    value: "3",
    label: "Missões",
  },
  {
    id: "level",
    icon: Activity,
    iconColor: colors.primary,
    value: "1",
    label: "Level",
  },
  {
  id: "rank",
  icon: Shield,
  iconColor: colors.primary,
  value: "E",
  label: "Rank",
},
];

export const dailyMissions = [
  {
    id: "meal",
    icon: Utensils,
    title: "Registrar refeições",
    xp: "+40 XP",
  },
  {
    id: "water",
    icon: Droplets,
    title: "Bater meta de água",
    xp: "+30 XP",
  },
  {
    id: "training",
    icon: Dumbbell,
    title: "Completar treino",
    xp: "+80 XP",
  },
  {
    id: "running",
    icon: Footprints,
    title: "Fazer cardio/corrida",
    xp: "+60 XP",
  },
];

export const aiAssistants = [
  {
    id: "nutritionist",
    icon: Bot,
    title: "Nutricionista IA",
    description: "Cria dietas, macros, refeições e substituições.",
  },
  {
    id: "trainer",
    icon: Dumbbell,
    title: "Personal IA",
    description: "Cria treinos de hipertrofia, força e evolução de carga.",
  },
  {
    id: "runner",
    icon: Target,
    title: "Corredor IA",
    description: "Cria planos de corrida para resistência, pace e performance.",
  },
];