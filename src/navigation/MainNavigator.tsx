import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { TrackerScreen } from '../screens/main/TrackerScreen';
import { ComicsScreen } from '../screens/main/ComicsScreen';
import { DiaryScreen } from '../screens/main/DiaryScreen';
import { MusicScreen } from '../screens/main/MusicScreen';
import { DiaryEntryScreen } from '../screens/diary/DiaryEntryScreen';
import { PsychologistListScreen } from '../screens/psychologist/PsychologistListScreen';
import { ChatScreen } from '../screens/psychologist/ChatScreen';
import { ReportViewerScreen } from '../screens/ReportViewerScreen';
import { PsychReportViewerScreen } from '../screens/PsychReportViewerScreen';
import { FloatingTabBar } from '../components/navigation/FloatingTabBar';

export type MainTabParamList = {
  Tracker: undefined;
  Comics: undefined;
  Diary: undefined;
  Music: undefined;
  Profile: undefined;
  Psychologist: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Chat: { otherUserId: number; otherUserName: string };
  ReportViewer: { reportData: any; userName: string; reportId: number };
  PsychReportViewer: { report: any; patientName?: string };
};

export type DiaryStackParamList = {
  DiaryMain: undefined;
  DiaryEntry: { id?: number };
  EditDiaryEntry: { id: number };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
};

export type PsychologistStackParamList = {
  PsychologistList: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const DiaryStack = createStackNavigator<DiaryStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const PsychologistStack = createStackNavigator<PsychologistStackParamList>();

const DiaryStackScreen = () => (
  <DiaryStack.Navigator screenOptions={{ headerShown: false }}>
    <DiaryStack.Screen name="DiaryMain" component={DiaryScreen} />
    <DiaryStack.Screen name="DiaryEntry" component={DiaryEntryScreen} />
    <DiaryStack.Screen name="EditDiaryEntry" component={DiaryEntryScreen} />
  </DiaryStack.Navigator>
);

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
  </ProfileStack.Navigator>
);

const PsychologistStackScreen = () => (
  <PsychologistStack.Navigator screenOptions={{ headerShown: false }}>
    <PsychologistStack.Screen name="PsychologistList" component={PsychologistListScreen} />
  </PsychologistStack.Navigator>
);

const TAB_ICONS: Record<string, keyof typeof Feather.glyphMap> = {
  Tracker: 'activity',
  Comics: 'book-open',
  Diary: 'edit-3',
  Music: 'headphones',
  Psychologist: 'heart',
  Profile: 'user',
};

// Скрытие навбара
const DIARY_HIDDEN = new Set(['DiaryEntry', 'EditDiaryEntry']);

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Tracker"
    screenOptions={{ headerShown: false }}
    tabBar={(props) => (
      <FloatingTabBar {...props} icons={TAB_ICONS} hiddenRoutes={DIARY_HIDDEN} />
    )}
  >
    <Tab.Screen name="Tracker" component={TrackerScreen} />
    <Tab.Screen name="Comics" component={ComicsScreen} />
    <Tab.Screen name="Diary" component={DiaryStackScreen} />
    <Tab.Screen name="Music" component={MusicScreen} />
    <Tab.Screen name="Psychologist" component={PsychologistStackScreen} />
    <Tab.Screen name="Profile" component={ProfileStackScreen} />
  </Tab.Navigator>
);

export const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="MainTabs" component={MainTabs} />
    <MainStack.Screen name="Chat" component={ChatScreen} />
    <MainStack.Screen name="ReportViewer" component={ReportViewerScreen} />
    <MainStack.Screen name="PsychReportViewer" component={PsychReportViewerScreen} />
  </MainStack.Navigator>
);
