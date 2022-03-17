import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
//import Publish from '../../model/publish';
import { Injectable } from '@angular/core';
import { PublishService } from '../../services/publish.service';
//import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
//import { doc, getDoc, collection, query, getDocs, where, QuerySnapshot, DocumentData } from 'firebase/firestore';


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


  constructor(private publishService: PublishService, public authService: AuthService) { }

  ngOnInit(): void {
  }


  onSubmit(form: NgForm) {
    this.publishService.addPublish(form.value).
      then(() => form.reset());
  }


}
