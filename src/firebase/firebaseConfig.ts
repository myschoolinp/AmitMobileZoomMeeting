import firebase from "@react-native-firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBWHAj75bLixeT-gGsx5TgKk23U6IJ-T6k",
    authDomain: "amitmobilecourse.firebaseapp.com",
    projectId: "amitmobilecourse",
    storageBucket: "amitmobilecourse.firebasestorage.app",
    messagingSenderId: "402007258452",
    appId: "1:402007258452:web:dbb5308cbd5c67395c04c1",
    measurementId: "G-RC5WXYWNEE",
    databaseURL: 'https://amitmobilecourse.firebaseio.com',

};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
