import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyAYXvbN0C8y3oGq7koDD5JpIs-9mAU8Rt8',
  authDomain: 'vue-to-do-s.firebaseapp.com',
  databaseURL: 'https://vue-to-do-s.firebaseio.com',
  projectId: 'vue-to-do-s',
  storageBucket: 'vue-to-do-s.appspot.com',
  messagingSenderId: '415351119764',
  appId: '1:415351119764:web:c22f4df19d7a7f48'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const db = firebase.database()

export { auth, db }