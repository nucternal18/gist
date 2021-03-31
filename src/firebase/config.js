import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
//Config
const firebaseConfig = {
  apiKey: 'AIzaSyAa4GMZ2J5nP6TtXtvKM3Hnc0wF6YilkoY',
  authDomain: 'gist-d7e28.firebaseapp.com',
  projectId: 'gist-d7e28',
  storageBucket: 'gist-d7e28.appspot.com',
  messagingSenderId: '176737602992',
  appId: '1:176737602992:web:d28180caba065d2161da75',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const projectStorage = firebase.storage();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;


export {auth, projectFirestore, projectStorage, timestamp}