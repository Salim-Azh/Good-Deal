import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Uploadfile } from '../model/uploadfile.model';
import { finalize, map, tap } from 'rxjs/operators';
import { Observable, from, switchMap } from "rxjs";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { provideStorage, FirebaseStorage } from '@angular/fire/storage';
import { Database } from '@angular/fire/database';
import  {  Storage ,  StorageInstances, uploadBytes  }  from  '@angular/fire/storage' ;
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {  getFirestore, collection, addDoc, getDoc, doc, Timestamp, updateDoc } from "firebase/firestore";
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';





@Injectable({
  providedIn: 'root'
})
export class UploadfileService {



  public file: File
  private basePath = '/uploads';
  constructor(public storage: Storage ) { }

  uploadImage() {
//const storageRef =ref(this.storage, path);
//const uploadTask = from(uploadBytes(storageRef, image));
/*return uploadTask.pipe(
  switchMap((result) => getDownloadURL(result.ref))
);*/
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
  }

  /*pushFileToStorage(uploadfile: Uploadfile): Observable<number | undefined> {
    const filePath = `${this.basePath}/${uploadfile.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, uploadfile.file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          uploadfile.url = downloadURL;
          uploadfile.name = uploadfile.file.name;
          this.saveFileData(uploadfile);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }
  private saveFileData(uploadfile: Uploadfile): void {
    this.db.list(this.basePath).push(uploadfile);
  }
  getFiles(numberItems: number): AngularFireList<Uploadfile> {
    return this.db.list(this.basePath, ref =>
      ref.limitToLast(numberItems));
  }
  deleteFile(uploadfile: Uploadfile): void {
    this.deleteFileDatabase(uploadfile.key)
      .then(() => {
        this.deleteFileStorage(uploadfile.name);
      })
      .catch(error => console.log(error));
  }
  private deleteFileDatabase(key: string): Promise<void> {
    return this.db.list(this.basePath).remove(key);
  }
  private deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }*/
}
