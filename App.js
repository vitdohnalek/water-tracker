import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "./src/theme";

import TodayScreen from "./src/screens/TodayScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import StatsScreen from "./src/screens/StatsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const { colors, themeKey } = useTheme();

  return (
    <>
      <StatusBar
        style={["light", "pink", "light_blue"].includes(themeKey) ? "dark" : "light"}
        backgroundColor={colors.bg}
        translucent={false}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg,
              borderTopWidth: 1,
              borderTopColor: colors.highlight,
              elevation: 0,
              minHeight: 70,
              paddingBottom: 12,
              paddingTop: 8,
            },
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "600",
            },
          }}
        >
          <Tab.Screen
            name="Today"
            component={TodayScreen}
            options={{
              tabBarIcon: () => <Text style={{ fontSize: 24 }}>💧</Text>,
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{
              tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text>,
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarIcon: () => <Text style={{ fontSize: 24 }}>📊</Text>,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarIcon: () => <Text style={{ fontSize: 24 }}>⚙️</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppTabs />
    </ThemeProvider>
  );
}
