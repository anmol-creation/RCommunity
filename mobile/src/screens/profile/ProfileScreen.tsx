import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVisitor, setIsVisitor] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthService.getCurrentUser();

      if (currentUser && currentUser.verificationStatus) {
         const data = await UserService.getMyProfile();
         setProfile(data);
         setIsVisitor(false);
      } else {
         setIsVisitor(true);
         setProfile(null);
      }
    } catch (error) {
      console.log('Profile Load Error', error);
      setIsVisitor(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
      await AuthService.logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4DB6AC" />
      </View>
    );
  }

  if (isVisitor) {
      return (
          <View style={[styles.container, styles.center]}>
              <Text style={styles.text}>You are browsing as a Visitor.</Text>
              <Text style={styles.subtext}>Log in to create your Rider Profile.</Text>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
          </View>
      )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProfile} tintColor="#4DB6AC" />}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
             <View style={styles.avatar} />
             {profile?.verificationStatus === 'VERIFIED' && (
                 <View style={styles.verifiedBadge}>
                     <Text style={styles.verifiedText}>✓</Text>
                 </View>
             )}
        </View>
        <Text style={styles.name}>{profile?.displayName || 'Rider'}</Text>
        <Text style={styles.phone}>{profile?.phoneNumber}</Text>

        <View style={styles.followStats}>
            <View style={styles.followBox}>
                <Text style={styles.followCount}>{profile?._count?.following || 0}</Text>
                <Text style={styles.followLabel}>Following</Text>
            </View>
            <View style={styles.followBox}>
                <Text style={styles.followCount}>{profile?._count?.followedBy || 0}</Text>
                <Text style={styles.followLabel}>Followers</Text>
            </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { profile })}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
          <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile?.yearsExperience || 0}</Text>
              <Text style={styles.statLabel}>Years Exp</Text>
          </View>
          <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile?.vehicleType || 'N/A'}</Text>
              <Text style={styles.statLabel}>Vehicle</Text>
          </View>
          <View style={styles.statBox}>
              <Text style={styles.statValue}>{profile?._count?.posts || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
          </View>
      </View>

      <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platforms</Text>
          <View style={styles.tagsContainer}>
              {profile?.platforms && profile.platforms.length > 0 ? (
                  profile.platforms.map((p: string, i: number) => (
                      <View key={i} style={styles.tag}>
                          <Text style={styles.tagText}>{p}</Text>
                      </View>
                  ))
              ) : (
                  <Text style={styles.emptyText}>No platforms added yet.</Text>
              )}
          </View>
      </View>

      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Guidelines')}>
          <Text style={styles.linkText}>Community Guidelines</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarContainer: {
      position: 'relative',
      marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
  },
  verifiedBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#4DB6AC',
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#1E1E1E',
  },
  verifiedText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 14,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  phone: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  followStats: {
      flexDirection: 'row',
      marginVertical: 10,
  },
  followBox: {
      alignItems: 'center',
      marginHorizontal: 15,
  },
  followCount: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
  },
  followLabel: {
      color: '#888',
      fontSize: 12,
  },
  editButton: {
      marginTop: 10,
      paddingHorizontal: 20,
      paddingVertical: 8,
      backgroundColor: '#333',
      borderRadius: 20,
  },
  editButtonText: {
      color: '#FFF',
  },
  statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
  },
  statBox: {
      alignItems: 'center',
  },
  statValue: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
  },
  statLabel: {
      color: '#888',
      fontSize: 12,
  },
  section: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#333',
  },
  sectionTitle: {
      color: '#4FA5F5',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  tag: {
      backgroundColor: '#2C2C2C',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
      marginRight: 10,
      marginBottom: 5,
  },
  tagText: {
      color: '#DDD',
  },
  text: {
      color: '#FFF',
      fontSize: 18,
      marginBottom: 10,
  },
  subtext: {
      color: '#888',
      marginBottom: 20,
  },
  button: {
      backgroundColor: '#4DB6AC',
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 25,
  },
  buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
  },
  emptyText: {
      color: '#666',
      fontStyle: 'italic',
  },
  logoutButton: {
      margin: 20,
      padding: 15,
      backgroundColor: '#C62828',
      borderRadius: 8,
      alignItems: 'center',
  },
  logoutText: {
      color: '#FFF',
      fontWeight: 'bold',
  },
  linkButton: {
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 15,
      backgroundColor: '#333',
      borderRadius: 8,
      alignItems: 'center',
  },
  linkText: {
      color: '#4FA5F5',
      fontWeight: 'bold',
  },
});

export default ProfileScreen;
