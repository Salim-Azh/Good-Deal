import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from './user.service';
import { getAuth } from 'firebase/auth';
import { User } from '../model/user.model';
import { Chat } from '../model/chat.model';
import { collection, DocumentData, DocumentReference, getDocs, query, QuerySnapshot, where } from 'firebase/firestore';

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

    private async getChats1() {
      const user: User = await this.getUser();
      if (user) {
        this.username = user.username;
        const q = query(
          collection(this.firestore, "chats"),
          //where('members', 'array-contains', {"u1Username":user.username})
          where('members.u1Username', '==', user.username)
        );
        console.log((await getDocs(q)).empty);
        return getDocs(q);
      }
      return null
    }

    async getChats() {
      let chats: Chat[] = [];
        const docsSnap = await this.getChats1();
        if (docsSnap) {
          chats = this.fillResults(docsSnap)
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
              sentBy: message.sentBy,
              username: message.username
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
}
