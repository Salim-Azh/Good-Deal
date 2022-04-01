import { DocumentReference, Timestamp } from "firebase/firestore"

export interface Chat {
  id: string
  ref: DocumentReference
  createdAt: Timestamp

  lastMessage: {
    messageText:string
    read: boolean
    sentAt: Timestamp
    sentBy: DocumentReference
    username: string
  }

  members: {
    u1Ref: DocumentReference
    u2Ref: DocumentReference
    u1Username: string
    u2Username: string
  }

}
