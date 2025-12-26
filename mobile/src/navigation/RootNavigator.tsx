import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import CommentsScreen from '../screens/home/CommentsScreen';
import GuidelinesScreen from '../screens/profile/GuidelinesScreen';

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
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
            headerShown: true,
            title: 'Edit Profile',
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#FFF'
        }}
      />
      <Stack.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
            headerShown: true,
            title: 'Comments',
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#FFF'
        }}
      />
      <Stack.Screen
        name="Guidelines"
        component={GuidelinesScreen}
        options={{
            headerShown: true,
            title: 'Community Guidelines',
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#FFF'
        }}
      />
    </Stack.Navigator>
  );
};
