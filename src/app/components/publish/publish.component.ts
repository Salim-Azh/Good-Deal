import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Publish from '../../model/publish';
import { Injectable } from '@angular/core';
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {

  path: string = "/publish";

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  /*
  savePublish(): void {
    create(publish: Publish): any {
      return this.publishRef.add({ publish });
    }
  }
  */

}
