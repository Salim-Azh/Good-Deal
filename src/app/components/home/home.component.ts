import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { Residence } from 'src/app/model/residence.model'
import { Ad } from 'src/app/model/ad.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


/**
 * Gère l'affichage de l'accueil 
 *  - Un utilisateur non connecté a accès à toutes les annonces de toutes les résidences
 *  - Un utilisateur connecté a accès aux annonces de sa résidence (un filtre est appliqué par défaut)
 */

export class HomeComponent implements OnInit {

  residences: Residence[] = [];
  ads: Ad[]= [];

  constructor(public authService: AuthService, private firestore: Firestore) { }

  async ngOnInit(): Promise<void> {


    /**
     * Test pour la récupération des images dans le storage de firebase
     *  Failed à cause d'un problème d'accès et d'authentification
     *  A régler pour la version 2
     *  (en attendant j'utilise une image stoquée en local)
     * 
     * const storage = getStorage();
     * const url = getDownloadURL(ref(storage, 'asus-router-5b2c15befa6bcc0036b45c76.jpg'));
     */
    
    const querySnapshot = await this.getResidences();

    /**
     * Pour chaque document, une résidence est créée et stoquée dans un tableau
     */
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


    /**
     * Test sur les annonces d'une seule résidence
     * Une boucle for dans une boucle for pour récupérer les annonces de toutes les résidences ne fonctionne pas
     * A régler pour la verison 2
     */
    const querySnapshot2 = await this.getResidencesAdsById(this.residences[1].id)
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

  /**
   * 
   * @returns Tous les documents se trouvant dans la collection Residences de firebase
   */
  async getResidences(){
    return getDocs(collection(this.firestore, "residences"));
  }

  /**
   * 
   * @param id de la residence donc l'ont veut les annonces
   * @returns tous les documents se trouvant dans la collection ads pour une residence donnée
   */
  async getResidencesAdsById(id: any){
    return getDocs(collection(this.firestore, "residences/"+id+"/ads"));
  }
}
