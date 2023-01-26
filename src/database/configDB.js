// database/firebaseDb.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {

};
firebase.initializeApp(firebaseConfig);
firebase.firestore();
export default firebase;