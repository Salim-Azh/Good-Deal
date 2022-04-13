import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Message {
  chatRef: DocumentReference
  messageText: string
  sentAt: Timestamp
  sentByRef: DocumentReference
  sentByUsername: string
}
