import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async getUser(id: any): Promise<any> {
    if (id) {
      const docRef = doc(this.firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        let ads = [];

        for (const adObj in docSnap.get("ads")) {
          ads.push({
            adRef: docSnap.get("ads")[adObj].adRef,
            title: docSnap.get("ads")[adObj].title,
            deal: docSnap.get("ads")[adObj].deal,
            id: adObj
          })
        }
        return {
          id: docSnap.id,
          userRef: docRef,
          username: docSnap.get("username"),
          residence: docSnap.get("residence"),
          ads: ads
        } as User
      }
    }
  }

}
