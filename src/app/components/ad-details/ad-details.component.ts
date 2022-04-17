import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Ad } from '../../model/ad.model'
import { Loader } from "@googlemaps/js-api-loader"

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


  constructor(
    private router : Router,
    private chatService : ChatService,
  ) {
    this.displayState = "";
    this.displayDate = "";


  }
  /**
   * images:  GalleryItem[] = [];
   * thumbHeight=0;
   */


  ngOnInit() {

    /**
     * this.images = [new ImageItem({ src: this.ad.imagesUrl})];
     */

    this.setDisplayState();
    this.setDisplayDate();
    this.setMap();

    //console.log(this.ad.advertiser.id);

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

      new google.maps.Marker({
        position: myLatLng,
        map
      });



  }

  private setDisplayState(){
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

    let datefinale = date.toLocaleDateString();

    this.displayDate = `${datefinale}`
  }

  async contactUser(){
    if(this.user && this.ad){
      const chat = await this.chatService.getChatByMembers(this.user.userRef,this.ad.advertiser);
      if(chat.empty){
        await this.chatService.createChat(this.user.userRef, this.user.username, this.ad.advertiser, this.ad.advertiserName);
      }
    }
    this.router.navigate(['chats'])
  }
}
