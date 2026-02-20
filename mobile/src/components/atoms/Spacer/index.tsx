import React from "react";
import { View } from "react-native";

type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
}

const sizeMap: Record<SpacerSize, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Spacer: React.FC<SpacerProps> = ({
  size = "md",
  horizontal = false,
}) => {
  const dimension = sizeMap[size];

  return (
    <View
      style={{
        width: horizontal ? dimension : undefined,
        height: horizontal ? undefined : dimension,
      }}
    />
  );
};
