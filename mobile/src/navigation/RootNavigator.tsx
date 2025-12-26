import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import CreatePostScreen from '../screens/home/CreatePostScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  // TODO: Check auth state to determine initial route
  const isAuthenticated = false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/* Always start with Auth Stack, but allow skipping to AppTabs via Visitor mode */}
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="AppTabs" component={AppTabs} />

      {/* Modals or Global Screens */}
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
};
