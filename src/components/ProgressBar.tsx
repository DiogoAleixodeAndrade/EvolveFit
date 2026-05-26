import { StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.background}>
      <View style={[styles.fill, { width: `${safeProgress}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 999,
  },
});