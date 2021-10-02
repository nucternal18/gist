import React, { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, projectFirestore } from '../../firebase/config';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFooterLinkPress = () => {
    navigation.navigate('Register');
  };

  const onLoginPress = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password)
        .then((response) => {
          const uid = response.user.uid;
          const usersRef = projectFirestore.collection('users');
          usersRef
            .doc(uid)
            .get()
            .then((firestoreDocument) => {
              if (!firestoreDocument.exists) {
                alert('User does not exist anymore.');
                return;
              }
              const user = firestoreDocument.data();
              navigation.navigate('Main', { user });
            });
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Wrong Credentials', 'Please try again again...', [
            { text: 'Close', style: 'cancel' },
          ]);
        });
      setEmail('');
      setPassword('');
    } catch (error) {
      console.log(error);
      Alert.alert('Wrong Credentials', 'Please try again again...', [
        { text: 'Close', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps='always'>
        <View style={styles.title}>
          <Text style={styles.titleText}>Login Screen</Text>
        </View>

        <TextInput
          style={styles.input}
          mode='outlined'
          label='UserName'
          placeholder='username'
          placeholderTextColor='#aaaaaa'
          onChangeText={(text) => setEmail(text)}

          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          placeholder='password'
          placeholderTextColor='#aaaaaa'
          secureTextEntry
          label='Password'
          onChangeText={(text) => setPassword(text)}

          right={<TextInput.Icon name='eye' />}
          underlineColorAndroid='transparent'
          autoCapitalize='none'
        />
        <Button
          style={styles.button}
          mode='contained'
          onPress={() => onLoginPress()}>
          <Text style={styles.buttonTitle}>Log in</Text>
        </Button>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: { flex: 1, height: 120, width: 120, alignSelf: 'center', margin: 30 },
  titleText: { flex:1, fontSize: 16, fontWeight: 'bold'},
  logo: {
    flex: 1,
    height: 120,
    width: 90,
    alignSelf: 'center',
    margin: 30,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerView: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#2e2e2d',
  },
  footerLink: {
    color: '#788eec',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
