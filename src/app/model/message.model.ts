import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Message {
  chatRef: DocumentReference
  messageTxt: string
  sentAt: Timestamp
  sentByRef: DocumentReference
  sentByUsername: string
}
