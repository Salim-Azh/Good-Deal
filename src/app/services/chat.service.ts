import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore) { }

  async createChat(userRef1: DocumentReference,username1: string, userRef2: DocumentReference, username2: string){
    const newChat = {
      createdAt: Timestamp.fromDate(new Date()),
      lastMessage: {
      },
      members: {
        u1Ref: userRef1,
        u2Ref: userRef2,
        u1Username: username1,
        u2Username: username2
      }
    }
    await addDoc(collection(this.firestore, "chats"),newChat)
  }
}
