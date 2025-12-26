import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FeedService } from '../../services/feed.service';
import { AuthService } from '../../services/auth.service';

const CommentsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { postId } = route.params as { postId: string };

  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
    fetchComments();
  }, []);

  const loadUser = async () => {
      const u = await AuthService.getCurrentUser();
      setUser(u);
  };

  const fetchComments = async () => {
    try {
      const data = await FeedService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!user || user.verificationStatus !== 'VERIFIED') {
        Alert.alert('Restricted', 'Only verified riders can comment.');
        return;
    }

    try {
      setSubmitting(true);
      await FeedService.addComment(postId, newComment);
      setNewComment('');
      fetchComments(); // Refresh list
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <View style={styles.avatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
            <Text style={styles.authorName}>{item.author.displayName || 'Rider'}</Text>
            {item.author.verificationStatus === 'VERIFIED' && <Text style={styles.verifiedCheck}>✓</Text>}
            <Text style={styles.timeAgo}>• {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#4DB6AC" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No comments yet.</Text>}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={user?.verificationStatus === 'VERIFIED' ? "Add a comment..." : "Only verified riders can comment"}
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
            editable={user?.verificationStatus === 'VERIFIED'}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!newComment.trim() || submitting) && styles.sendButtonDisabled]}
            onPress={handlePostComment}
            disabled={!newComment.trim() || submitting}
          >
            <Text style={styles.sendButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    padding: 15,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
  },
  authorName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5,
  },
  verifiedCheck: {
      color: '#4DB6AC',
      fontSize: 12,
      marginRight: 5,
  },
  timeAgo: {
      color: '#888',
      fontSize: 12,
  },
  commentText: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#121212',
    color: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonDisabled: {
      opacity: 0.5,
  },
  sendButtonText: {
    color: '#4DB6AC',
    fontWeight: 'bold',
  },
});

export default CommentsScreen;
