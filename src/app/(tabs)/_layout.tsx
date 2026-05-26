import { Tabs } from "expo-router";
import { Dumbbell, Home, Run, User, Utensils } from "lucide-react-native";
import { colors } from "../../constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#080D22",
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 72,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Sistema",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="diet"
        options={{
          title: "Dieta",
          tabBarIcon: ({ color, size }) => <Utensils color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="training"
        options={{
          title: "Treino",
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="running"
        options={{
          title: "Corrida",
          tabBarIcon: ({ color, size }) => <Run color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}