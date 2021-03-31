import {
  USER_STATE_CHANGE_REQUEST,
  USER_STATE_CHANGE_SUCCESS,
  USER_STATE_CHANGE_FAIL,
  USER_STATE_CHANGE_RESET,
  USER_POST_STATE_CHANGE_REQUEST,
  USER_POST_STATE_CHANGE_SUCCESS,
  USER_POST_STATE_CHANGE_FAIL,
  USER_FOLLOWING_STATE_CHANGE_REQUEST,
  USER_FOLLOWING_STATE_CHANGE_SUCCESS,
  USER_FOLLOWING_STATE_CHANGE_FAIL,
} from '../constants/userConstants';
import { auth, projectFirestore } from '../../firebase/config';

export const fetchUser = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_STATE_CHANGE_REQUEST,
    });

    await projectFirestore
      .collection('users')
      .doc(auth.currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          dispatch({
            type: USER_STATE_CHANGE_SUCCESS,
            payload: snapshot.data(),
          });
        } else {
          dispatch({
            type: USER_STATE_CHANGE_FAIL,
            payload: { message: 'User does nor exist' },
          });
        }
      });
  } catch (error) {
    dispatch({
      type: USER_STATE_CHANGE_FAIL,
      payload: { error, message: 'User does not exist' },
    });
  }
};

export const fetchUserPosts = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_POST_STATE_CHANGE_REQUEST,
    });

    projectFirestore
      .collection('post')
      .doc(auth.currentUser.uid)
      .collection('userPosts')
      .orderBy('createdAt', 'asc')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        if (posts) {
          dispatch({
            type: USER_POST_STATE_CHANGE_SUCCESS,
            payload: posts,
          });
        } else {
          dispatch({
            type: USER_POST_STATE_CHANGE_FAIL,
            payload: { message: 'No post exist' },
          });
        }
      });
  } catch (error) {
    dispatch({
      type: USER_POST_STATE_CHANGE_FAIL,
      payload: { error, message: 'User does nor exist' },
    });
  }
};

export const fetchUserFollowing = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_FOLLOWING_STATE_CHANGE_REQUEST,
    });

    projectFirestore
      .collection('following')
      .doc(auth.currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id;
        });
        if (following) {
          dispatch({
            type: USER_FOLLOWING_STATE_CHANGE_SUCCESS,
            payload: following,
          });
        } else {
          dispatch({
            type: USER_FOLLOWING_STATE_CHANGE_FAIL,
            payload: { message: 'No followers exist' },
          });
        }
      });
  } catch (error) {
    dispatch({
      type: USER_FOLLOWING_STATE_CHANGE_FAIL,
      payload: { error, message: 'User does nor exist' },
    });
  }
};

export const logoutHandler = () => async (dispatch) => {
  await auth.signOut();
  dispatch({
    type: USER_STATE_CHANGE_RESET,
  });
};
