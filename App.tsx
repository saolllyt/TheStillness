import React from 'react';
import { LogBox, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { EmotionProvider } from './src/context/EmotionContext';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { OfflineBanner } from './src/components/common/OfflineBanner';

LogBox.ignoreLogs(['expo-notifications: Android Push notifications']);

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <EmotionProvider>
            <View style={styles.container}>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
              <OfflineBanner />
            </View>
          </EmotionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
