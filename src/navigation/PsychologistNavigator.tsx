import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

import { PsychologistHomeScreen } from '../screens/psychologist/PsychologistHomeScreen';
import { PatientsScreen } from '../screens/psychologist/PatientsScreen';
import { ChatScreen } from '../screens/psychologist/ChatScreen';
import { PsychologistProfileScreen } from '../screens/psychologist/PsychologistProfileScreen';
import { CreateReportScreen } from '../screens/psychologist/CreateReportScreen';
import { ReportDetailScreen } from '../screens/psychologist/ReportDetailScreen';
import { ReportViewerScreen } from '../screens/ReportViewerScreen';
import { PsychReportViewerScreen } from '../screens/PsychReportViewerScreen';
import { FloatingTabBar } from '../components/navigation/FloatingTabBar';

export type PsychologistTabParamList = {
  Home: undefined;
  Patients: undefined;
  PsychProfile: undefined;
};

export type PsychologistStackParamList = {
  PsychTabs: undefined;
  Chat: { otherUserId: number; otherUserName: string };
  CreateReport: { patient: any };
  ReportDetail: { reportId: number };
  ReportViewer: { reportData: any; userName: string; reportId: number };
  PsychReportViewer: { report: any; patientName?: string };
};

const Tab = createBottomTabNavigator<PsychologistTabParamList>();
const Stack = createStackNavigator<PsychologistStackParamList>();

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Patients: 'users',
  PsychProfile: 'user',
};

const PsychologistTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false }}
    tabBar={(props) => (
      <FloatingTabBar {...props} icons={TAB_ICONS} />
    )}
  >
    <Tab.Screen name="Home" component={PsychologistHomeScreen} />
    <Tab.Screen name="Patients" component={PatientsScreen} />
    <Tab.Screen name="PsychProfile" component={PsychologistProfileScreen} />
  </Tab.Navigator>
);

export const PsychologistNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PsychTabs" component={PsychologistTabs} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="CreateReport" component={CreateReportScreen} />
    <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    <Stack.Screen name="ReportViewer" component={ReportViewerScreen} />
    <Stack.Screen name="PsychReportViewer" component={PsychReportViewerScreen} />
  </Stack.Navigator>
);
