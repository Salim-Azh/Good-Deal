import { Component, OnInit } from '@angular/core';
import { Ads } from '../ads/ads';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  recherche: Ads[] = [
    {
      imageUrl: '../../../assets/img/pc.jpeg', 
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
    }
  ]


}
