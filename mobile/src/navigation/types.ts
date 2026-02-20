import type { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Flashcards: undefined;
  Add: undefined;
  Stats: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Welcome: undefined;
  EmailAuth: undefined;
  OTPVerification: { email: string };
  Main: NavigatorScreenParams<MainTabParamList>;
  Words:
    | {
        initialFilter?: "mastery_level" | "book";
        masteryLevel?: number;
        bookId?: string;
      }
    | undefined;
  ReviewSession: undefined;
  BookDetail: {
    bookId: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
