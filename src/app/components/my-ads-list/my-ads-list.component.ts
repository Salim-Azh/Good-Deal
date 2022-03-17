import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { deleteDoc, deleteField, doc, DocumentReference, getDoc, updateDoc } from 'firebase/firestore';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.scss']
})
export class MyAdsListComponent implements OnInit {

  ads: { adRef: DocumentReference, title: string, id?: string, deal: boolean }[] = [];
  user: User = new User();

  constructor(private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid
    this.user = await this.getUser(uid);
    this.ads = this.user.ads
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

  async markAdAsDealByRef(adId: any, adRef: any, adTitle: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: true
      });


      const userRef = doc(this.firestore, 'users/' + this.user.id);
      const dealProperty = `ads.${adId}.deal`
      await updateDoc(userRef, {
        [dealProperty]: true
      })

      this.ngOnInit()
    }
  }

  async cancelAdDealByRef(adId: any, adRef: any, adTitle: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: false
      });

      const userRef = doc(this.firestore, 'users/' + this.user.id);
      const dealProperty = `ads.${adId}.deal`
      await updateDoc(userRef, {
        [dealProperty]: false
      });

      this.ngOnInit()
    }
  }


  //NOT WORKING ON NESTED MAPS
  async deleteAd(id: any, adRef: any, title: any) {
    const confirm = window.confirm(`Vous allez supprimer votre annonce toutes les données associée seront perdues. \n Voulez-vous vraiment supprimer l'annonce ${title}?`);
    if (confirm) {
      await deleteDoc(adRef);
      const userRef = doc(this.firestore, "users/" + this.user.id);
      console.log(`users.${userRef.id}.ads.${id}`)
      await updateDoc(userRef, {
        ads:{
          [id]: deleteField()
        }
      });

      this.ngOnInit();
    }
  }
}
