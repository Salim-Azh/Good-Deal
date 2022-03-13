import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.scss']
})
export class MyAdsListComponent implements OnInit {

  ads: any[] = [];
  user:User = new User();
  constructor(private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid
    this.ads = await this.getUserAds(uid);
    this.user = await this.getUser(uid);
  }

  async getUserAds(id: any) {
    if (id) {
      const docRef = doc(this.firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          return docSnap.get("ads")
      }
    }
  }

  async getUser(id: any): Promise<any> {
    if (id) {
      const docRef = doc(this.firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          username: docSnap.get("username"),
          residence: docSnap.get("residence"),
          ads: docSnap.get("ads")
        } as User
      }
    }
  }

}
