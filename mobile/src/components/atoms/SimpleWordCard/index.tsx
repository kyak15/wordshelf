import { View, StyleSheet } from "react-native";
import { Text } from "../Text";
import { useTheme } from "../../../theme";

interface SimpleWordCardProps {
  word: string;
  definition: string | null;
}

export default function SimpleWordCard({
  word,
  definition,
}: SimpleWordCardProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="body" style={styles.word}>
        {word}
      </Text>
      <Text variant="body" color="secondary" style={styles.separator}>
        {" - "}
      </Text>
      <Text
        variant="body"
        color="secondary"
        style={styles.definition}
        numberOfLines={1}
      >
        {definition ?? "No definition"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  word: {
    fontWeight: "700",
  },
  separator: {},
  definition: {
    flex: 1,
  },
});
