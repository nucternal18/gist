import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Image, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logoutHandler } from '../../redux/actions';
import { projectFirestore, auth, timestamp } from '../../firebase/config';

export default function ProfileScreen(props) {
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [follow, setFollow] = useState(false);

  const getUsers = useSelector((state) => state.userState);
  const { loading, currentUser, authenticated, error } = getUsers;

  const getUserPosts = useSelector((state) => state.userPost);
  const { loading: loadingPost, posts, error: postError } = getUserPosts;

  const getUserFollowing = useSelector((state) => state.userFollowing);
  const { following } = getUserFollowing;

  console.log(following);

  useEffect(() => {
    if (props.route.params.uid === auth.currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      projectFirestore
        .collection('users')
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          }
        });
      projectFirestore
        .collection('post')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .orderBy('createdAt', 'asc')
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (following.indexOf(props.route.params.uid) > -1) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [props.route.params.uid, following]);

  const onFollow = () => {
    projectFirestore
      .collection('following')
      .doc(auth.currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnFollow = () => {
    projectFirestore
      .collection('following')
      .doc(auth.currentUser.uid)
      .collection('userFollowing')
      .doc(props.route.params.uid)
      .delete();
  };

  const logout = () => {
    dispatch(logoutHandler());
  };
  if (user === null) {
    return <View />;
  }
  return (
    <View style={styles.profileContainer}>
      <View style={styles.infoContainer}>
        {!!user && (
          <>
            <Text>{user.fullName}</Text>
            <Text>{user.email}</Text>
          </>
        )}
        {props.route.params.uid !== auth.currentUser.uid ? (
          <View>
            {follow ? (
              <TouchableOpacity
                onPress={() => onUnfollow()}
                style={styles.button}>
                <Text style={styles.buttonText}>Following</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onFollow()}
                style={styles.button}>
                <Text style={styles.buttonText}>Follow</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View />
        )}
      </View>
      <View style={styles.galleryContainer}>
        {!!userPosts && (
          <FlatList
            numColumns={3}
            horizontal={false}
            data={userPosts}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: item.downloadURL }}
                />
              </View>
            )}
          />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => logout()} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
  },
  infoContainer: {
    margin: 20,
  },
  buttonContainer: {
    flex: 0.5,
  },
  galleryContainer: {
    flex: 1,
  },
  image: { flex: 1, aspectRatio: 1 / 1 },
  imageContainer: {
    flex: 1 / 3,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});
