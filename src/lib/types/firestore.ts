import type { DocumentReference, CollectionReference, Query } from 'firebase/firestore';

export interface DocStore<T> {
	subscribe: (cb: (value: T | null) => void) => void | (() => void);
	ref: DocumentReference<T> | null;
	id: string;
}

export interface CollectionStore<T> {
	subscribe: (
		this: void,
		run: (value: T[]) => void,
		invalidate?: (value?: T[]) => void
	) => () => void;
	ref: CollectionReference<T> | Query<T> | null;
}
