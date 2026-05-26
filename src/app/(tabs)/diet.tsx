import { LinearGradient } from "expo-linear-gradient";
import { Bot, Droplets, Flame, Plus, Utensils } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GameCard } from "../../components/GameCard";
import { ProgressBar } from "../../components/ProgressBar";
import { colors } from "../../constants/theme";

const meals = [
  {
    id: "breakfast",
    name: "Café da manhã",
    description: "Ovos, pão integral e fruta",
    protein: "28g proteína",
  },
  {
    id: "lunch",
    name: "Almoço",
    description: "Arroz, feijão, frango e salada",
    protein: "42g proteína",
  },
  {
    id: "dinner",
    name: "Jantar",
    description: "Carne magra, legumes e batata",
    protein: "38g proteína",
  },
];

export default function DietScreen() {
  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.title}>Dieta IA</Text>
          <Text style={styles.subtitle}>
            Plano alimentar inteligente para sua evolução.
          </Text>
        </View>

        <GameCard>
          <View style={styles.aiHeader}>
            <Bot color={colors.secondary} size={26} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Nutricionista IA</Text>
              <Text style={styles.text}>
                Gera dieta com base em objetivo, idade, altura, peso e rotina.
              </Text>
            </View>
          </View>

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>GERAR PLANO ALIMENTAR</Text>
          </Pressable>
        </GameCard>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <GameCard>
              <Utensils color={colors.secondary} size={24} />
              <Text style={styles.statValue}>108g</Text>
              <Text style={styles.statLabel}>Proteína</Text>
              <ProgressBar progress={72} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Droplets color={colors.secondary} size={24} />
              <Text style={styles.statValue}>1.8L</Text>
              <Text style={styles.statLabel}>Água</Text>
              <ProgressBar progress={60} />
            </GameCard>
          </View>

          <View style={styles.statItem}>
            <GameCard>
              <Flame color={colors.warning} size={24} />
              <Text style={styles.statValue}>1850</Text>
              <Text style={styles.statLabel}>Calorias</Text>
              <ProgressBar progress={68} />
            </GameCard>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Refeições de hoje</Text>

            <Pressable style={styles.addButton}>
              <Plus color={colors.text} size={18} />
            </Pressable>
          </View>

          {meals.map((meal) => (
            <GameCard key={meal.id}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.text}>{meal.description}</Text>
              <Text style={styles.protein}>{meal.protein}</Text>
            </GameCard>
          ))}
        </View>

        <Text style={styles.warning}>
          O EvolveFit ajuda na organização da rotina, mas não substitui acompanhamento
          com nutricionista ou médico.
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  mealName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  protein: {
    color: colors.success,
    fontWeight: "900",
    marginTop: 8,
  },
  warning: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
});