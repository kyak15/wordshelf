import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useTheme } from "../../../theme";

interface AudioButtonProps {
  audioUrl?: string | null;
  size?: number;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  audioUrl,
  size = 24,
}) => {
  const { theme } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async () => {
    if (!audioUrl || isPlaying || isLoading) return;

    try {
      setIsLoading(true);
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );

      setIsLoading(false);
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setIsPlaying(false);
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={playAudio}
      disabled={isPlaying || isLoading}
      style={styles.button}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.colors.accent} />
      ) : (
        <Ionicons
          name={isPlaying ? "volume-high" : "volume-medium-outline"}
          size={size}
          color={isPlaying ? theme.colors.accent : theme.colors.secondaryText}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
