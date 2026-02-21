import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../components/atoms/Text";
import { Spacer } from "../components/atoms/Spacer";
import { MasteryStatsCard } from "../components/molecules/MasteryStatsCard";
import MilestonesCard from "../components/molecules/MilestonesCard";
import { useTheme } from "../theme";
import { useWords } from "shared/hooks/queries/useWords";
import { useMilestones, useReviewActivity } from "shared/hooks/queries/useStats";
import ActivityHeatmap from "../components/molecules/ActivityHeatmap";
import { getMasteryLevelCounts } from "../constants/mastery";

export const StatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { data: allWords, isLoading: wordsLoading } = useWords();
  const { data: milestonesData } = useMilestones();
  const { data: reviewActivity } = useReviewActivity(30);

  // Calculate mastery levels
  const masteryLevels = getMasteryLevelCounts(allWords);

  // Milestones
  const milestones = [
    {
      icon: "trophy" as const,
      label: "Longest Streak",
      value: `${milestonesData?.longestStreak || 0} days`,
      color: "#FFB300",
    },
    {
      icon: "calendar" as const,
      label: "Total Days Active",
      value: `${milestonesData?.totalDaysActive || 0} days`,
      color: "#7CB342",
    },
    {
      icon: "checkmark-circle" as const,
      label: "Total Reviews",
      value: milestonesData?.totalReviews || 0,
      color: "#42A5F5",
    },
    {
      icon: "book" as const,
      label: "Books with Words",
      value: `${milestonesData?.booksWithWords || 0} books`,
      color: "#9C27B0",
    },
  ];

  if (wordsLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={["top"]}
      >
        <View style={styles.loadingContainer}>
          <Text variant="body" color="secondary">
            Loading stats...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Your Progress
          </Text>
        </View>
        <Spacer size="md" />

        <View style={styles.section}>
          <MilestonesCard milestones={milestones} />
        </View>

        <Spacer size="md" />

        <View style={styles.section}>
          <ActivityHeatmap data={reviewActivity || []} />
        </View>

        <Spacer size="md" />

        <View style={styles.section}>
          <MasteryStatsCard levels={masteryLevels} />
        </View>

        <Spacer size="lg" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statsGridSecondRow: {
    marginTop: 12,
  },
});
