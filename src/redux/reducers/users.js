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

export const fetchUserReducer = (state = { currentUser: {} }, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE_REQUEST:
      return { loading: true };
    case USER_STATE_CHANGE_SUCCESS:
      return {
        loading: false,
        currentUser: action.payload,
        authenticated: true,
      };
    case USER_STATE_CHANGE_FAIL:
      return { loading: false, error: action.payload, authenticated: false };
    case USER_STATE_CHANGE_RESET:
      return { currentUser: {}, authenticated: false };
    default:
      return state;
  }
};

export const fetchUserPostReducer = (state = { posts: [] }, action) => {
  switch (action.type) {
    case USER_POST_STATE_CHANGE_REQUEST:
      return { loading: true };
    case USER_POST_STATE_CHANGE_SUCCESS:
      return {
        loading: false,
        posts: action.payload,
      };
    case USER_POST_STATE_CHANGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const fetchUserFollowingReducer = (state = { following: [] }, action) => {
  switch (action.type) {
    case USER_FOLLOWING_STATE_CHANGE_REQUEST:
      return { loading: true };
    case USER_FOLLOWING_STATE_CHANGE_SUCCESS:
      return {
        loading: false,
        following: action.payload,
      };
    case USER_FOLLOWING_STATE_CHANGE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
