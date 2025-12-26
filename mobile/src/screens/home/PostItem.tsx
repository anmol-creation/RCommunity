import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserService } from '../../services/user.service';
import { ReportService } from '../../services/report.service';
import { HashtagParser } from '../../utils/HashtagParser';

interface Author {
  id: string;
  displayName: string | null;
  verificationStatus: string;
}

export interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author: Author;
  likedByMe?: boolean;
  isFollowing?: boolean;
  _count: {
    likes: number;
    comments: number;
  };
}

interface PostItemProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (post: Post) => void;
  onHashtagPress?: (tag: string) => void;
}

export const PostItem: React.FC<PostItemProps> = ({ post, onLike, onComment, onHashtagPress }) => {

  const handleFollow = async () => {
      try {
          await UserService.followUser(post.author.id);
          Alert.alert('Success', `You are now following ${post.author.displayName}`);
      } catch (e) {
          Alert.alert('Error', 'Could not follow user (or already following)');
      }
  };

  const handleReport = () => {
      Alert.alert(
          'Report Post',
          'Why are you reporting this post?',
          [
              { text: 'Spam', onPress: () => submitReport('Spam') },
              { text: 'Harassment', onPress: () => submitReport('Harassment') },
              { text: 'Inappropriate Content', onPress: () => submitReport('Inappropriate') },
              { text: 'Cancel', style: 'cancel' }
          ]
      );
  };

  const submitReport = async (reason: string) => {
      try {
          await ReportService.createReport({ postId: post.id, reason });
          Alert.alert('Thank You', 'We have received your report and will review it shortly.');
      } catch (e) {
          Alert.alert('Error', 'Failed to submit report.');
      }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{post.author.displayName || 'Rider'}</Text>
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationText}>
              {post.author.verificationStatus === 'VERIFIED' ? 'Verified Rider' : 'Visitor'}
            </Text>
          </View>
        </View>

        {/* Follow Button */}
        {!post.isFollowing && post.author.verificationStatus === 'VERIFIED' && (
            <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
                <Text style={styles.followText}>+ Follow</Text>
            </TouchableOpacity>
        )}
      </View>

      {/* Content with Hashtags */}
      <HashtagParser
        text={post.content}
        style={styles.content}
        onHashtagPress={onHashtagPress}
      />

      {post.imageUrl && (
        <View style={styles.imagePlaceholder}>
           <Text style={{color: '#fff'}}>Image Placeholder</Text>
        </View>
      )}

      {/* Footer (Interactions) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike && onLike(post.id)}>
          <Text style={[styles.actionText, post.likedByMe && styles.likedText]}>
             {post.likedByMe ? '👍 Liked' : '👍 Like'} {post._count.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => onComment && onComment(post)}>
          <Text style={styles.actionText}>💬 Comment {post._count.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleReport}>
          <Text style={[styles.actionText, styles.reportText]}>🚩 Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  verificationBadge: {
    backgroundColor: '#004D40',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  verificationText: {
    color: '#4DB6AC',
    fontSize: 10,
    fontWeight: 'bold',
  },
  followButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: '#4FA5F5',
      borderRadius: 15,
  },
  followText: {
      color: '#4FA5F5',
      fontSize: 12,
      fontWeight: 'bold',
  },
  timeAgo: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    color: '#EEE',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    color: '#BBB',
    fontSize: 14,
    marginLeft: 5,
  },
  likedText: {
      color: '#4DB6AC',
      fontWeight: 'bold',
  },
  reportText: {
      color: '#C62828',
      fontSize: 12
  }
});
