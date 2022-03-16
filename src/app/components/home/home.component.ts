import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc, collection, query, getDocs, where, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { User } from '../../model/user.model';
import { Ad } from 'src/app/model/ad.model';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ads: Ad[] = [];

  constructor(private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {
    try {
      const results = await this.searchDefault();
      if (results) {
        this.ads = results;
      }
    } catch (error) {
      console.log(error)
    }

  }

  async searchDefault() {
    if (!getAuth().currentUser) {
      const docsSnap = await this.getResultsForSearchDefaultLogout();
      return this.fillResults(docsSnap)
    }
    else {
      const docsSnap = await this.getResultsForSearchDefaultConnected();
      if (docsSnap) {
        return this.fillResults(docsSnap)
      }
    }
    return null;
  }

  getResultsForSearchDefaultLogout() {
    return getDocs(collection(this.firestore, "ads"));
  }

  async getResultsForSearchDefaultConnected() {
    const uid = getAuth().currentUser?.uid;
    const user = await this.getUser(uid);
    if (user) {
      const q = query(collection(this.firestore, "ads"), where("residenceRef", "==", user.residence));
      return getDocs(q);
    }
    return null
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

  fillResults(docSnap: QuerySnapshot<DocumentData>) {
    let res: Ad[] = [];
    docSnap.docs.forEach(adDoc => {
      const ad = {
        id: adDoc.id,
        advertiser: adDoc.get('advertiser'),
        advertiserName: adDoc.get('advertiserName'),
        category: adDoc.get('category'),
        createdAt: adDoc.get('createdAt'),
        deal: adDoc.get('deal'),
        description: adDoc.get('description'),
        imagesUrl: adDoc.get('imagesUrl'),
        latitude: adDoc.get('latitude'),
        longitude: adDoc.get('longitude'),
        price: adDoc.get('price'),
        residenceName: adDoc.get('residenceName'),
        state: adDoc.get('state'),
        title: adDoc.get('title'),
      } as Ad
      res.push(ad);
    });
    return res;
  }
}
