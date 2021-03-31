import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';

export default function FeedScreen() {
    return (
        <View style={styles.feedContainer}>
            <Text>Main Feed</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

