import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { getAuth } from 'firebase/auth';
import { doc, DocumentReference, getDoc, collection, query, getDocs } from 'firebase/firestore';
import { User } from '../../model/user.model';
import { Residence } from '../../model/residence.model'
import { Ad } from 'src/app/model/ad.model';
import {combineLatest, Observable} from 'rxjs';
import { Subject} from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {


  finalResults: Ad[] = [];
  ads: Ad[]= [];
  tmp: Ad[]= [];
  residences: Residence[] = [];

  searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  items;

  constructor(private afs: AngularFirestore) {
   }

  ngOnInit() {
    combineLatest(this.startobs, this.endobs).subscribe((value: any[]) => {
      this.firequery(value[0], value[1]).subscribe((items) => {
        this.items = items;
      })
    })
  }


  getsearchbar($event) {
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
  }

  firequery(start, end) {
    return this.afs.collection('ads', ref =>
    ref.limit(5).orderBy('title').startAt(start).endAt(end)).valueChanges();
  }
}
