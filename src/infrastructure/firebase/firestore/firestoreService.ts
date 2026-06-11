import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type QueryConstraint,
  type UpdateData,
  type WithFieldValue,
} from "@react-native-firebase/firestore";

export type FirestoreDocumentResult<T> = {
  id: string;
  path: string;
  data: T;
};

export function getNestoryFirestore(): Firestore {
  return getFirestore();
}

export function firestoreCollection<T extends DocumentData>(
  path: string,
): CollectionReference<T, DocumentData> {
  return collection(getNestoryFirestore(), path) as CollectionReference<T, DocumentData>;
}

export function firestoreDocument<T extends DocumentData>(
  path: string,
): DocumentReference<T, DocumentData> {
  return doc(getNestoryFirestore(), path) as DocumentReference<T, DocumentData>;
}

export async function getDocument<T extends DocumentData>(
  path: string,
): Promise<FirestoreDocumentResult<T> | null> {
  const snapshot = await getDoc(firestoreDocument<T>(path));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    path: snapshot.ref.path,
    data: snapshot.data() as T,
  };
}

export async function listDocuments<T extends DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = [],
): Promise<Array<FirestoreDocumentResult<T>>> {
  const collectionRef = firestoreCollection<T>(collectionPath);
  const queryRef = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
  const snapshot = await getDocs(queryRef);

  return snapshot.docs.map((docSnapshot) => ({
    id: docSnapshot.id,
    path: docSnapshot.ref.path,
    data: docSnapshot.data() as T,
  }));
}

export function saveDocument<T extends DocumentData>(
  path: string,
  data: WithFieldValue<T>,
): Promise<void> {
  return setDoc(firestoreDocument<T>(path), data);
}

export function mergeDocument<T extends DocumentData>(
  path: string,
  data: Partial<WithFieldValue<T>>,
): Promise<void> {
  return setDoc(firestoreDocument<T>(path), data, { merge: true });
}

export function patchDocument<T extends DocumentData>(
  path: string,
  data: UpdateData<T>,
): Promise<void> {
  return updateDoc(firestoreDocument<T>(path), data);
}

export function firestoreServerTimestamp() {
  return serverTimestamp();
}
