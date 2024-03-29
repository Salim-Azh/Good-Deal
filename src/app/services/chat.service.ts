import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { getAuth } from 'firebase/auth';
import { User } from '../model/user.model';
import { Chat } from '../model/chat.model';
import { addDoc, updateDoc, collection, doc, DocumentData, DocumentReference, getDoc, getDocs, getDocsFromCache, query, QueryDocumentSnapshot, QuerySnapshot, Timestamp, where, onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string = "";

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) { }

  private getUser() {
    const uid = getAuth().currentUser?.uid;
    return this.userService.getUser(uid);

  }

  async getChatById(id: string): Promise<any>{
    const docRef = doc(this.firestore, "chats", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const chat: Chat =  this.convertToChatModel(docSnap);
      return chat;
    }
  }

  async loadChats() {
    let chats: Chat[] = []

    const user: User = await this.getUser();
    if (user) {
      this.username = user.username;
      let q = query(
        collection(this.firestore, "chats"),
        where('members.u1Username', '==', user.username)
      );

      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            chats.push(this.convertToChatModel(change.doc));
          }
          if (change.type === "modified") {
            const updateChat = this.convertToChatModel(change.doc);
            for (let i = 0; i < chats.length; i++) {
              if(chats[i].id == updateChat.id){
                chats[i] = updateChat;
              }
            }
          }
        });
      });

      q = query(
        collection(this.firestore, "chats"),
        where('members.u2Username', '==', user.username)
      );
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            chats.push(this.convertToChatModel(change.doc));
          }
          if (change.type === "modified") {
            const updateChat = this.convertToChatModel(change.doc);
            for (let i = 0; i < chats.length; i++) {
              if(chats[i].id == updateChat.id){
                chats[i] = updateChat;
              }
            }
          }
        });
      });
    }

    return chats;
  }

  private convertToChatModel(element: QueryDocumentSnapshot<DocumentData>){
    let message = element.get('lastMessage');
    let lastMessage = {
      messageText: message.messageText,
      read: message.read,
      sentAt: message.sentAt,
      sentByRef: message.sentByRef,
      sentByUsername: message.sentByUsername
    };

    let membres = element.get('members');
    let members = {
      u1Ref: membres.u1Ref,
      u2Ref: membres.u2Ref,
      u1Username: membres.u1Username,
      u2Username: membres.u2Username
    }

    return {
      id: element.id,
      ref: element.ref,
      createdAt: element.get('createdAt'),
      lastMessage: lastMessage,
      members: members

    } as Chat

  }

  private fillResults(docSnap: QuerySnapshot<DocumentData>) {
    let chats: Chat[] = [];
    docSnap.docs.forEach(element => {
      chats.push(this.convertToChatModel(element));
    });
    return chats;
  }

  async createChat(userRef1: DocumentReference, username1: string, userRef2: DocumentReference, username2: string) {
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
      await addDoc(collection(this.firestore, "chats"), newChat)
    }
  }

  async getChatByMembers(userRef1: DocumentReference, userRef2: DocumentReference) {
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

  async read(id:string){
    const docRef = doc(this.firestore, "chats", id);
    await updateDoc(docRef, {
      "lastMessage.read" : true
    });
  }
}
