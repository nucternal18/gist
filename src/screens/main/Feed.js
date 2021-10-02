import React, { useEffect, useState } from 'react';
import { Card,  Paragraph, Button } from 'react-native-paper';
import { StyleSheet, View, FlatList} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

export default function MainScreen({navigation}) {

  const [posts, setPosts] = useState([]);

  console.log(posts);
  const getUsers = useSelector((state) => state.userState);
  const { loading, currentUser, authenticated, error } = getUsers;

  const getUsersState = useSelector((state) => state.usersState);
  const { users, usersFollowingLoaded } = getUsersState;

  const getUserFollowing = useSelector((state) => state.userFollowing);
  const { following } = getUserFollowing;

  useEffect(() => {
    let getPosts = [];
    if (usersFollowingLoaded == following.length) {
      for (let i = 0; i < following.length; i++) {
        const user = users.find((el) => el.uid === following[i]);
        if (user !== undefined) {
          getPosts = [...getPosts].concat(user.posts);
        }
      }

      posts.sort((x, y) => {
        return x.creation - y.creation;
      });
      setPosts(getPosts);
    }
  }, [usersFollowingLoaded]);

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
              <Card.Actions>
                <Button
                  onPress={() =>
                    navigation.navigate('Comment', {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }>
                  View Comments...
                </Button>
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
});
