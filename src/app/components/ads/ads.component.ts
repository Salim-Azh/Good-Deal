import { Component, OnInit, Input } from '@angular/core';
import { Ads } from './ads';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {

  @Input() ads: Ads = null;
  constructor() { }

  ngOnInit(): void {
  }

}
