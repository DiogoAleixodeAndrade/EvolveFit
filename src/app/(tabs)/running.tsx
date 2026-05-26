import { LinearGradient } from "expo-linear-gradient";
import { Bot, Clock, Flame, Footprints, Gauge, Map, Trophy } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";

const runs = [
  {
    id: "easy",
    name: "Corrida leve",
    distance: "3 km",
    pace: "7:00/km",
    time: "21 min",
  },
  {
    id: "interval",
    name: "Intervalado",
    distance: "6 tiros",
    pace: "forte",
    time: "25 min",
  },
  {
    id: "long",
    name: "Longão",
    distance: "5 km",
    pace: "confortável",
    time: "40 min",
  },
];

export default function RunningScreen() {
  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Corrida IA</Text>
          <Text style={styles.subtitle}>
            Planos de corrida, pace, distância e evolução cardiovascular.
          </Text>
        </View>

        <GameCard>
          <View style={styles.aiHeader}>
            <Bot color={colors.secondary} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Corredor IA</Text>
              <Text style={styles.text}>
                Cria planos para 5K, 10K, resistência, emagrecimento e performance.
              </Text>
            </View>
          </View>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>GERAR PLANO DE CORRIDA</Text>
          </Pressable>
        </GameCard>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <GameCard>
              <Map color={colors.secondary} size={24} />
              <Text style={styles.statValue}>12 km</Text>
              <Text style={styles.statLabel}>Semana</Text>
              <ProgressBar progress={48} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Gauge color={colors.secondary} size={24} />
              <Text style={styles.statValue}>6:40</Text>
              <Text style={styles.statLabel}>Pace médio</Text>
              <ProgressBar progress={62} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>690</Text>
              <Text style={styles.statLabel}>Kcal</Text>
              <ProgressBar progress={70} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Trophy color={colors.success} size={24} />
              <Text style={styles.statValue}>+60</Text>
              <Text style={styles.statLabel}>XP hoje</Text>
              <ProgressBar progress={60} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plano da semana</Text>

          {runs.map((run) => (
            <GameCard key={run.id}>
              <Text style={styles.runName}>{run.name}</Text>

              <View style={styles.runInfo}>
                <View style={styles.infoItem}>
                  <Footprints color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.distance}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Gauge color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.pace}</Text>
                </View>

                <View style={styles.infoItem}>
                  <Clock color={colors.secondary} size={18} />
                  <Text style={styles.infoText}>{run.time}</Text>
                </View>
              </View>
            </GameCard>
          ))}
        </View>

        <Text style={styles.warning}>
          Aumente volume e intensidade aos poucos. Em caso de dor, pare e procure orientação.
        </Text>
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
    lineHeight: 22,
  },
  aiHeader: {
    flexDirection: "row",
    gap: 14,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  text: {
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statItem: {
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
    marginBottom: 12,
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
  runName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  runInfo: {
    marginTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  warning: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
});