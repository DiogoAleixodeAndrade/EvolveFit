import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { Award, Calendar, Flame, LogOut, Pencil, Shield, Trophy, User, Zap } from "lucide-react-native";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { useProgress } from "../../context/ProgressContext";
import { useUserProfile } from "../../context/UserProfileContext";
import { supabase } from "../../services/supabase";
import { useCallback, useState } from "react";
import { getHunterRank, getRankColor } from "../../services/rankSystem";
import {
  Achievement as AchievementType,
  fetchAchievements,
} from "../../services/achievementService";

export default function ProfileScreen() {
  const { profile, isLoadingProfile } = useUserProfile();
  const {
  totalXP,
  level,
  levelProgress,
  xpInsideLevel,
  missions,
  currentStreak,
  bestStreak,
  isLoadingProgress,
} = useProgress();

  const completedMissions = missions.filter((mission) => mission.completed).length;
  const hunterRank = getHunterRank(totalXP);
  const rankColor = getRankColor(hunterRank);
  const isLoading = isLoadingProfile || isLoadingProgress;
  const [achievements, setAchievements] = useState<AchievementType[]>([]);
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert("Erro ao sair", error.message);
      return;
    }

    router.replace("/" as any);
  }

  async function loadAchievements() {
  try {
    setIsLoadingAchievements(true);
    const achievementsFromSupabase = await fetchAchievements();
    setAchievements(achievementsFromSupabase);
  } catch (error) {
    console.log("Erro ao carregar conquistas:", error);
  } finally {
    setIsLoadingAchievements(false);
  }
}
  useFocusEffect(
  useCallback(() => {
    loadAchievements();
  }, [])
);

  if (isLoading) {
    return (
      <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.secondary} size="large" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Perfil</Text>
          <Text style={styles.subtitle}>Status do seu personagem fitness.</Text>
        </View>

        <GameCard>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <User color={colors.secondary} size={38} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{profile.name}</Text>
              <Text style={styles.class}>Classe: Guerreiro em Evolução</Text>
              <Text style={[styles.rank, { color: rankColor }]}>
  {hunterRank}-RANK · LEVEL {level}
</Text>
            </View>
          </View>

          <View style={styles.xpBox}>
            <View style={styles.rowBetween}>
              <Text style={styles.label}>XP do nível</Text>
              <Text style={styles.value}>{xpInsideLevel} / 500</Text>
            </View>

            <ProgressBar progress={levelProgress} />
          </View>

          <Pressable style={styles.editButton} onPress={() => router.push("/edit-profile" as any)}>
            <Pencil color={colors.text} size={18} />
            <Text style={styles.editButtonText}>EDITAR PERFIL</Text>
          </Pressable>

          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color={colors.danger} size={18} />
            <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
          </Pressable>
        </GameCard>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <GameCard>
              <Zap color={colors.secondary} size={24} />
              <Text style={styles.statValue}>{totalXP}</Text>
              <Text style={styles.statLabel}>XP total</Text>
            </GameCard>
          </View>

          <View style={styles.gridItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Streak atual</Text>
            </GameCard>
          </View>

          <View style={styles.gridItem}>
            <GameCard>
              <Trophy color={colors.success} size={24} />
              <Text style={styles.statValue}>{completedMissions}</Text>
              <Text style={styles.statLabel}>Missões</Text>
            </GameCard>
          </View>

          <View style={styles.gridItem}>
            <GameCard>
              <Shield color={colors.primary} size={24} />
              <Text style={[styles.statValue, { color: rankColor }]}>
  {hunterRank}
</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados físicos</Text>

          <GameCard>
            <Text style={styles.infoText}>Idade: {profile.age} anos</Text>
            <Text style={styles.infoText}>Altura: {profile.heightCm} cm</Text>
            <Text style={styles.infoText}>Peso: {profile.weightKg} kg</Text>
            <Text style={styles.infoText}>Nível: {profile.trainingLevel}</Text>
            <Text style={styles.infoText}>Melhor streak: {bestStreak} dias</Text>
          </GameCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atributos</Text>

          <Attribute name="Força" value={35} />
          <Attribute name="Resistência" value={28} />
          <Attribute name="Disciplina" value={42} />
          <Attribute name="Nutrição" value={30} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas</Text>

          {isLoadingAchievements && (
  <GameCard>
    <ActivityIndicator color={colors.secondary} />
    <Text style={styles.loadingText}>Carregando conquistas...</Text>
  </GameCard>
)}

{!isLoadingAchievements && achievements.length === 0 && (
  <GameCard>
    <Text style={styles.infoText}>Nenhuma conquista desbloqueada ainda.</Text>
  </GameCard>
)}

{!isLoadingAchievements &&
  achievements.map((achievement) => (
    <Achievement
      key={achievement.id}
      icon={<Award color={colors.secondary} size={22} />}
      title={achievement.title}
      description={achievement.description}
    />
  ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Attribute({ name, value }: { name: string; value: number }) {
  return (
    <GameCard>
      <View style={styles.rowBetween}>
        <Text style={styles.attributeName}>{name}</Text>
        <Text style={styles.value}>{value}/100</Text>
      </View>

      <ProgressBar progress={value} />
    </GameCard>
  );
}

function Achievement({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <GameCard>
      <View style={styles.achievement}>
        {icon}

        <View style={{ flex: 1 }}>
          <Text style={styles.achievementTitle}>{title}</Text>
          <Text style={styles.achievementDescription}>{description}</Text>
        </View>
      </View>
    </GameCard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 14,
    fontWeight: "700",
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 8,
  },
  profileHeader: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(0,229,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(0,229,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  class: {
    color: colors.textMuted,
    marginTop: 4,
  },
  rank: {
    color: colors.secondary,
    marginTop: 6,
    fontWeight: "900",
  },
  xpBox: {
    marginTop: 20,
    gap: 10,
  },
  editButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  editButtonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.35)",
  },
  logoutButtonText: {
    color: colors.danger,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  value: {
    color: colors.text,
    fontWeight: "900",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "48%",
  },
  statValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  infoText: {
    color: colors.textMuted,
    fontWeight: "700",
    marginBottom: 8,
  },
  attributeName: {
    color: colors.text,
    fontWeight: "900",
    marginBottom: 12,
  },
  achievement: {
    flexDirection: "row",
    gap: 14,
  },
  achievementTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  achievementDescription: {
    color: colors.textMuted,
    marginTop: 4,
  },
});