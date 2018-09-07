import firebase from '@firebase/app';
import '@firebase/firestore';

// Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZtjClPyOXvd-_LkhDkYBfkUzULeWsmfs",
    authDomain: "video-app-81720.firebaseapp.com",
    databaseURL: "https://video-app-81720.firebaseio.com",
    projectId: "video-app-81720",
    storageBucket: "video-app-81720.appspot.com",
    messagingSenderId: "553293269922"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Firestore + Timestamps Error fix
const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});

export default firebase.firestore();