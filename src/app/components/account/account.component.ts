import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
 // user: User = new  User();
  path: string = "/home"

  constructor(public authService: AuthService, private firestore: Firestore) {
  }

  async ngOnInit(): Promise<void> {
   // const uid = getAuth().currentUser?.uid
   // this.user = await this.getUser(uid);
  }

  signOut(){
    this.authService.signOut();
  }

 /* async getUser(id: any): Promise<any> {
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
  }*/
}
