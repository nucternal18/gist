import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { icons, COLORS } from '../../constants';

const HEADER_HEIGHT = 350;

export default function AddScreen({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      if (Platform.OS !== 'web') {
        const galleryStatus =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
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
  function renderHeaderBar() {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          marginBottom: 100,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingHorizontal: 24,
          paddingBottom: 10,
        }}>
        {/* Header Bar Title */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: COLORS.white, fontSize: 14 }}>Add Pic:</Text>
        </Animated.View>
        {/* Back Button */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
            width: 35,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#F5F6FB',
            backgroundColor: 'rgba(2, 2, 2, 0.3)',
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            style={{ width: 15, height: 15, tintColor: '#F5F6FB' }}
          />
        </TouchableOpacity>
        {/* Bookmark Button */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
            width: 35,
          }}>
          <Image
            source={icons.bookmark}
            style={{ width: 30, height: 30, tintColor: COLORS.darkGreen }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 50,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
            width: 35,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.transparentBlack3,
            backgroundColor: COLORS.blue,
          }}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            style={{ width: 15, height: 15, tintColor: '#F5F6FB' }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: COLORS.blue, marginLeft: 5 }}>
          Go Back
        </Text>
      </View>
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
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
