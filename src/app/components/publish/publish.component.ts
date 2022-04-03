import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, getFirestore, collection, addDoc, getDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { Ad } from 'src/app/model/ad.model';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/user.model';

import { UserService } from 'src/app/services/user.service';
import { AdService } from 'src/app/services/ad.service';

import { initializeApp } from "firebase/app";
//import { getStorage, ref } from "firebase/storage";

import { BehaviorSubject, noop } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable } from "rxjs";

import  {  Storage ,  StorageInstances, getStorage, ref, uploadBytesResumable, getDownloadURL  }  from  '@angular/fire/storage' ;
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Uploadfile } from 'src/app/model/uploadfile.model';
import { UploadfileService } from 'src/app/services/uploadfile.service';
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

  private photoReadersubject = new BehaviorSubject<(string | ArrayBuffer)[]>([]);
  public readablePhotoList$ = this.photoReadersubject.asObservable();


  private filePhotoListSubject = new BehaviorSubject<{}[]>([]);
  public filePhotoList$ = this.filePhotoListSubject.asObservable();

  private selectFilePhotoListSubject = new BehaviorSubject<{}[]>([]);
  public selectedPhotoList$ = this.selectFilePhotoListSubject.asObservable()
                                  .pipe(
                                    map((data) => data.length)
                                  );

  selectAllPhotoStatus:boolean = false;
  fb;
  downloadURL: Observable<string>;

  patch: string;
  //public file: any = {}
  @Input() file: File;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private adService: AdService,
    private uploadfileService: UploadfileService,
    private af: AngularFireStorage,
    public storage: Storage


  ) {
    this.user = new User();
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
    state: any,

  ) {
    if (this.user) {
      this.adService.createAd(title, category, price, description, state);
    }
  }


  TakePhoto(FormimagesUrl: HTMLInputElement, user, event : any) {
    this.file = event.target.files[0]

    this.photoSourceObj = FormimagesUrl.files[0];


    if ( !!this.photoSourceObj ) {

      const reader = new FileReader();
      reader.readAsDataURL(this.photoSourceObj);

      reader.onload = (e) => {
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


  uploadImage(){
console.log(this.file);
// Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(this.storage, 'Images/' + this.file.name);
const uploadTask = uploadBytesResumable(storageRef, this.file);
// Listen for state changes, errors, and completion of the upload.
uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  },
  (error) => {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;

      // ...

      case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
  },
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
);
//this.af.upload("Images/"+Math.random()+this.patch, this.patch)

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
