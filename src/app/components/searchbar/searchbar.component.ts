import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, DocumentReference, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { Ad } from 'src/app/model/ad.model';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  ads: Ad[]= [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    /*combineLatest(this.startobs, this.endobs).subscribe((value: any[]) => {
      this.firequery(value[0], value[1]).subscribe((items) => {
        this.items = items;
      })
    })*/
  }

  searchTextWithNoFilters(input: any){
    if(input){

    }
  }


  /*getsearchbar(input: string) {
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
  }

  firequery(start, end) {
    return this.afs.collection('ads', ref =>
    ref.limit(5).orderBy('title').startAt(start).endAt(end)).valueChanges();
  }*/
}
