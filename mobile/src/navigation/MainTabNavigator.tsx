import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./types";
import {
  HomeScreen,
  FlashcardsScreen,
  StatsScreen,
  ProfileScreen,
} from "../screens";
import { TabBar } from "../components/organisms";
import { View } from "react-native";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Placeholder screen for the Add tab
 * The actual add functionality is handled by the TabBar modal
 */
const AddPlaceholder: React.FC = () => <View />;

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Flashcards" component={FlashcardsScreen} />
      <Tab.Screen
        name="Add"
        component={AddPlaceholder}
        listeners={{
          tabPress: (e) => {
            // Prevent navigation to Add screen
            // The modal is handled in the TabBar component
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
