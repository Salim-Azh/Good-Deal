import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentReference,
  getDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { Ad } from '../model/ad.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AdService {
  constructor(private firestore: Firestore, private userService: UserService) {}

  private async getUser() {
    const uid = getAuth().currentUser?.uid;
    return this.userService.getUser(uid);
  }

  async markAdAsDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: true,
      });

      const user = await this.getUser();
      const userRef = doc(this.firestore, 'users/' + user.id);
      const dealProperty = `ads.${adId}.deal`;
      await updateDoc(userRef, {
        [dealProperty]: true,
      });
    }
  }

  async cancelAdDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await updateDoc(adRef, {
        deal: false,
      });
      const user = await this.getUser();
      const userRef = doc(this.firestore, 'users/' + user.id);
      const dealProperty = `ads.${adId}.deal`;
      console.log('Id Ads: ', adId);
      await updateDoc(userRef, {
        [dealProperty]: false,
      });
    }
  }

  async deleteAd(
    adId: string,
    adRef: DocumentReference,
    userRef: DocumentReference
  ) {
    await deleteDoc(adRef);
    await updateDoc(userRef, {
      [`ads.${adId}`]: deleteField(),
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
        titleIgnoreCase: title.toLowerCase(),
      } as Ad;

      const newAdRef = await addDoc(collection(this.firestore, 'ads'), newAd);

      const dealProperty = `ads.${newAdRef.id}.deal`;
      const adRefProp = `ads.${newAdRef.id}.adRef`;
      const titleRefProp = `ads.${newAdRef.id}.title`;

      await updateDoc(userRef, {
        [adRefProp]: newAdRef,
        [dealProperty]: false,
        [titleRefProp]: title,
      });
    }
  }

  async getAdById(id: string): Promise<any> {
    const docRef = doc(this.firestore, 'ads', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ref: docSnap.ref,
        advertiser: docSnap.get('advertiser'),
        advertiserName: docSnap.get('advertiserName'),
        category: docSnap.get('category'),
        createdAt: docSnap.get('createdAt'),
        deal: docSnap.get('deal'),
        description: docSnap.get('description'),
        imagesUrl: docSnap.get('imagesUrl'),
        latitude: docSnap.get('latitude'),
        longitude: docSnap.get('longitude'),
        price: docSnap.get('price'),
        residenceName: docSnap.get('name'),
        residenceRef: docSnap.get('residenceRef'),
        state: docSnap.get('state'),
        title: docSnap.get('title'),
        titleIgnoreCase: docSnap.get('titleIgnoreCase'),
      };
    }
  }

  async updateAd(
    adRef: DocumentReference,
    title: string,
    oldTitle: string,
    category: any,
    price: any,
    description: any,
    imagesUrl: string[],
    state: any
  ) {
    await updateDoc(adRef, {
      category: category,
      description: description,
      imagesUrl: imagesUrl,
      price: price,
      state: state,
      title: title,
      titleIgnoreCase: title.toLowerCase(),
    });

    if (title != oldTitle) {
      const authUser = await this.getUser();
      const userRef = doc(this.firestore, `users/${authUser.id}`);
      await updateDoc(userRef, {
        [`ads.${adRef.id}.title`]: title,
      });
    }
  }
}
