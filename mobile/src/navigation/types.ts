import type { NavigatorScreenParams } from "@react-navigation/native";

/**
 * Main tab navigator param list (authenticated users)
 */
export type MainTabParamList = {
  Home: undefined;
  Flashcards: undefined;
  Add: undefined;
  Stats: undefined;
  Profile: undefined;
};

/**
 * Root stack navigator param list
 */
export type RootStackParamList = {
  Welcome: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
