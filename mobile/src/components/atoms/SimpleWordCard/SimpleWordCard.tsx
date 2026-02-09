import { View, StyleSheet } from "react-native";

interface SimpleWordCardProps {
  word: string;
  definition: string;
}

export default function SimpleWordCard({
  word,
  definition,
}: SimpleWordCardProps) {
  <View style={styles.container}>
    {word} - {definition}
  </View>;
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
