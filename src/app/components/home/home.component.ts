import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, DocumentReference, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { User } from '../../model/user.model';
import { Residence } from '../../model/residence.model'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})



export class HomeComponent implements OnInit {

  residences: Residence[] = [];

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
          longitude: doc.get('longitude')

        } as Residence)
      }
    });
  }

  async getResidences(){
    let res: Residence[] = [];
    return getDocs(collection(this.firestore, "residences"));
  }
}
