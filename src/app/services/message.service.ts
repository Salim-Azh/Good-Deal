import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, DocumentData, DocumentReference, getDocs, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private firestore: Firestore) { }


  async getMessagesByChatRef(chatRef : DocumentReference){
    let res: Message[] = [];

    const q = query(collection(this.firestore, "messages"), where("chatRef", "==", chatRef));
    const docsSnap = await getDocs(q);

    docsSnap.forEach(element => {
      res.push(this.convertToMessageModel(element));
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
