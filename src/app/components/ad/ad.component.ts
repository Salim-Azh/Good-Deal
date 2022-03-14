import { Component, OnInit, Input } from '@angular/core';
import { Ad } from './ad';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss']
})
export class AdComponent implements OnInit {

  @Input() ads: Ad | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
