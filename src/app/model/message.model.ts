import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Message {
  id: string
  ref: DocumentReference
  messageText: string
  sentAt: Timestamp
  sentBy: DocumentReference
  username: string
}
