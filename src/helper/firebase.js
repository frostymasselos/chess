import firebase from 'firebase/app';
import "firebase/database";

const config = {
    apiKey: "AIzaSyA3_goaQj1T2VtOvq3yUbIkTYhb74l9rL8",
    authDomain: "chess-dcb0d.firebaseapp.com",
    databaseURL: "https://chess-dcb0d.firebaseio.com",
    projectId: "chess-dcb0d",
    storageBucket: "chess-dcb0d.appspot.com",
    messagingSenderId: "799297688506",
    appId: "1:799297688506:web:72e2c3e08d02e90f2e0383"
  };

firebase.initializeApp(config);

export default firebase;