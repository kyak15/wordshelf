import { colors, ColorScheme, ThemeColors } from "./colors";

export interface Theme {
  colorScheme: ColorScheme;
  colors: ThemeColors;
}

export const lightTheme: Theme = {
  colorScheme: "light",
  colors: colors.light,
};

export const darkTheme: Theme = {
  colorScheme: "dark",
  colors: colors.dark,
};

export const getTheme = (colorScheme: ColorScheme): Theme => {
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
