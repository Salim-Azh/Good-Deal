import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, DocumentReference, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { User } from '../../model/user.model';
import { Residence } from 'src/app/model/residence.model'
import { Ad } from 'src/app/model/ad.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})



export class HomeComponent implements OnInit {

  residences: Residence[] = [];
  ads: Ad[]= [];

  constructor(private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {

    const querySnapshot = await this.getResidences();

    querySnapshot.docs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      if (doc.exists()) {
        this.residences.push({
          id: doc.id,
          name: doc.get('name'),
          displayAddress: doc.get('displayAddress'),
          latitude: doc.get('latitude'),
          longitude: doc.get('longitude'),
        } as Residence)
      }


    });

    const querySnapshot2 = await this.getResidencesAdsById(this.residences[0].id)
    querySnapshot2.docs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      if (doc.exists()) {
        this.ads.push({
          id: doc.id,
          advertiser:doc.get('advertiser'),
          advertiserName:doc.get('advertiserName'),
          category:doc.get('category'),
          createdAt:doc.get('createdAt'),
          deal:doc.get('deal'),
          description:doc.get('description'),
          imagesUrl:doc.get('imagesUrl'),
          latitude:doc.get('latitude'),
          longitude:doc.get('longitude'),
          price:doc.get('price'),
          residenceName:doc.get('residenceName'),
          state:doc.get('state'),
          title:doc.get('title'),
        } as Ad)
      }


    });
  }

  async getResidences(){
    return getDocs(collection(this.firestore, "residences"));
  }

  async getResidencesAdsById(id: any){
    return getDocs(collection(this.firestore, "residences/"+id+"/ads"));
  }
}
