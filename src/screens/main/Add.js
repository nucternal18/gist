import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function AddScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      if (Platform.OS !== 'web') {
        const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (galleryStatus.status !== 'granted') {
          Alert.alert(
            'Sorry, we need camera roll permissions to make this work!',
            [{ text: 'Close', style: 'cancel' }]
          );
        }
        setHasGalleryPermission(galleryStatus.status === 'granted');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      setImage(photo.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasGalleryPermission === false) {
    return <Text>No access to Gallery</Text>;
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={type}
          ratio={'1:1'}
          ref={(ref) => setCamera(ref)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
                  title='Flip Camera'
                  style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
        <Button title='Take Picture' onPress={takePicture} />
        <Button title='Pick an image from camera roll' onPress={pickImage} />

        <Button
          title='Save'
          onPress={() => navigation.navigate('Save', { image })}
        />
      </View>
      <View style={styles.imageContainer}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ flex: 1, width: 200, height: 200 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,

    flexDirection: 'row',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
    button: {
      flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
