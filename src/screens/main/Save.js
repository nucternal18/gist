import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Button,
  Image,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/actions/index';

import { projectFirestore, projectStorage, auth, timestamp } from '../../firebase/config';

export default function Screen(props) {
    const dispatch = useDispatch();
    const uri = props.route.params.image;
    const [caption, setCaption] = useState('');
    const getUsers = useSelector((state) => state.userState);
    const { loading, currentUser, authenticated, error } = getUsers;
    console.log(currentUser)
    useEffect(() => {
      dispatch(fetchUser());
    }, []);

    const savePostDate = (downloadURL) => {
        projectFirestore.collection('post').doc(currentUser.id).collection('userPosts').add({
            downloadURL,
            caption,
            createdAt: timestamp()
        }).then(() => {
            props.navigation.popToTop()
        })
    }

  const upLoadImage = async () => {
    const randomRef = Math.random().toString(15);
      const path = `post/${auth.currentUser.uid}/${randomRef}`;
     
    const response = await fetch(uri);
    const blob = await response.blob();

    const task = projectStorage.ref().child(path).put(blob);
    const taskProgress = (snapshot) => {
      console.log(`Transferred: ${snapshot.bytesTransferred}`);
    };
    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
          savePostDate(snapshot);
      });
    };
    const taskError = (snapshot) => {
      console.log(snapshot);
    };
    task.on('state_changed', taskProgress, taskError, taskCompleted);
  };
    
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: uri }} />
      </View>
      <TextInput
        placeholder='Write a caption . . .'
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title='Save' onPress={upLoadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
});
