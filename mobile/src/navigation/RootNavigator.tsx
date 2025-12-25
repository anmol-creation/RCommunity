import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  // TODO: Check auth state to determine initial route
  const isAuthenticated = false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/* Always start with Auth Stack, but allow skipping to AppTabs via Visitor mode */}
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
};
