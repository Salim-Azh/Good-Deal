import { Injectable } from '@angular/core';
import { DocumentReference } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  createChat(userRef1: DocumentReference,username1: string, userRef2: DocumentReference, username2: string){
    console.log("TODO")
  }
}
