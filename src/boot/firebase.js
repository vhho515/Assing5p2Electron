import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCcttv8a1XJJO_x_ZlRBbj16Nq4pYPv5mE",
  authDomain: "qwitter-e9f77.firebaseapp.com",
  projectId: "qwitter-e9f77",
  storageBucket: "qwitter-e9f77.appspot.com",
  messagingSenderId: "606529865805",
  appId: "1:606529865805:web:0757c6cfe0c8b239e63404"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// access firebase database with db variable
const db = firebase.firestore()

export default db
