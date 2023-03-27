// database/firebaseDb.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyCg2myX2w4TJRzU0J15n3g1EY77L9uVhZY",
    authDomain: "agexpense-35b01.firebaseapp.com",
    databaseURL: "https://agexpense-35b01.firebaseio.com",
    projectId: "agexpense-35b01",
    storageBucket: "agexpense-35b01.appspot.com",
    messagingSenderId: "638552515811",
    appId: "1:638552515811:android:90e4098ee79133df9151d6"
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;