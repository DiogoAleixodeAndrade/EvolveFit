import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { MissionCard } from "../../components/MissionCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";
import { aiAssistants, dailyMissions, playerStats } from "../../data/dashboard";

export default function DashboardScreen() {
  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Bem-vindo, Caçador</Text>
          <Text style={styles.title}>E-RANK · LEVEL 1</Text>
          <Text style={styles.subtitle}>Sistema de evolução ativado</Text>
        </View>

        <GameCard>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>XP DO NÍVEL</Text>
            <Text style={styles.xpValue}>120 / 500</Text>
          </View>

          <ProgressBar progress={24} />
        </GameCard>

        <View style={styles.grid}>
          {playerStats.map((stat) => {
            const Icon = stat.icon;

            return (
              <View key={stat.id} style={styles.gridItem}>
                <GameCard>
                  <Icon color={stat.iconColor} size={24} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </GameCard>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Missões diárias</Text>

          {dailyMissions.map((mission) => {
            const Icon = mission.icon;

            return (
              <MissionCard
                key={mission.id}
                icon={<Icon color={colors.secondary} size={22} />}
                title={mission.title}
                xp={mission.xp}
              />
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assistentes IA</Text>

          {aiAssistants.map((assistant) => {
            const Icon = assistant.icon;

            return (
              <GameCard key={assistant.id}>
                <View style={styles.assistantContent}>
                  <Icon color={colors.secondary} size={24} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.assistantTitle}>{assistant.title}</Text>
                    <Text style={styles.assistantDescription}>
                      {assistant.description}
                    </Text>
                  </View>
                </View>
              </GameCard>
            );
          })}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 14,
  },
  header: {
    marginBottom: 8,
  },
  welcome: {
    color: colors.textMuted,
    fontSize: 15,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
    letterSpacing: 1,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 14,
    marginTop: 6,
    fontWeight: "700",
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  xpLabel: {
    color: colors.textMuted,
    fontWeight: "800",
    fontSize: 12,
  },
  xpValue: {
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
  section: {
    marginTop: 10,
    gap: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.textMuted,
    marginTop: 4,
  },
  assistantContent: {
    flexDirection: "row",
    gap: 14,
  },
  assistantTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  assistantDescription: {
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
});