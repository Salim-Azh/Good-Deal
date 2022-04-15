import { Component, Input, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';

import { doc, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Loader } from "@googlemaps/js-api-loader"
import { collection, getDocs, query } from 'firebase/firestore';
import { Ad } from 'src/app/model/ad.model';
import { Residence } from 'src/app/model/residence.model';
import { User } from 'src/app/model/user.model';
import { ResidenceService } from 'src/app/services/residence.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  @Input() ad!: Ad;
  @Input() user?: User;
  residences: Residence[] = [];
  constructor(private auth: Auth,
    private router: Router,
    private firestore: Firestore,
    private residenceService: ResidenceService,) { }

  ngOnInit(): void {


    this.mapView()

  }

  mapView(){

    this.residences.forEach(resid => {
      if (this.ad.residenceName == resid.name) {
        console.log('residence',resid)


        const myLatLng = { lat: this.ad.latitude, lng: this.ad.longitude };
        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 18,
            center: myLatLng,
          }
        );
        new google.maps.Marker({
          position: myLatLng,
          map,
          title: "Hello World!",
        });



      }
    });
  }
      /*const querySnapshot = await getDocs(collection(this.firestore, "residences"));
    querySnapshot.forEach((doc) => {
      let residences: Residence[] = [];
      if (doc.get("name")){
        const myLatLng = { lat: doc.get("latitude"), lng: doc.get("longitude") };
        const map = new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            zoom: 18,
            center: myLatLng,
          }
        );
        new google.maps.Marker({
          position: myLatLng,
          map,
          title: "Hello World!",
        });
      }
      const myLatLng = { lat: doc.get("latitude"), lng: doc.get("longitude") };
      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 18,
          center: myLatLng,
        }
      );

      new google.maps.Marker({
        position: myLatLng,
        map,
        title: "Hello World!",
      });
      latitude: doc.get("latitude")
      console.log('myLatLng: ', myLatLng)
      console.log('Name: ', doc.get("name"))
      //console.log('Residence: ', this.ad.residenceName)
    console.log(` Document ${doc.id} contains ${JSON.stringify(doc.data())}`);
    });*/


}
