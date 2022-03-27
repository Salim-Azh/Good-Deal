import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs, query, QuerySnapshot } from 'firebase/firestore';
import { DocumentData } from 'rxfire/firestore/interfaces';
import { Residence } from '../model/residence.model';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {

  constructor(private firestore: Firestore) { }

  async getResidences() {
    const docsSnap = await getDocs(
      query(
        collection(this.firestore, "residences")
      )
    );
    return this.fillResults(docsSnap)
  }

  private fillResults(docSnap: QuerySnapshot<DocumentData>) {
    let residences: Residence[] = []
    docSnap.docs.forEach(element => {
      const ad = {
        id: element.id,
        reference: element.ref,
        name: element.get('name'),
        city: element.get('city'),
        displayAddress: element.get('displayAddress'),
        latitude: element.get('latitude'),
        longitude: element.get('longitude')
      } as Residence
      residences.push(ad);
    });
    return residences;
  }
}
