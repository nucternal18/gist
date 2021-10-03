import React, { useEffect, useState } from 'react';
import { Card, Paragraph, Button } from 'react-native-paper';
import { StyleSheet, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { projectFirestore, auth } from '../../firebase/config';

export default function MainScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const getUsersState = useSelector((state) => state.usersState);
  const { feeds, usersFollowingLoaded } = getUsersState;

  const getUserFollowing = useSelector((state) => state.userFollowing);
  const { following } = getUserFollowing;

  useEffect(() => {
    let updatedPost = [];
    if (usersFollowingLoaded == following.length && following.length !== 0) {
      feeds.sort((x, y) => {
        return x.creation - y.creation;
      });
      setPosts(feeds);
    }
  }, [usersFollowingLoaded, feeds]);

  const onLikePress = (userId, postId) => {
    projectFirestore
      .collection('post')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(auth.currentUser.uid)
      .set({});
  };
  const onDislikePress = (userId, postId) => {
    projectFirestore
      .collection('post')
      .doc(userId)
      .collection('userPosts')
      .doc(postId)
      .collection('likes')
      .doc(auth.currentUser.uid)
      .delete();
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.galleryContainer}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => `${index} ${item.id}`}
          ListHeaderComponent={<View style={{ marginTop: 50 }} />}
          renderItem={({ item }) => (
            <Card style={styles.imageContainer}>
              <Card.Cover
                style={styles.image}
                source={{ uri: item.downloadURL }}
                resizeMode='contain'
              />
              <Card.Content>
                <Paragraph style={styles.paragraph}>
                  {item.user?.fullName}
                </Paragraph>
              </Card.Content>
              <Card.Actions style={styles.actionContainer}>
                <Button
                  onPress={() =>
                    navigation.navigate('Comment', {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }>
                  View Comments...
                </Button>
                {item.currentUserLike ? (
                  <Button
                    onPress={() => onDislikePress(item.user.uid, item.id)}>
                    Dislike
                  </Button>
                ) : (
                  <Button onPress={() => onLikePress(item.user.uid, item.id)}>
                    Like
                  </Button>
                )}
              </Card.Actions>
            </Card>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  paragraph: {
    paddingTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  galleryContainer: {
    flex: 1,
    padding: 10,
  },
  image: { flex: 1 },
  imageContainer: {
    flex: 1 / 3,
    marginBottom: 10,
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
