import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export const baseUrl = 'http://15.207.88.89:1995/api/v1/';

// Initialize Firebase
const app = initializeApp({
    apiKey: 'AIzaSyCxZGM1M4zOejap-RLvtxB2A7uCvjGxcmY',
    authDomain: 'futureevdemo.firebaseapp.com',
    projectId: 'futureevdemo',
    storageBucket: 'futureevdemo.appspot.com',
    messagingSenderId: '211627305145',
    appId: '1:211627305145:web:de008b054093e3c1231368',
    measurementId: 'G-568X1DEL6B'
});

// Firebase storage reference
export const storage = getStorage(app);
