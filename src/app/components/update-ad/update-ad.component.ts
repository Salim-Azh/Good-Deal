import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { Ad } from 'src/app/model/ad.model';
import { User } from 'src/app/model/user.model';
import { AdService } from 'src/app/services/ad.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent implements OnInit {



  disabledPublishBtn: boolean;
  title: string;
  price: string
  state: string;

  id: string;
  ad?: Ad;
  currentUser: User;


  photoSourceObj: File | null;
  showPreview: boolean;

  private photoReadersubject = new BehaviorSubject<(string | ArrayBuffer | null)[]>([]);
  public readablePhotoList$ = this.photoReadersubject.asObservable();

  file?: File;
  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private adService: AdService,
    private userService: UserService) {
    this.id = "";
    this.currentUser = new User();


    this.title = "";
    this.price = "";
    this.state = "";
    this.disabledPublishBtn = true;
    this.showPreview = false;
    this.photoSourceObj = null;


  }

  async ngOnInit(){
    this.route.params.subscribe(async params => {
      this.id = params['id'];
    });

    try {
      this.ad = await this.adService.getAdById(this.id)
      console.log(this.ad);
    } catch (error) {
      console.log(error)
    }
    this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });
    console.log(this.id)
  }

  setDisableBtn() {
    this.disabledPublishBtn = !this.title || !this.price || !this.state //|| this.state == "none";
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


  updateAd(title: string, category: any, price: any, description: any, state: any){

  }


}
