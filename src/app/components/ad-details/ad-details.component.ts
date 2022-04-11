import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { Ad } from '../../model/ad.model'

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;
  @Input() user?: User;

  constructor( private router : Router) {

  }

  ngOnInit(): void {
  }

  contactUser(){
    //Appeler le chat service injecte dans le constructeur
    //Appeler la methode
    console.log(this.user);
    console.log(this.ad.advertiserName)
    this.router.navigate(['messages'])


  }
}
