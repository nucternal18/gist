import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.landingScreen}>
      <Text>Landing Page</Text>

      <TouchableOpacity style={styles.button}>
        <Button
          title='Register'
          onPress={() => navigation.navigate('Register')}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Button title='Login' onPress={() => navigation.navigate('Login')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  landingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#788eec',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
