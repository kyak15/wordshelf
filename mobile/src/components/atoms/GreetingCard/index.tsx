import { View, StyleSheet } from "react-native";
import { Text } from "../Text";
import { useAuth } from "../../../context/AuthContext";

export default function GreetingCard() {
  const { user } = useAuth();

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    // 0-4:59am => evening; 5am-11:59am => morning; 12pm-4:59pm => afternoon; 5pm-11:59pm => evening
    if (hour >= 5 && hour < 12) {
      return "Good Morning,";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon,";
    } else {
      return "Good Evening,";
    }
  };
  const greeting = getGreeting();

  const firstName = user?.given_name || user?.name?.split(" ")[0] || "Reader";

  return (
    <View style={styles.greetingContainer}>
      <Text style={styles.greetings}>{greeting} {firstName}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  greetingContainer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    alignItems: "center",
  },
  greetings: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
  },
});
