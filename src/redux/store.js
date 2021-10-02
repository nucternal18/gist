import { combineReducers } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  fetchUserReducer,
  fetchUserPostReducer,
  fetchUserFollowingReducer,
  fetchUsersReducer,
} from './reducers/users';

const Reducers = combineReducers({
  userState: fetchUserReducer,
  userPost: fetchUserPostReducer,
  userFollowing: fetchUserFollowingReducer,
  usersState: fetchUsersReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  Reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
