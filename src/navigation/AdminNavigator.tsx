import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminPsychologistsScreen } from '../screens/admin/AdminPsychologistsScreen';
import { AdminContentScreen } from '../screens/admin/AdminContentScreen';
import { AdminProfileScreen } from '../screens/admin/AdminProfileScreen';
import { FloatingTabBar } from '../components/navigation/FloatingTabBar';

export type AdminTabParamList = {
  Dashboard: undefined;
  Users: undefined;
  Psychologists: undefined;
  Content: undefined;
  AdminProfile: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Dashboard: 'bar-chart-2',
  Users: 'users',
  Psychologists: 'user-check',
  Content: 'layers',
  AdminProfile: 'user',
};

export const AdminNavigator = () => (
  <Tab.Navigator
    initialRouteName="Dashboard"
    screenOptions={{ headerShown: false }}
    tabBar={(props) => (
      <FloatingTabBar {...props} icons={TAB_ICONS} />
    )}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
    <Tab.Screen name="Users" component={AdminUsersScreen} />
    <Tab.Screen name="Psychologists" component={AdminPsychologistsScreen} />
    <Tab.Screen name="Content" component={AdminContentScreen} />
    <Tab.Screen name="AdminProfile" component={AdminProfileScreen} />
  </Tab.Navigator>
);
