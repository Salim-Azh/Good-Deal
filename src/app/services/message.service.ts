import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Unsubscribe } from 'firebase/auth';
import { collection, DocumentData, DocumentReference, getDocs, onSnapshot, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: Firestore) { }


  async getMessagesByChatRef(chatRef: DocumentReference) {
    let res: Message[] = [];

    const q = query(
      collection(this.firestore, "messages"),
      where("chatRef", "==", chatRef),
      orderBy("sentAt")
    );

    const docsSnap = await getDocs(q);

    docsSnap.forEach(element => {
      res.push(this.convertToMessageModel(element));
    });

    return res;
  }

  async loadMessagesByChatRef(chatRef: DocumentReference) {
    let res: Message[] = [];

    const q = query(
      collection(this.firestore, "messages"),
      where("chatRef", "==", chatRef),
      orderBy("sentAt")
    );

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        res.push(this.convertToMessageModel(doc));
      });
    });

    return res;
  }

  private convertToMessageModel(element: QueryDocumentSnapshot<DocumentData>) {
    return {
      chatRef: element.get("chatRef"),
      messageTxt: element.get("messageTxt"),
      sentAt: element.get("sentAt"),
      sentByRef: element.get("sentByRef"),
      sentByUsername: element.get("sentByUsername")
    } as Message
  }
}
