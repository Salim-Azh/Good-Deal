import { Component, OnInit, Input } from '@angular/core';
import { format } from 'path';
import { Ad } from '../../model/ad.model';
//import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;

  displayState: string;
  displayDate: string;

  constructor() {
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

}
