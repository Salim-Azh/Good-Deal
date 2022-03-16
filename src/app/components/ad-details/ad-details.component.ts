import { Component, OnInit, Input } from '@angular/core';
import { Ad } from '../../model/ad.model'

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;

  constructor() { }

  ngOnInit(): void {
  }

}
