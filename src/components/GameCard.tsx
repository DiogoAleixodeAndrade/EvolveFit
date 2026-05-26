import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

type GameCardProps = {
  children: ReactNode;
};

export function GameCard({ children }: GameCardProps) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
});