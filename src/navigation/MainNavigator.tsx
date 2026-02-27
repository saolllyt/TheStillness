import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TrackerScreen } from '../screens/main/TrackerScreen';
import { ComicsScreen } from '../screens/main/ComicsScreen';
import { DiaryScreen } from '../screens/main/DiaryScreen';
import { MusicScreen } from '../screens/main/MusicScreen';
import { DiaryEntryScreen } from '../screens/diary/DiaryEntryScreen';

import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export type MainTabParamList = {
  Tracker: undefined;
  Comics: undefined;
  Diary: undefined;
  Music: undefined;
  Profile: undefined;
};

export type DiaryStackParamList = {
  DiaryMain: undefined;
  DiaryEntry: { id?: number };
  EditDiaryEntry: { id: number }; 
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const DiaryStack = createStackNavigator<DiaryStackParamList>();

const DiaryStackScreen = () => {
  return (
    <DiaryStack.Navigator screenOptions={{ headerShown: false }}>
      <DiaryStack.Screen name="DiaryMain" component={DiaryScreen} />
      <DiaryStack.Screen name="DiaryEntry" component={DiaryEntryScreen} />
      <DiaryStack.Screen name="EditDiaryEntry" component={DiaryEntryScreen} />
    </DiaryStack.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Tracker"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: SPACING.md,
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          borderRadius: BORDER_RADIUS.xl,
          ...SHADOWS.medium,
          elevation: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Feather.glyphMap = 'circle';

          if (route.name === 'Tracker') {
            iconName = 'activity';
          } else if (route.name === 'Comics') {
            iconName = 'book-open';
          } else if (route.name === 'Diary') {
            iconName = 'edit-3';
          } else if (route.name === 'Music') {
            iconName = 'headphones';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return (
            <View style={[
              styles.iconContainer,
              focused && styles.iconContainerActive
            ]}>
              <Feather 
                name={iconName} 
                size={22} 
                color={focused ? COLORS.white : color} 
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Comics" component={ComicsScreen} />
      <Tab.Screen name="Diary" component={DiaryStackScreen} />
      <Tab.Screen name="Music" component={MusicScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: COLORS.primary,
  },
});