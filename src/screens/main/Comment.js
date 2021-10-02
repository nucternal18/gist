import React, { useState, useEffect } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { projectFirestore, auth, timestamp } from '../../firebase/config';
import { icons, COLORS } from '../../constants';

const CommentScreen = (props) => {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
    const [message, setMessage] = useState('');
    
     const getUsersState = useSelector((state) => state.usersState);
     const { users, usersFollowingLoaded } = getUsersState;

    useEffect(() => {
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
              
          }
      }
    if (props.route.params.postId !== postId) {
      projectFirestore
        .collection('post')
        .doc(props.route.params.uid)
        .collection('userPosts')
        .doc(props.route.params.postId)
        .collection('comments')
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setComments(comments);
        });
      setPostId(props.route.params.postId);
    }
  }, [props.route.params.postId]);

    const onCommentSend = () => {
        projectFirestore
          .collection('post')
          .doc(props.route.params.uid)
          .collection('userPosts')
          .doc(props.route.params.postId)
          .collection('comments').add({ creator: auth.currentUser.uid, message});
    }
  return (
    <View style={{ paddingHorizontal: 10 }}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => `${index} ${item.id}`}
        ListHeaderComponent={
          <View
            style={{
              flex: 1,
              marginTop: 50,
              marginBottom: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 35,
                width: 35,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: COLORS.transparentBlack3,
                backgroundColor: COLORS.blue,
              }}
              onPress={() => props.navigation.goBack()}>
              <Image
                source={icons.back}
                style={{ width: 15, height: 15, tintColor: '#F5F6FB' }}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 16, color: COLORS.blue, marginLeft: 5 }}>
              Go Back
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingVertical: 10 }}>
            <Text style={{ color: COLORS.black}}>{item.message}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={{ marginVertical: 10 }}>
            <TextInput
              label='comment'
              placeholder='comment...'
              onChangeText={(message) => setMessage(message)}
            />
            <Button
              mode='contained'
              style={{ marginTop: 10 }}
              onPress={() => onCommentSend()}>
              Send
            </Button>
          </View>
        }
      />
    </View>
  );
};

export default CommentScreen;
