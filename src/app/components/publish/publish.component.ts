import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { AdService } from 'src/app/services/ad.service';
import { BehaviorSubject } from 'rxjs';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  user: User;
  path: string = '/publish';
  residenceName: string;

  disabledPublishBtn: boolean;
  title: string;
  price: string
  state: string;
  category: string;
  description: string;
  photoSourceObj: File | null;
  showPreview: boolean;

  private photoReadersubject = new BehaviorSubject<(string | ArrayBuffer | null)[]>([]);
  public readablePhotoList$ = this.photoReadersubject.asObservable();

  file?: File;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private adService: AdService,
    private router: Router
  ) {
    this.user = new User();
    this.showPreview = false;
    this.photoSourceObj = null;
    this.title = "";
    this.price = "";
    this.state = "";
    this.category = "";
    this.description = "";
    this.disabledPublishBtn = true;
    this.residenceName = ""
  }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid;
    this.user = await this.userService.getUser(uid);
    if (this.user) {
      const docSnap = await getDoc(this.user.residence);
      this.residenceName = docSnap.get('name');
    }
  }

  setTitleState(newValue: string) {
    this.title = newValue;
    this.setDisableBtn();
  }

  setPriceState(newValue: string) {
    this.price = newValue;
    this.setDisableBtn();
  }

  setAdState(newValue: string) {
    this.state = newValue;
    this.setDisableBtn();
  }

  setDisableBtn() {
    this.disabledPublishBtn = !this.title || !this.price || !this.state //|| this.state == "none";
  }

  async createAd(title: string, category: any, price: any, description: any, state: any) {
    if (this.user) {
      this.showPreview = false;
      if (this.file) {
        const type = this.file.type
        if (type == "image/jpeg" || type == "image/png") {
          const storage = getStorage();
          const storageRef = ref(storage, `Images/${Timestamp.fromDate(new Date()).toMillis()}.${type == "image/jpeg" ? "jpg" : "png"}`);
          const uploadTask = uploadBytesResumable(storageRef, this.file);
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.then(async (snapshot) => {
            let url = await getDownloadURL(snapshot.ref);
            let imagesUrl: string[] = [];
            if (url) {
              imagesUrl.push(url);
            }
            await this.adService.createAd(
              title,
              category,
              price,
              description,
              imagesUrl,
              state
            );
          });
        }
      }
      else {
        await this.adService.createAd(
          title,
          category,
          price,
          description,
          [],
          state
        );
      }

      this.router.navigate(["account"])
    }
  }

  takePhoto(imagesUrl: HTMLInputElement, event: any) {
    this.file = event.target.files[0];
    if (imagesUrl.files) {
      this.photoSourceObj = imagesUrl.files[0];
    }

    if (this.photoSourceObj) {
      this.showPreview = true;
      const reader = new FileReader();
      reader.readAsDataURL(this.photoSourceObj);

      reader.onload = (_e) => {
        const imageUrl = reader.result;

        this.photoReadersubject.next([
          //...this.photoReadersubject.getValue(),
          imageUrl,
        ]);

      };
    }
  }

  removeFile(){
    this.photoReadersubject.next([]);
  }
}
