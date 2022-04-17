import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  DocumentData,
  DocumentReference,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
  where } from 'firebase/firestore';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: Firestore) {}


  async saveMessage(msg: string, username: string, userRef: DocumentReference<DocumentData>, chatRef: DocumentReference<DocumentData>) {
    const sentAt = Timestamp.fromDate(new Date());
    const newMsg = {
      messageTxt: msg,
      sentAt: sentAt,
      sentByRef: userRef,
      sentByUsername: username,
      chatRef: chatRef
    } as Message

    await addDoc(collection(this.firestore, "messages"), newMsg);

    const lastMsg  = {
      read: false,
      messageText: msg,
      sentAt: sentAt,
      sentByRef: userRef,
      sentByUsername: username
    }
    await updateDoc(chatRef,{
      lastMessage: lastMsg
    })
  }

  async loadMessagesByChatRef(chatRef: DocumentReference) {
    let res: Message[] = [];

    const q = query(
      collection(this.firestore, "messages"),
      where("chatRef", "==", chatRef),
      orderBy("sentAt")
    );

    onSnapshot(q, (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          res.push(this.convertToMessageModel(change.doc));
        }
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
