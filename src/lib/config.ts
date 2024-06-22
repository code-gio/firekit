import {
    // @ts-ignore
    PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_AUTH_DOMAIN, PUBLIC_FIREBASE_PROJECT_ID, PUBLIC_FIREBASE_STORAGE_BUCKET, PUBLIC_FIREBASE_MESSAGING_SENDER_ID, PUBLIC_FIREBASE_APP_ID, PUBLIC_FIREBASE_MEASUREMENT_ID
} from '$env/static/public';

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, writeBatch, WriteBatch } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getFunctions, type Functions } from 'firebase/functions';
import { getDatabase, Database } from 'firebase/database';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
} = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};

/**
 * Initialize Firebase app with provided configuration.
 * @type {FirebaseApp}
 */
const app: FirebaseApp = initializeApp(firebaseConfig);

/**
 * Firestore instance for database operations.
 * @type {Firestore}
 */
export const firestore: Firestore = getFirestore(app);

/**
 * Firebase Authentication instance for auth operations.
 * @type {Auth}
 */
export const auth: Auth = getAuth(app);

/**
 * Firebase Functions instance for cloud functions.
 * @type {Functions}
 */
export const functions: Functions = getFunctions(app);

/**
 * Firebase Realtime Database instance for database operations.
 * @type {Database}
 */
export const database: Database = getDatabase(app);

/**
 * Firebase Storage instance for storage operations.
 * @type {FirebaseStorage}
 */
export const storage: FirebaseStorage = getStorage(app);

/**
 * Firestore WriteBatch instance for batch operations.
 * @type {WriteBatch}
 */
export const batch: WriteBatch = writeBatch(firestore);
