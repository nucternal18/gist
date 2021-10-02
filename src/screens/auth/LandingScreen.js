import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, Text, View } from 'react-native';

export const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.landingScreen}>
      <Text style={styles.Text}>Landing Page</Text>

      <Button
        style={styles.button}
        mode='contained'
        onPress={() => navigation.navigate('Register')}>
        Register
      </Button>

      <Button
        style={styles.button}
        mode='contained'
        onPress={() => navigation.navigate('Login')}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonTitle: {
    marginBottom: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  landingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingHorizontal: 20,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
