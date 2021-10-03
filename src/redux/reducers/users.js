import {
  USER_STATE_CHANGE_REQUEST,
  USER_STATE_CHANGE_SUCCESS,
  USER_STATE_CHANGE_FAIL,
  USER_STATE_CHANGE_RESET,
  USER_POST_STATE_CHANGE_REQUEST,
  USER_POST_STATE_CHANGE_SUCCESS,
  USER_POST_STATE_CHANGE_FAIL,
  USERS_POSTS_STATE_CHANGE_REQUEST,
  USERS_POSTS_STATE_CHANGE_SUCCESS,
  USERS_POSTS_STATE_CHANGE_FAIL,
  USERS_DATA_STATE_CHANGE_REQUEST,
  USERS_DATA_STATE_CHANGE_SUCCESS,
  USERS_DATA_STATE_CHANGE_FAIL,
  USER_FOLLOWING_STATE_CHANGE_REQUEST,
  USER_FOLLOWING_STATE_CHANGE_SUCCESS,
  USER_FOLLOWING_STATE_CHANGE_FAIL,
  USERS_LIKES_STATE_CHANGE_REQUEST,
  USERS_LIKES_STATE_CHANGE_SUCCESS,
  USERS_LIKES_STATE_CHANGE_FAIL,
} from '../constants/userConstants';

const initialState = {
  users: [],
  feeds: [],
  usersFollowingLoaded: 0,
  currentUser: {},
  posts: [],
  following: [],
  loading: false,
  authenticated: false,
  error: null,
};

export const fetchUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USER_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentUser: action.payload,
        authenticated: true,
      };
    case USER_STATE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        authenticated: false,
      };
    case USER_STATE_CHANGE_RESET:
      return initialState;
    default:
      return state;
  }
};

export const fetchUserPostReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_POST_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USER_POST_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case USER_POST_STATE_CHANGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export const fetchUserFollowingReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_FOLLOWING_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USER_FOLLOWING_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        following: action.payload,
      };
    case USER_FOLLOWING_STATE_CHANGE_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export const fetchUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USERS_POSTS_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USERS_LIKES_STATE_CHANGE_REQUEST:
      return { ...state, loading: true };
    case USERS_DATA_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
      };
    case USERS_POSTS_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        usersFollowingLoaded: state.usersFollowingLoaded + 1,
        feeds: [...state.feeds].concat(action.payload.posts),
      };
    case USERS_LIKES_STATE_CHANGE_SUCCESS:
      return {
        ...state,
        loading: false,
        feeds: state.feeds.map((post) =>
          post.id === action.payload.postId
            ? { ...post, currentUserLike: action.payload.currentUserLike }
            : post
        ),
      };
    case USERS_DATA_STATE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USERS_POSTS_STATE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case USERS_LIKES_STATE_CHANGE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
