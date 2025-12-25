import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>R Community Feed</Text>
      <Text style={styles.subtext}>Welcome, Rider!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#bbb',
    marginTop: 10,
  }
});

export default FeedScreen;
