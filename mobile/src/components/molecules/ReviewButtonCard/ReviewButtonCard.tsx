import { StyleSheet, View } from "react-native";
import ReviewButton from "../../atoms/ReviewButton/ReviewButton";

const REVIEW_LEVELS = [
  {
    level: "Again",
    subbody: "1m",
    value: 0,
    color: "#E53935",
  },
  {
    level: "Hard",
    subbody: "10m",
    value: 3,
    color: "#FF9800",
  },
  {
    level: "Good",
    subbody: "1d",
    value: 4,
    color: "#7CB342",
  },
  {
    level: "Easy",
    subbody: "4d",
    value: 5,
    color: "#42A5F5",
  },
];

interface ReviewButtonCardProps {
  onReview: (quality: 0 | 3 | 4 | 5) => void;
  disabled?: boolean;
}

export default function ReviewButtonCard({
  onReview,
  disabled = false,
}: ReviewButtonCardProps) {
  return (
    <View style={styles.buttonsContainer}>
      {REVIEW_LEVELS.map((level) => (
        <ReviewButton
          key={level.value}
          body={level.level}
          subbody={level.subbody}
          color={level.color}
          onPress={() => onReview(level.value as 0 | 3 | 4 | 5)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
});
