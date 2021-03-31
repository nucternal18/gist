import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions/index';
import { auth } from '../firebase/config';
import FeedScreen from './main/Feed';
import AddScreen from './main/Add';
import ProfileScreen from './main/Profile';
import Search from './main/Search';


const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return null
}


export const MainScreen = () => {
  const dispatch = useDispatch();

  const getUsers = useSelector((state) => state.userState);
  const { loading, currentUser, authenticated, error } = getUsers;

  const getUserPosts = useSelector((state) => state.userPost);
  const { loading: loadingPost, posts, error: postError } = getUserPosts;

  const getUserFollowing = useSelector((state) => state.userFollowing);
  const { following: followedUsers } = getUserFollowing;

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchUserPosts());
    dispatch(fetchUserFollowing());
  }, []);



  return (
    <Tab.Navigator
      initialRouteName='Feed'
      labeled={false}
      tabBarOptions={{
        activeTintColor: '#4c56b2',
      }}>
      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name='Search'
        component={Search}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='magnify' color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name='AddContainer'
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('Add');
          },
        })}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='plus-box' color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('Profile', {uid: auth.currentUser.uid });
          },
        })}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name='account-circle'
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  mainScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
