import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.scss']
})
export class MyAdsListComponent implements OnInit {

  ads: any[] = [];
  constructor() {}

  ngOnInit(): void {
  }

}
