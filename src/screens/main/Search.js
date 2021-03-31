import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { projectFirestore, auth, timestamp } from '../../firebase/config';

export default function Search(props) {
  const [users, setUsers] = useState([]);

  const fetchUsers = (search) => {
    projectFirestore
      .collection('users')
      .where('fullName', '>=', search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder='search'
        onChangeText={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => props.navigation.navigate('Profile', {uid: item.id})}>
            <Text>{item.fullName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
