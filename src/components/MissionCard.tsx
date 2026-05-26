import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";

type MissionCardProps = {
  icon: ReactNode;
  title: string;
  xp: string;
};

export function MissionCard({ icon, title, xp }: MissionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.xp}>{xp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0B1026",
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: colors.text,
    fontWeight: "700",
  },
  xp: {
    color: colors.success,
    fontWeight: "900",
  },
});