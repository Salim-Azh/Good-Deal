import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Ad } from '../../model/ad.model'
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

    let month = date.getMonth().toString();
    let day = date.getDay().toString();
    if (month.length == 1) {
      month = `0${month}`;
    }
    if (day.length == 1) {
      day = `0${day}`;
    }
    this.displayDate = `${date.getFullYear()}-${month}-${day}`
  }

  async contactUser(){
    if(this.user && this.ad){
      const chat = await this.chatService.getChatByMembers(this.user.userRef,this.ad.advertiser);
      if(chat.empty){
        await this.chatService.createChat(this.user.userRef, this.user.username, this.ad.advertiser, this.ad.advertiserName);
      }
    }
    this.router.navigate(['messages'])
  }
}
