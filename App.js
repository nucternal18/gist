import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';

import { auth, projectFirestore } from './src/firebase/config';
import store from './src/redux/store';

// Screens
import { LandingScreen } from './src/screens/auth/LandingScreen';
import { RegisterScreen } from './src/screens/auth/RegisterScreen';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { MainScreen } from './src/screens/MainScreen';
import AddScreen from './src/screens/main/Add';
import SaveScreen from './src/screens/main/Save';
import CommentScreen from './src/screens/main/Comment';
// import { decode, encode } from 'base-64';

// if (!global.btoa) {
//   global.btoa = encode;
// }
// if (!global.atob) {
//   global.atob = decode;
// }

const Stack = createStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false);
        setLoading(false);
      } else {
        setLoggedIn(true);
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <ActivityIndicator size='large' color='#00ff00' />;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          {loggedIn ? (
            <>
              <Stack.Screen name='Main' component={MainScreen} />
              <Stack.Screen name='Add' component={AddScreen} />
              <Stack.Screen name='Save' component={SaveScreen} />
              <Stack.Screen name='Comment' component={CommentScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name='Home' component={LandingScreen} />
              <Stack.Screen name='Register' component={RegisterScreen} />
              <Stack.Screen name='Login' component={LoginScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
