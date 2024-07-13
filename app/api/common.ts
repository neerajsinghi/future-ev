import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

export const baseUrl = 'http://3.110.123.55:1995/api/v1/';

// Initialize Firebase
const app = initializeApp({
    apiKey: '<apiKey>',
    authDomain: '<authDomain>',
    projectId: '<projectId>',
    storageBucket: '<storageBucket>',
    messagingSenderId: '<messagingSenderId>',
    appId: '<appId>',
    measurementId: '<measurementId>'
});

// Firebase storage reference
export const storage = getStorage(app);
