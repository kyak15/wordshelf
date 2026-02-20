import React, { useRef } from "react";
import { StyleSheet, Animated, Alert, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { SavedWordCard } from "../SavedWordCard";
import { SavedWordRow } from "../../../types";
import { useTheme } from "../../../theme";

interface SwipeableWordCardProps {
  word: SavedWordRow;
  onPress?: () => void;
  onDelete: (wordId: string) => void;
  showBookInfo?: boolean;
  showMasteryLevel?: boolean;
}

export const SwipeableWordCard: React.FC<SwipeableWordCardProps> = ({
  word,
  onPress,
  onDelete,
  showBookInfo = false,
  showMasteryLevel = true,
}) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    Alert.alert(
      "Delete Word",
      `Are you sure you want to delete "${word.text}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(word.saved_word_id);
          },
        },
      ],
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.deleteContent,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
          <Animated.Text style={styles.deleteText}>Delete</Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
      friction={2}
    >
      <SavedWordCard
        word={word}
        onPress={onPress}
        showBookInfo={showBookInfo}
        showMasteryLevel={showMasteryLevel}
      />
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  deleteContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
