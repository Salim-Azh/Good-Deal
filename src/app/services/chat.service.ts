import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { getAuth } from 'firebase/auth';
import { User } from '../model/user.model';
import { Chat } from '../model/chat.model';
import { addDoc, collection, DocumentData, DocumentReference, getDocs, query, QuerySnapshot, Timestamp, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string = "";

  constructor(
    private firestore: Firestore,
    private userService: UserService
    ) {}

    private getUser(){
      const uid = getAuth().currentUser?.uid;
      return this.userService.getUser(uid);

    }

    private async getChatsByUsername(username: String) {
      const user: User = await this.getUser();
      if (user) {
        this.username = user.username;
        const q = query(
          collection(this.firestore, "chats"),
          //where('members', 'array-contains', {"u1Username":user.username})
          where('members.'+username, '==', user.username)
        );
        console.log((await getDocs(q)).empty);
        return getDocs(q);
      }
      return null
    }

    async getChats() {
      let chats: Chat[] = [];
      const docsSnap1 = await this.getChatsByUsername("u1Username");
      const docsSnap2 = await this.getChatsByUsername("u2Username");
      if (docsSnap1) {
        chats = this.fillResults(docsSnap1);
      }
      if (docsSnap2){
        chats = chats.concat(this.fillResults(docsSnap2));
      }
      return chats;
    }

    private fillResults(docSnap: QuerySnapshot<DocumentData>) {
      let chats: Chat[] = [];
      docSnap.docs.forEach(element => {


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

            const chat = {
              id: element.id,
              ref: element.ref,
              createdAt: element.get('createdAt'),
              lastMessage: lastMessage,
              members: members

        } as Chat
        chats.push(chat);
      });
      return chats;
    }

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
