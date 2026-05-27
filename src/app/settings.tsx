import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Bell, BellOff } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Notifications from "expo-notifications";
import { colors } from "../constants/theme";
import { scheduleDailyReminders } from "../services/notificationService";
import { GameCard } from "../components/GameCard";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  async function handleEnableNotifications() {
    await scheduleDailyReminders();
    setNotificationsEnabled(true);
    Alert.alert("Notificações ativadas", "Seus lembretes diários foram configurados.");
  }

  async function handleDisableNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
    setNotificationsEnabled(false);
    Alert.alert("Notificações desativadas", "Seus lembretes foram cancelados.");
  }

  return (
    <LinearGradient colors={["#050816", "#0B1026", "#111C44"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Controle lembretes e preferências do sistema.</Text>

        <GameCard>
          <View style={styles.settingHeader}>
            {notificationsEnabled ? (
              <Bell color={colors.secondary} size={26} />
            ) : (
              <BellOff color={colors.textMuted} size={26} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Lembretes diários</Text>
              <Text style={styles.settingText}>
                Água, refeições e treino durante o dia.
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.button}
            onPress={
              notificationsEnabled
                ? handleDisableNotifications
                : handleEnableNotifications
            }
          >
            <Text style={styles.buttonText}>
              {notificationsEnabled ? "DESATIVAR" : "ATIVAR"}
            </Text>
          </Pressable>
        </GameCard>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>VOLTAR</Text>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  settingHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  settingTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  settingText: {
    color: colors.textMuted,
    marginTop: 4,
  },
  button: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: colors.text,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontWeight: "900",
  },
});