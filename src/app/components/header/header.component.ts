import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {combineLatest, Observable} from 'rxjs';
import { Subject} from 'rxjs';
import {map, startWith, filter, switchMap} from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public items: Observable<any[]>;

 searchterm: string;

  startAt = new Subject();
  endAt = new Subject();

  city;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  constructor(private afs: AngularFirestore) {

   }

  ngOnInit(){
    combineLatest(this.startobs, this.endobs).subscribe((value: any[]) => {
      this.firequery(value[0], value[1]).subscribe((city) => {
        this.city = city;
      })
    })

  }

  search($event){
    let q = $event.target.value;
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
  }


  firequery(start, end) {
    return this.afs.collection('ads', ref =>
    ref.limit(4).orderBy('title').startAt(start).endAt(end)).valueChanges();
  }


}
