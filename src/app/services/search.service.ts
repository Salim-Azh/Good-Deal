import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, QuerySnapshot, where } from 'firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
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

  private getResultsForSearchDefaultLogout() {
    return getDocs(
      query(
        collection(this.firestore, "ads"),
        where("deal", "==", false)
      )
    );
  }

  private async getResultsForSearchDefaultConnected() {
    const user: User = await this.getUser();
    if (user) {
      const q = query(
        collection(this.firestore, "ads"),
        where("residenceRef", "==", user.residence),
        where("deal", "==", false)
      );
      return getDocs(q);
    }
    return null
  }

  async searchDefault() {
    let ads: Ad[] = [];
    if (!getAuth().currentUser) {
      const docsSnap = await this.getResultsForSearchDefaultLogout();
      ads = this.fillResults(docsSnap)
    }
    else {
      const docsSnap = await this.getResultsForSearchDefaultConnected();
      if (docsSnap) {
        ads = this.fillResults(docsSnap)
      }
    }
    return ads;
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

  async getSearchResultsTextWithNoFilters(input: string){
    let ads: Ad[] = [];
    if(input){
      const text = input.toLowerCase();
      const q = query(
        collection(this.firestore, "ads"),
        where("deal", "==", false),
        where("titleIgnoreCase", ">=",text),
        where("titleIgnoreCase", "<=", text+'\uf8ff')
      );
      const docSnap =  await getDocs(q);
      ads = this.fillResults(docSnap);
    }
    return ads;
  }


/*
  async getSearchResultsTextByCategory(input: any){
    let ads: Ad[] = [];
    if(input){
      const q = query(
        collection(this.firestore, "ads"),
        where("category", ">=",input),
        where("category", "<=", input+'\uf8ff'),
        where("deal", "==", false));

      const docSnap =  await getDocs(q);
      ads = this.fillResults(docSnap);
    }
    return ads;
  }

  async getSearchResultsTextByResidence(input: any){
    let ads: Ad[] = [];
    if(input){
      const q = query(
        collection(this.firestore, "ads"),
        where("residenceName", ">=",input),
        where("residenceName", "<=", input+'\uf8ff'),
        where("deal", "==", false)
      );

      const docSnap =  await getDocs(q);
      ads = this.fillResults(docSnap);
    }
    return ads;
  }
*/
}
