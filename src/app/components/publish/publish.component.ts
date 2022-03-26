import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { collection, addDoc, getDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Ad } from 'src/app/model/ad.model';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/user.model';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from 'src/app/services/user.service';
import { AdService } from 'src/app/services/ad.service';
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  user: User;
  path: string = "/publish";

  residenceName: string = "Residence ..."

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private adService: AdService
  ) {
    this.user = new User();
  }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid
    this.user = await this.userService.getUser(uid);
    if (this.user) {
      const docSnap = await getDoc(this.user.residence);
      this.residenceName = docSnap.get('name')
    }
  }

  async createAd(
    title: string,
    category: any,
    price: any,
    description: any,
    state: any
  ) {
    if (this.user) {
      this.adService.createAd(title, category, price, description, state);
    }
  }

}
