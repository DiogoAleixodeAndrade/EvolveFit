import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Activity, Flame, Shield, Swords } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";
import { supabase } from "../services/supabase";

export default function HomeScreen() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/(tabs)" as any);
      }

      setIsCheckingSession(false);
    }

    checkSession();
  }, []);

  if (isCheckingSession) {
    return (
      <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.secondary} size="large" />
          <Text style={styles.loadingText}>Carregando sistema...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.logo}>EVOLVEFIT</Text>
          <Text style={styles.subtitle}>Seu sistema fitness de evolução pessoal</Text>
        </View>

        <View style={styles.rankCard}>
          <Text style={styles.rankLabel}>SISTEMA ATIVADO</Text>
          <Text style={styles.rank}>E-RANK</Text>
          <Text style={styles.rankDescription}>
            Entre na sua conta, complete missões diárias, evolua seu corpo e suba de nível.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Flame color={colors.warning} size={26} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Swords color={colors.secondary} size={26} />
            <Text style={styles.statNumber}>Lv. 1</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>

          <View style={styles.statCard}>
            <Shield color={colors.success} size={26} />
            <Text style={styles.statNumber}>0 XP</Text>
            <Text style={styles.statLabel}>Experiência</Text>
          </View>

          <View style={styles.statCard}>
            <Activity color={colors.primary} size={26} />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Missões</Text>
          </View>
        </View>

        <Pressable style={styles.button} onPress={() => router.push("/auth/login" as any)}>
          <Text style={styles.buttonText}>ENTRAR NO SISTEMA</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push("/auth/register" as any)}>
          <Text style={styles.secondaryButtonText}>CRIAR CONTA</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  safe: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 24,
  },
  logo: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3,
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 8,
    fontSize: 15,
  },
  rankCard: {
    backgroundColor: "rgba(108, 99, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.35)",
    borderRadius: 28,
    padding: 24,
  },
  rankLabel: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  rank: {
    color: colors.text,
    fontSize: 46,
    fontWeight: "900",
    marginTop: 10,
  },
  rankDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  statNumber: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 10,
  },
  statLabel: {
    color: colors.textMuted,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 1,
  },
  secondaryButton: {
    marginTop: -10,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  secondaryButtonText: {
    color: colors.secondary,
    fontWeight: "900",
  },
});