import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Ad } from '../../model/ad.model'
import { Loader } from "@googlemaps/js-api-loader" //intentional : don't remove maps loader
import { ResidenceService } from 'src/app/services/residence.service';
import { Residence } from 'src/app/model/residence.model';

//import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;
  @Input() user?: User;

  displayState: string;
  displayDate: string;
  residence!: Residence;

  //images:  GalleryItem[] = [];
  //thumbHeight=0;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private residenceService: ResidenceService,
  ) {
    this.displayState = "";
    this.displayDate = "";
  }

  async ngOnInit() {
    //this.images = [new ImageItem({ src: this.ad.imagesUrl})];

    this.setDisplayState();
    this.setDisplayDate();
    this.residence = await this.residenceService.getResidenceByRef(this.ad.residenceRef);
    this.setMap()
  }

  onScroll() {
    const element = document.getElementById("adDetails");
    if (element) {
      if (element.scrollTop > 20) {
        const img = document.getElementById("adImg");
        if (img) {
          img.style.height = "15vh";
        }
      }
      else {
        const img = document.getElementById("adImg");

        if (img) {
          img.style.height = "30vh";
        }
      }
    }
  }


  setMap() {
    let myLatLng = { lat: this.ad.latitude, lng: this.ad.longitude };

    let map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 16,
        center: myLatLng,
      }
    );

    const contentString =
      `<h3>${this.ad.residenceName}</h3>
      <p>${this.residence.displayAddress}</p>`

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    const marker = new google.maps.Marker({
      position: myLatLng,
      map
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
    });
  }

  private setDisplayState() {
    if (this.ad.state == "new") {
      this.displayState = "Neuf";
    }
    else if (this.ad.state == "like new") {
      this.displayState = "Usagé - Comme Neuf";
    }
    else if (this.ad.state == "used") {
      this.displayState = "Usagé";
    }
  }

  private setDisplayDate() {
    const date = this.ad.createdAt.toDate();
    this.displayDate = date.toLocaleDateString()
  }

  async contactUser() {
    let chat = undefined;
    if (this.user && this.ad) {
      chat = await this.chatService.getChatByMembers(this.user.userRef, this.ad.advertiser);
      if (chat.empty) {
        await this.chatService.createChat(this.user.userRef, this.user.username, this.ad.advertiser, this.ad.advertiserName);
      }
    }
    if (chat) {
      this.router.navigate([`/chats/${chat.docs[0].id}`])
    }
  }
}
