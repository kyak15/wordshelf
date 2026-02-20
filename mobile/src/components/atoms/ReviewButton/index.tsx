import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../Text";

interface ReviewButtonProps {
  body: string;
  subbody: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function ReviewButton({
  body,
  subbody,
  color,
  onPress,
  disabled = false,
}: ReviewButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.reviewButton, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text variant="body" style={styles.buttonText}>
        {body}
      </Text>
      <Text variant="caption" style={styles.buttonSubtext}>
        {subbody}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  reviewButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "#FFFFFF",
    opacity: 0.9,
    fontSize: 11,
  },
});
