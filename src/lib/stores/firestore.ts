import { writable } from 'svelte/store';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import type {
	Query,
	CollectionReference,
	DocumentReference,
	Firestore,
	DocumentData
} from 'firebase/firestore';
import type { CollectionStore, DocStore } from '$lib/types/firestore.js';

/**
 * Creates a store that listens to real-time updates from a Firestore document.
 * @template T
 * @param {Firestore} firestore - The Firestore instance to use.
 * @param {string | DocumentReference<T>} ref - The document path or document reference.
 * @param {T} [startWith] - The initial state of the store before any updates.
 * @returns {DocStore<T>} A store with real-time updates on document data.
 * @throws Will throw an error if Firestore is not initialized.
 */
export function docStore<T = any>(
	firestore: Firestore,
	ref: string | DocumentReference<T>,
	startWith?: T
): DocStore<T> {
	let unsubscribe: () => void;

	// Fallback for SSR
	if (!globalThis.window) {
		const { subscribe } = writable(startWith);
		return {
			subscribe,
			ref: null,
			id: ''
		};
	}

	// Fallback for missing SDK
	if (!firestore) {
		console.warn(
			'Firestore is not initialized. Are you missing FirebaseApp as a parent component?'
		);
		const { subscribe } = writable(null);
		return {
			subscribe,
			ref: null,
			id: ''
		};
	}

	const docRef = typeof ref === 'string' ? (doc(firestore, ref) as DocumentReference<T>) : ref;

	const { subscribe } = writable<T | null>(startWith, (set) => {
		unsubscribe = onSnapshot(docRef, (snapshot) => {
			set((snapshot.data() as T) ?? null);
		});

		return () => unsubscribe();
	});

	return {
		subscribe,
		ref: docRef,
		id: docRef.id
	};
}

/**
 * @param  {Firestore} firestore firebase firestore instance
 * @param  {string|Query|CollectionReference} ref collection path, reference, or query
 * @param  {T[]} startWith optional default data
 * @returns a store with realtime updates on collection data
 */
export function collectionStore<T extends DocumentData>(
	firestore: Firestore,
	ref: string | Query<T> | CollectionReference<T>,
	startWith: T[] = []
): CollectionStore<T> {
	let unsubscribe: (() => void) | undefined;

	// Fallback for SSR
	if (typeof window === 'undefined') {
		const store = writable<T[]>(startWith);
		return {
			subscribe: store.subscribe,
			ref: null
		};
	}

	// Fallback for missing SDK
	if (!firestore) {
		console.warn(
			'Firestore is not initialized. Are you missing FirebaseApp as a parent component?'
		);
		const store = writable<T[]>([]);
		return {
			subscribe: store.subscribe,
			ref: null
		};
	}

	const colRef: CollectionReference<T> | Query<T> =
		typeof ref === 'string' ? (collection(firestore, ref) as CollectionReference<T>) : ref;

	const store = writable<T[]>(startWith, (set) => {
		unsubscribe = onSnapshot(colRef, (snapshot) => {
			const data = snapshot.docs.map((s) => {
				return { id: s.id, ref: s.ref, ...s.data() } as T;
			});
			set(data);
		});

		return () => {
			if (unsubscribe) unsubscribe();
		};
	});

	return {
		subscribe: store.subscribe,
		ref: colRef
	};
}
