import {
	GoogleAuthProvider,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
	updatePassword,
	type User
} from 'firebase/auth';
import { auth, firestore } from './config.js';
import { doc, setDoc } from 'firebase/firestore';
import { goto } from '$app/navigation';

/**
 * Signs in the user using Google Sign-In and updates the user's data in Firestore.
 * @returns {Promise<void>}
 */
export async function signInWithGoogle(): Promise<void> {
	const provider = new GoogleAuthProvider();
	const result = await signInWithPopup(auth, provider);
	const user = result.user;
	await updateUser(user);
}

/**
 * Signs in the user using email and password and updates the user's data in Firestore.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<void>}
 */
export async function signInWithEmail(email: string, password: string): Promise<void> {
	const result = await signInWithEmailAndPassword(auth, email, password);
	const user = result.user;
	await updateUser(user);
}

/**
 * Registers a new user using email and password and updates the user's data in Firestore.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @param {string} displayName - User's display name.
 * @returns {Promise<void>}
 */
export async function registerWithEmail(
	email: string,
	password: string,
	displayName: string
): Promise<void> {
	const result = await createUserWithEmailAndPassword(auth, email, password);
	const user = result.user;
	if (!user) {
		throw new Error('User not found');
	}
	await updateProfile(user, { displayName });
	await updateUser(user);
	await sendEmailVerification(user); // Send email verification after registration
}

/**
 * Updates the user's data in Firestore.
 * @param {User} user - Firebase Auth User object.
 * @returns {Promise<void>}
 */
async function updateUser(user: User): Promise<void> {
	const ref = doc(firestore, 'users', user.uid);
	const data = {
		uid: user.uid,
		email: user.email,
		emailVerified: user.emailVerified,
		displayName: user.displayName,
		photoURL: user.photoURL,
		isAnonymous: user.isAnonymous,
		providerId: user.providerId,
		phoneNumber: user.phoneNumber,
		providerData: user.providerData
	};
	await setDoc(ref, data, { merge: true });
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export async function logOut(): Promise<void> {
	await signOut(auth);
	await goto('/sign-in');
}

/**
 * Sends a password reset email to the specified email address.
 * @param {string} email - User's email.
 * @returns {Promise<void>}
 */
export async function sendPasswordReset(email: string): Promise<void> {
	await sendPasswordResetEmail(auth, email);
}

/**
 * Sends an email verification to the current user.
 * @returns {Promise<void>}
 */
export async function sendEmailVerificationToUser(): Promise<void> {
	if (auth.currentUser) {
		await sendEmailVerification(auth.currentUser);
	}
}

/**
 * Updates the current user's profile.
 * @param {Partial<{ displayName: string; photoURL: string }>} profile - Object containing displayName and/or photoURL.
 * @returns {Promise<void>}
 */
export async function updateUserProfile(
	profile: Partial<{ displayName: string; photoURL: string }>
): Promise<void> {
	if (auth.currentUser) {
		await updateProfile(auth.currentUser, profile);
		await updateUser(auth.currentUser); // Update Firestore with new profile data
	}
}

/**
 * Updates the current user's password.
 * @param {string} newPassword - The new password.
 * @returns {Promise<void>}
 */
export async function updateUserPassword(newPassword: string): Promise<void> {
	if (auth.currentUser) {
		await updatePassword(auth.currentUser, newPassword);
	}
}
