import { Component, OnInit, Input } from '@angular/core';
import { Ad } from '../../model/ad.model';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;
  images:  GalleryItem[] = [];
  thumbHeight=0;

  ngOnInit() {

    this.images = [ 
      new ImageItem({ src: '../../../assets/img/asus-router.jpg'}),
      new ImageItem({ src: '../../../assets/img/pc-asus.jpeg'}),
      new ImageItem({ src: '../../../assets/img/pc-asus2.jpg'})
    ]
  }

}
