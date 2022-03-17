import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { collection, addDoc, getDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Ad } from 'src/app/model/ad.model';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/user.model';
import { Firestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  path: string = "/publish";


  constructor(public authService: AuthService, private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {
    console.log("test")
  }

  async createAd(title: any, category: any, price: any, description: any, state: any) {
    const uid = getAuth().currentUser?.uid
    const authUser: User = await this.getUser(uid);
    if (authUser) {
      const docSnap = await getDoc(authUser.residence);
      const userRef = doc(this.firestore, `users/${authUser.id}`);

      const newAd = {
        advertiser: userRef,
        advertiserName: authUser.username,
        category: category,
        createdAt: Timestamp.fromDate(new Date()),
        deal: false,
        description: description,
        latitude: docSnap.get('latitude'),
        longitude: docSnap.get('longitude'),
        price: price,
        residenceName: docSnap.get('name'),
        residenceRef: authUser.residence,
        state: state,
        title: title,
      } as Ad

      const newAdRef = await addDoc(collection(this.firestore, "ads"), newAd);
      console.log("Document written with ID: ", newAdRef.id);

      const dealProperty = `ads.${newAdRef.id}.deal`
      const adRefProp = `ads.${newAdRef.id}.adRef`
      const titleRefProp = `ads.${newAdRef.id}.title`

      await updateDoc(userRef,{
        [adRefProp] : newAdRef,
        [dealProperty]: true,
        [titleRefProp] : title
      })
    }
  }

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
          username: docSnap.get("username"),
          residence: docSnap.get("residence"),
          ads: ads
        } as User
      }
    }
  }
}
