import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FeedService } from '../../services/feed.service';

const CreatePostScreen = () => {
  const navigation = useNavigation();

  // No longer need userId from params, it's handled via header
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    try {
      setSubmitting(true);
      // Removed userId arg
      await FeedService.createPost(content);
      Alert.alert('Success', 'Post created successfully');
      navigation.goBack();
    } catch (error: any) {
        console.error(error);
      const msg = error.response?.data?.message || 'Failed to create post';
      Alert.alert('Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
             <ActivityIndicator size="small" color="#4DB6AC" />
          ) : (
             <Text style={styles.postText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What's happening on the road?"
        placeholderTextColor="#888"
        multiline
        autoFocus
        value={content}
        onChangeText={setContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#AAA',
    fontSize: 16,
  },
  postText: {
    color: '#4DB6AC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    color: '#FFF',
    fontSize: 18,
    textAlignVertical: 'top',
    height: 200,
    padding: 10,
  },
});

export default CreatePostScreen;
