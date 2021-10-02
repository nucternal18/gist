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
  USERS_POSTS_STATE_CHANGE_REQUEST,
  USERS_POSTS_STATE_CHANGE_SUCCESS,
  USERS_POSTS_STATE_CHANGE_FAIL,
  USERS_DATA_STATE_CHANGE_REQUEST,
  USERS_DATA_STATE_CHANGE_SUCCESS,
  USERS_DATA_STATE_CHANGE_FAIL,
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
      payload: { error, message: 'No post exist' },
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
          for (let i = 0; i < following.length; i++) {
            dispatch(fetchUsersData(following[i], true));
          }
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
      payload: { error, message: 'No followers exist' },
    });
  }
};

export const fetchUsersData = (uid, getPosts) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USERS_DATA_STATE_CHANGE_REQUEST,
    });
    const found = getState().usersState.users.some((el) => el.uid === uid);
    if (!found) {
      await projectFirestore
        .collection('users')
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let user = snapshot.data();
            user.uid = snapshot.id;
            dispatch({
              type: USERS_DATA_STATE_CHANGE_SUCCESS,
              payload: user,
            });
          } else {
            dispatch({
              type: USER_STATE_CHANGE_FAIL,
              payload: { message: 'User does nor exist' },
            });
          }
          if (getPosts) {
            dispatch(fetchUsersFollowingPosts(user.uid));
          }
        });
    }
  } catch (error) {
    dispatch({
      type: USERS_DATA_STATE_CHANGE_FAIL,
      payload: error,
    });
  }
};

export const fetchUsersFollowingPosts = (uid) => async (dispatch, getState) => {
  try {
    dispatch({
      type: USERS_POSTS_STATE_CHANGE_REQUEST,
    });

    projectFirestore
      .collection('post')
      .doc(uid)
      .collection('userPosts')
      .orderBy('createdAt', 'asc')
      .get()
      .then((snapshot) => {
        const uid = snapshot.docs[0].ref.path.split('/')[1];

        const user = getState().usersState.users.find((el) => el.uid === uid);
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data, user };
        });

        if (posts) {
          dispatch({
            type: USERS_POSTS_STATE_CHANGE_SUCCESS,
            payload: { posts, uid },
          });
        } else {
          dispatch({
            type: USERS_POSTS_STATE_CHANGE_FAIL,
            payload: { message: 'No post exist' },
          });
        }
      });
  } catch (error) {
    dispatch({
      type: USERS_POSTS_STATE_CHANGE_FAIL,
      payload: { error, message: 'No post exist' },
    });
  }
};

export const logoutHandler = () => async (dispatch) => {
  dispatch({
    type: USER_STATE_CHANGE_RESET,
  });
};
