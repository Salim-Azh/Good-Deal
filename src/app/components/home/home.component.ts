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

  constructor(private firestore: Firestore) {}

  async ngOnInit(): Promise<void> {

    this.residences = await this.getResidences();

  }

  /**
   * Récupérer toutes les résidences dans la bdd firebase
   */
  async getResidences(): Promise<any[]> {

    const residencesRef = collection(this.firestore, 'residence');
    const q = query(residencesRef);
    const querySnapshot = await getDocs(q);

    const res: Residence[] = [];

    querySnapshot.forEach((doc) => {
      if(doc.exists()){
        var r = new Residence(
          doc.id, 
          doc.get('name'), 
          doc.get('ads')
        )

        res.push(r);
      }
    })

    return res;
  }
  
  /**
   * Récupérer l'utilisateur et ses informations dans la bdd firebase
   * */
  /*async getUser(id: any): Promise<any> {
    if (id) {
      const docRef = doc(this.firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          username: docSnap.get("username"),
          residence: docSnap.get("residence"),
          ads: docSnap.get("ads")
        } as User
      }
    }
  }

  async getAllAds(): Promise<any>{

  }*/

}
