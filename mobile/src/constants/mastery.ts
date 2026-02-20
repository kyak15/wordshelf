import { SavedWordRow } from "../types";

export interface MasteryLevel {
  level: number;
  label: string;
  color: string;
}

export const MASTERY_LEVELS: MasteryLevel[] = [
  { level: 0, label: "Learning", color: "#E53935" },
  { level: 1, label: "Reviewing", color: "#FF9800" },
  { level: 2, label: "Familiar", color: "#FDD835" },
  { level: 3, label: "Mastered", color: "#7CB342" },
];

export interface MasteryLevelWithCount extends MasteryLevel {
  count: number;
}

export function getMasteryLevelCounts(
  words: SavedWordRow[] | undefined
): MasteryLevelWithCount[] {
  return MASTERY_LEVELS.map((level) => ({
    ...level,
    count:
      words?.filter((w) =>
        level.level === 3
          ? w.mastery_level >= 3
          : w.mastery_level === level.level
      ).length || 0,
  }));
}

export function getMasteryInfo(level: number): { color: string; label: string } {
  const found = MASTERY_LEVELS.find((m) =>
    m.level === 3 ? level >= 3 : m.level === level
  );
  return found || { color: "#9E9E9E", label: "Unknown" };
}
