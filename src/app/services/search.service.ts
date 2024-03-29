import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { collection, DocumentData, DocumentReference, getDocs, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { Ad } from '../model/ad.model';
import { User } from '../model/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

  private getUser(){
    const uid = getAuth().currentUser?.uid;
    return this.userService.getUser(uid);
  }

  async getAds() {
    const docsSnap = await getDocs(
      query(
        collection(this.firestore, "ads"),
        where("deal", "==", false),
        orderBy("createdAt", "desc")
      )
    );
    return this.fillResults(docsSnap)
  }

  private async getResultsSearchDefaultConnected() {
    const user: User = await this.getUser();
    if (user) {
      const q = query(
        collection(this.firestore, "ads"),
        where("residenceRef", "==", user.residence),
        where("deal", "==", false),
        orderBy("createdAt", "desc")
      );
      return getDocs(q);
    }
    return null
  }

  async searchDefault() {
    let ads: Ad[] = [] as any;
    if (!getAuth().currentUser) {
      ads = await this.getAds();
    }
    else {
      const docsSnap = await this.getResultsSearchDefaultConnected();
      if (docsSnap) {
        ads = this.fillResults(docsSnap)
      }
    }
    return ads;
  }

  async searchText(input: string){
    let ads: Ad[] = [];
    if(input){
      ads = await this.getAds();
    }
    return this.textSearch(ads,input);
  }

  async searchResidence(residenceRef: DocumentReference<DocumentData>) {
    let ads: Ad[] = [];
    if (residenceRef) {
      const q = query(
        collection(this.firestore, "ads"),
        where("deal", "==", false),
        where("residenceRef", "==", residenceRef),
        orderBy("createdAt", "desc")
      );
      const docSnap =  await getDocs(q);
      ads = this.fillResults(docSnap);
    }
    return ads;
  }

  async searchTextResidence(input: string, residenceRef: DocumentReference<DocumentData>) {
    let ads: Ad[] = [];
    if (input && residenceRef) {
      const q = query(
        collection(this.firestore, "ads"),
        where("deal", "==", false),
        where("residenceRef", "==", residenceRef),
        orderBy("createdAt", 'desc')
      );
      const docSnap =  await getDocs(q);
      ads = this.fillResults(docSnap);
    }
    return this.textSearch(ads, input);
  }

  private textSearch(ads: Ad[], text: string){
    let results: Ad[] = [];
    ads.forEach(ad => {
      const re = new RegExp(`.*${text}.*`, 'i');
      if(ad.titleIgnoreCase.search(re) != -1){
        results.push(ad);
      }
    });
    return results;
  }

  private fillResults(docSnap: QuerySnapshot<DocumentData>) {
    let ads: Ad[] = [];

    docSnap.docs.forEach(element => {
        const ad = {
          id: element.id,
          advertiser: element.get('advertiser'),
          advertiserName: element.get('advertiserName'),
          category: element.get('category'),
          createdAt: element.get('createdAt'),
          deal: element.get('deal'),
          description: element.get('description'),
          imagesUrl: element.get('imagesUrl'),
          latitude: element.get('latitude'),
          longitude: element.get('longitude'),
          price: element.get('price'),
          residenceName: element.get('residenceName'),
          residenceRef: element.get('residenceRef'),
          state: element.get('state'),
          title: element.get('title'),
          titleIgnoreCase: element.get('titleIgnoreCase')
        } as Ad
        ads.push(ad);
      });
    return ads;
  }
}
