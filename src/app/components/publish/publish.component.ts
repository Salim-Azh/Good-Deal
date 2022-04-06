import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore } from '@angular/fire/firestore';
import {  getDoc } from "firebase/firestore";

import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/user.model';

import { UserService } from 'src/app/services/user.service';
import { AdService } from 'src/app/services/ad.service';


import { BehaviorSubject } from 'rxjs';
import { map} from 'rxjs/operators';
import { Observable } from "rxjs";

import  {  Storage , ref, uploadBytesResumable, getDownloadURL  }  from  '@angular/fire/storage' ;


//import { Uploadfile } from 'src/app/model/uploadfile.model';
//import { UploadfileService } from 'src/app/services/uploadfile.service';
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {


  user: User;
  path: string = "/publish";

  residenceName: string = "Residence ..."

  photoSourceObj: File;
  showPreview: boolean;

  private photoReadersubject = new BehaviorSubject<(string | ArrayBuffer)[]>([]);
  public readablePhotoList$ = this.photoReadersubject.asObservable();


  private filePhotoListSubject = new BehaviorSubject<{}[]>([]);
  public filePhotoList$ = this.filePhotoListSubject.asObservable();





  @Input() file: File;


  constructor(
    public authService: AuthService,
    private userService: UserService,
    private adService: AdService,

    public storage: Storage

  ) {
    this.user = new User();
    this.showPreview = false;
  }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid
    this.user = await this.userService.getUser(uid);

    if (this.user) {
      const docSnap = await getDoc(this.user.residence);
      this.residenceName = docSnap.get('name')
    }
  }


  async createAd(
    title: string,
    category: any,
    price: any,
    description: any,
    file: any,
    state: any,

  ) {

    if (this.user) {
      this.showPreview = false;
      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(this.storage, 'Images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.then(async snapshot => {
        let  url =  await getDownloadURL(snapshot.ref)
        let imagesUrl: string[] = [];
        if (url) {
          imagesUrl.push(url)
        }
        await this.adService.createAd(title, category, price, description, imagesUrl, state);
      })


    }
  }

  takePhoto(FormimagesUrl: HTMLInputElement, _user, event : any) {
    this.file = event.target.files[0]

    this.photoSourceObj = FormimagesUrl.files[0];


    if ( !!this.photoSourceObj ) {
      this.showPreview = true;
      const reader = new FileReader();
      reader.readAsDataURL(this.photoSourceObj);

      reader.onload = (_e) => {
        const imageUrl = reader.result;

        this.photoReadersubject.next([...this.photoReadersubject.getValue(), imageUrl]);

        const photoReadersubjectLength = this.photoReadersubject.getValue().length;

        this.filePhotoHandler(this.photoSourceObj, photoReadersubjectLength);

      };

    }

  }
  filePhotoHandler(photoSourceObj: File, index:number) {

    let newFilePhoto = {};
    const key = "image_" + index;
    newFilePhoto[key] = photoSourceObj;

    if ( !!this.filePhotoListSubject.getValue() ) {
      this.filePhotoListSubject.next([...this.filePhotoListSubject.getValue() , newFilePhoto]);
    }
    else {
      this.filePhotoListSubject.next([newFilePhoto]);
    }

  }




  /*upload($event) {
    this.patch = $event.target.files[0]
  }

    uploadImage(event: any, user: User){
  console.log(this.patch);
  this.uploadfileService.uploadImage(event.target.files[0], 'images')
  //this.af.upload("/files"+Math.random()+this.patch, this.patch)

    }*/







}
