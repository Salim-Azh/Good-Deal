import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import  {  Storage ,  StorageInstances, uploadBytes  }  from  '@angular/fire/storage' ;
import { Uploadfile } from 'src/app/model/uploadfile.model';
import { UploadfileService } from 'src/app/services/uploadfile.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  path: string = "/messages";
  patch: string;
  constructor(public authService: AuthService, private uploadfileService: UploadfileService) { }

  ngOnInit(): void {
  }


}
