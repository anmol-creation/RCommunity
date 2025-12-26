import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FeedService } from '../../services/feed.service';
import { AuthService } from '../../services/auth.service';
import { PostItem, Post } from './PostItem';

const FeedScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigation = useNavigation();

  // Load user data on focus (in case login status changes)
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  // Reload feed on focus to get fresh likes/comments counts
  useFocusEffect(
      useCallback(() => {
        fetchFeed();
      }, [])
  );

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const fetchFeed = async () => {
    try {
      // Don't set loading true on refresh to avoid flickering if we just want to update data
      // setLoading(true);
      const data = await FeedService.getFeed();
      setPosts(data);
    } catch (error) {
      console.log('Error loading feed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    if (!user) {
      Alert.alert('Restricted', 'Please login to post.');
      return;
    }

    if (user.verificationStatus !== 'VERIFIED') {
        Alert.alert('Verification Required', 'Only verified riders can post.');
        return;
    }

    navigation.navigate('CreatePost');
  };

  const handleLike = async (postId: string) => {
    if (!user || user.verificationStatus !== 'VERIFIED') {
        Alert.alert('Restricted', 'Only verified riders can like posts.');
        return;
    }

    // Optimistic Update
    setPosts(currentPosts =>
        currentPosts.map(p => {
            if (p.id === postId) {
                const wasLiked = p.likedByMe;
                return {
                    ...p,
                    likedByMe: !wasLiked,
                    _count: {
                        ...p._count,
                        likes: wasLiked ? p._count.likes - 1 : p._count.likes + 1
                    }
                };
            }
            return p;
        })
    );

    try {
        await FeedService.toggleLike(postId);
    } catch (error) {
        // Revert on error
        fetchFeed();
        Alert.alert('Error', 'Failed to update like');
    }
  };

  const handleComment = (post: Post) => {
      navigation.navigate('Comments', { postId: post.id });
  };

  if (loading && posts.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  const canPost = user?.verificationStatus === 'VERIFIED';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
         <Text style={styles.headerTitle}>R Community</Text>
         {user && (
            <View style={styles.userInfo}>
                <Text style={styles.userText}>{user.displayName || 'User'}</Text>
                <Text style={[styles.userStatus, { color: canPost ? '#4DB6AC' : '#FFAB40' }]}>
                    {canPost ? 'Verified' : 'Visitor/Unverified'}
                </Text>
            </View>
         )}
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <PostItem
                post={item}
                onLike={handleLike}
                onComment={handleComment}
            />
        )}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => { setLoading(true); fetchFeed(); }}
        ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
            </View>
        }
      />

      {/* Floating Action Button for Posting - Only show if verified */}
      {canPost && (
        <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
            <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
      alignItems: 'flex-end',
  },
  userText: {
      color: '#FFF',
      fontSize: 12,
  },
  userStatus: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  listContent: {
    padding: 10,
  },
  emptyText: {
    color: '#888',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4DB6AC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default FeedScreen;
