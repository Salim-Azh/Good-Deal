import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.scss']
})
export class MyAdsListComponent implements OnInit {

  ads: any[] = [
    {
      title: "Routeur",
    },
    {
      title: "Table"
    },
    {
      title: "Livre"
    },
    {
      title: "Poubelle"
    },
    {
      title: "Vaisselles"
    },
    {
      title: "Livre"
    },
    {
      title: "Livre"
    },
    {
      title: "Livre"
    },
    {
      title: "Livre"
    },
    {
      title: "Livre"
    },
    {
      title: "Livre"
    },
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
