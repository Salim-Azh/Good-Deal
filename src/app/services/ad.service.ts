import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, deleteDoc, deleteField, doc, DocumentReference, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { Ad } from '../model/ad.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AdService {


  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) { }

  private async getUser() {
    const uid = getAuth().currentUser?.uid
    return this.userService.getUser(uid);
  }

  async markAdAsDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: true
      });

      const user = await this.getUser();
      const userRef = doc(this.firestore, 'users/' + user.id);
      const dealProperty = `ads.${adId}.deal`
      await updateDoc(userRef, {
        [dealProperty]: true
      })
    }
  }

  async cancelAdDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: false
      });
      const user = await this.getUser();
      const userRef = doc(this.firestore, 'users/' + user.id);
      const dealProperty = `ads.${adId}.deal`
      await updateDoc(userRef, {
        [dealProperty]: false
      });
    }
  }

  async deleteAd(adId: string, adRef: DocumentReference, userRef: DocumentReference) {
    await deleteDoc(adRef);
    await updateDoc(userRef, {
      [`ads.${adId}`]: deleteField()
    });
  }

  async createAd(
    title: string,
    category: any,
    price: any,
    description: any,
    imagesUrl: string[],
    state: any
  ) {
    const authUser = await this.getUser();
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
        imagesUrl: imagesUrl,
        latitude: docSnap.get('latitude'),
        longitude: docSnap.get('longitude'),
        price: price,
        residenceName: docSnap.get('name'),
        residenceRef: authUser.residence,
        state: state,
        title: title,
        titleIgnoreCase: title.toLowerCase()
      } as Ad

      const newAdRef = await addDoc(collection(this.firestore, "ads"), newAd);

      const dealProperty = `ads.${newAdRef.id}.deal`
      const adRefProp = `ads.${newAdRef.id}.adRef`
      const titleRefProp = `ads.${newAdRef.id}.title`

      await updateDoc(userRef, {
        [adRefProp]: newAdRef,
        [dealProperty]: false,
        [titleRefProp]: title
      })
    }
  }
}

