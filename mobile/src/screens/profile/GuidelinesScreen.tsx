import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const GuidelinesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Community Guidelines</Text>
      <Text style={styles.intro}>
        R Community is a dedicated space for delivery riders. To keep this space safe and helpful, please follow these rules.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Respect Fellow Riders</Text>
        <Text style={styles.text}>
          Treat everyone with respect. Harassment, hate speech, and bullying are strictly prohibited.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. No Illegal Content</Text>
        <Text style={styles.text}>
          Do not share illegal content or encourage illegal activities.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Privacy First</Text>
        <Text style={styles.text}>
          Do not share personal information (phone numbers, addresses) of customers or other riders without consent.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Honest Representation</Text>
        <Text style={styles.text}>
          Do not impersonate others. Use your real rider identity.
        </Text>
      </View>

      <Text style={styles.footer}>
        Violating these guidelines may result in a permanent ban.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  intro: {
    color: '#BBB',
    fontSize: 16,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#4FA5F5',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    color: '#C62828',
    marginTop: 20,
    fontStyle: 'italic',
    marginBottom: 40,
  },
});

export default GuidelinesScreen;
