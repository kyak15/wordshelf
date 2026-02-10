import { View, StyleSheet, Text } from "react-native";

interface SimpleWordCardProps {
  word: string;
  definition: string | null;
}

export default function SimpleWordCard({
  word,
  definition,
}: SimpleWordCardProps) {
  return (
    <View style={styles.container}>
      <Text>
        {word} - {definition ?? "No definition"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
