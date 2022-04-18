import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, DocumentData, DocumentReference, DocumentSnapshot, getDoc, getDocs, query, QuerySnapshot } from 'firebase/firestore';
import { Residence } from '../model/residence.model';

@Injectable({
  providedIn: 'root'
})
export class ResidenceService {

  constructor(private firestore: Firestore) { }

  async getResidenceByRef(residenceRef: DocumentReference<DocumentData>) {
    const docSnap = await getDoc(residenceRef);
    return this.convertToResidenceModel(docSnap);
  }

  private convertToResidenceModel(docSnap: DocumentSnapshot<DocumentData>) {
    return {
      id: docSnap.id,
      reference: docSnap.ref,
      name: docSnap.get('name'),
      city: docSnap.get('city'),
      displayAddress: docSnap.get('displayAddress'),
      latitude: docSnap.get('latitude'),
      longitude: docSnap.get('longitude')
    } as Residence
  }

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
      residences.push(this.convertToResidenceModel(element));
    });
    return residences;
  }
}
