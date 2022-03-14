import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  ads$: Observable<any[]>;
  constructor(firestore: Firestore) { 
    const collect = collection(firestore, 'ads');
    this.ads$ = collectionData(collect);
  }

  ngOnInit(): void {
  }

  /**recherche: Ads[] = [
    {
      imagesUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },
    {
      imagesUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },{
      imagesUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },{
      imagesUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },{
      imagesUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },
    {
      imageUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },{
      imageUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    },{
      imageUrl: '../../../assets/img/pc.jpeg', 
      title: 'Ordinateur portable', 
      price:200, 
      residenceName:'Résidence UQAM'
    }
  ]**/


}
