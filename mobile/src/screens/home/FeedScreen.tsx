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
  const [sortBy, setSortBy] = useState<'latest' | 'trending'>('latest');
  const [hashtag, setHashtag] = useState<string | undefined>(undefined);
  const navigation = useNavigation();

  // Load user data on focus (in case login status changes)
  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  // Reload feed on focus or sort change
  useFocusEffect(
      useCallback(() => {
        fetchFeed();
      }, [sortBy, hashtag])
  );

  const loadUser = async () => {
    const currentUser = await AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await FeedService.getFeed(1, sortBy, hashtag);
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

  const handleHashtagPress = (tag: string) => {
      setHashtag(tag);
      Alert.alert('Hashtag Filter', `Showing posts for #${tag}`, [
          { text: 'Clear Filter', onPress: () => setHashtag(undefined) },
          { text: 'OK' }
      ]);
  };

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

      <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, sortBy === 'latest' && styles.activeTab]}
            onPress={() => setSortBy('latest')}
          >
              <Text style={[styles.tabText, sortBy === 'latest' && styles.activeTabText]}>Latest</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, sortBy === 'trending' && styles.activeTab]}
            onPress={() => setSortBy('trending')}
          >
              <Text style={[styles.tabText, sortBy === 'trending' && styles.activeTabText]}>Trending</Text>
          </TouchableOpacity>
      </View>

      {hashtag && (
          <View style={styles.filterBanner}>
              <Text style={styles.filterText}>Filtering by: #{hashtag}</Text>
              <TouchableOpacity onPress={() => setHashtag(undefined)}>
                  <Text style={styles.clearFilterText}>Clear</Text>
              </TouchableOpacity>
          </View>
      )}

      {loading ? (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#4DB6AC" />
        </View>
      ) : (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <PostItem
                    post={item}
                    onLike={handleLike}
                    onComment={handleComment}
                    onHashtagPress={handleHashtagPress}
                />
            )}
            contentContainerStyle={styles.listContent}
            refreshing={loading}
            onRefresh={fetchFeed}
            ListEmptyComponent={
                <View style={styles.center}>
                    <Text style={styles.emptyText}>No posts found.</Text>
                </View>
            }
        />
      )}

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
  tabContainer: {
      flexDirection: 'row',
      backgroundColor: '#1E1E1E',
      borderBottomWidth: 1,
      borderBottomColor: '#333',
  },
  tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
  },
  activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: '#4DB6AC',
  },
  tabText: {
      color: '#888',
      fontWeight: 'bold',
  },
  activeTabText: {
      color: '#4DB6AC',
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
  filterBanner: {
      backgroundColor: '#333',
      padding: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  filterText: {
      color: '#4FA5F5',
      fontWeight: 'bold',
  },
  clearFilterText: {
      color: '#BBB',
      textDecorationLine: 'underline',
  }
});

export default FeedScreen;
