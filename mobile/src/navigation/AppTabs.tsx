import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/home/FeedScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder screens
const ExploreScreen = () => <View style={{flex:1, backgroundColor:'#121212'}}><Text style={{color:'white'}}>Explore</Text></View>;
const ProfileScreen = () => <View style={{flex:1, backgroundColor:'#121212'}}><Text style={{color:'white'}}>Profile</Text></View>;

export const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1E1E1E' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#1E1E1E', borderTopColor: '#333' },
        tabBarActiveTintColor: '#4FA5F5',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen name="Home" component={FeedScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
