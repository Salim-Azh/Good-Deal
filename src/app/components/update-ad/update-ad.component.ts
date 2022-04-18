import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';
import { Ad } from 'src/app/model/ad.model';
import { User } from 'src/app/model/user.model';
import { AdService } from 'src/app/services/ad.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss'],
})
export class UpdateAdComponent implements OnInit {
  disabledUpdateBtn: boolean;
  title: string;
  price: string;
  state: string;

  id: string;
  ad!: Ad;
  currentUser: User;

  photoSourceObj: File | null;
  showPreview: boolean;

  showOld: boolean;
  oldImgDeleted: boolean;

  private photoReadersubject = new BehaviorSubject<
    (string | ArrayBuffer | null)[]
  >([]);
  public readablePhotoList$ = this.photoReadersubject.asObservable();

  file?: File;
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private adService: AdService,
    private userService: UserService,
    private router: Router
  ) {
    this.id = '';
    this.currentUser = new User();

    this.title = '';
    this.price = '';
    this.state = '';
    this.disabledUpdateBtn = true;
    this.showPreview = false;
    this.photoSourceObj = null;
    this.oldImgDeleted = false;
    this.showOld = false;
  }

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
    });

    try {
      this.ad = await this.adService.getAdById(this.id);
    } catch (error) {
      console.log(error);
    }
    this.authService.user.subscribe(async (value) => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });

    this.showOldImg();
    this.setTitleState(this.ad.title);
    this.setAdState(this.ad.state);
    this.setPriceState(this.ad.price+'');
  }

  setDisableBtn() {
    this.disabledUpdateBtn = !this.title || !this.price || !this.state; //|| this.state == "none";
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
        this.showOld = false;
        const imageUrl = reader.result;

        this.photoReadersubject.next([
          //...this.photoReadersubject.getValue(),
          imageUrl,
        ]);
      };
    }
  }

  showOldImg() {
    this.showOld = !this.showOld;
  }

  removeOldFile() {
    this.oldImgDeleted = true;
    this.showOld = false;
  }

  removeFile() {
    this.photoReadersubject.next([]);
  }

  async updateAd(
    title: string,
    category: any,
    price: any,
    description: any,
    state: any
  ) {

    this.saveChanges(
      title,
      category,
      price,
      description,
      state,
    );
    this.router.navigate(['account']);
  }

  async saveChanges(
    title: string,
    category: any,
    price: any,
    description: any,
    state: any,
  ) {
    if (this.currentUser) {
      this.showPreview = false;
      if (this.file) {
        const type = this.file.type;
        if (type == 'image/jpeg' || type == 'image/png') {
          const storage = getStorage();
          const storageRef = ref(
            storage,
            `Images/${Timestamp.fromDate(new Date()).toMillis()}.${type == 'image/jpeg' ? 'jpg' : 'png'
            }`
          );
          const uploadTask = uploadBytesResumable(storageRef, this.file);
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.then(async (snapshot) => {
            let url = await getDownloadURL(snapshot.ref);
            let imagesUrl: string[] = [];
            if (url) {
              imagesUrl.push(url);
            }
            await this.adService.updateAd(
              this.ad.ref,
              title,
              this.ad.title,
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
        if(!this.oldImgDeleted){
          await this.adService.updateAd(
            this.ad.ref,
            title,
            this.ad.title,
            category,
            price,
            description,
            this.ad.imagesUrl,
            state
          );
        }
        else{
          await this.adService.updateAd(
            this.ad.ref,
            title,
            this.ad.title,
            category,
            price,
            description,
            [],
            state
          );
        }
      }
    }
  }
}
