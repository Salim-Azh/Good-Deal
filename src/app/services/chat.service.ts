import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, DocumentReference, getDocs, query, Timestamp, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private firestore: Firestore) { }

  async createChat(userRef1: DocumentReference,username1: string, userRef2: DocumentReference, username2: string){
    if (userRef1 != userRef2 && username1 != username2) {
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

  async getChatByMembers(userRef1: DocumentReference, userRef2: DocumentReference){
    let q = query(
      collection(this.firestore, "chats"),
      where("members.u1Ref", "==", userRef1),
      where("members.u2Ref", "==", userRef2)
    );

    const chat = await getDocs(q);
    if (chat.empty) {
      q = query(
        collection(this.firestore, "chats"),
        where("members.u1Ref", "==", userRef2),
        where("members.u2Ref", "==", userRef1)
      );
      return getDocs(q);
    }
    return chat;
  }
}
