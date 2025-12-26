import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Author {
  id: string;
  displayName: string | null;
  verificationStatus: string;
}

interface Post {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  author: Author;
  _count: {
    likes: number;
    comments: number;
  };
}

interface PostItemProps {
  post: Post;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
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
        <Text style={styles.timeAgo}>Just now</Text>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {post.imageUrl && (
        <View style={styles.imagePlaceholder}>
           <Text style={{color: '#fff'}}>Image Placeholder</Text>
        </View>
      )}

      {/* Footer (Interactions) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>👍 {post._count.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {post._count.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Share</Text>
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
  },
  actionText: {
    color: '#BBB',
    fontSize: 14,
    marginLeft: 5,
  },
});
