import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { getDoc } from 'firebase/firestore';
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
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss'],
})
export class PublishComponent implements OnInit {
  user: User;
  path: string = '/publish';

  residenceName: string = 'Residence ...';

  photoSourceObj: File | null;
  showPreview: boolean;

  private photoReadersubject = new BehaviorSubject<(string | ArrayBuffer | null)[]>(
    []
  );
  public readablePhotoList$ = this.photoReadersubject.asObservable();

  private filePhotoListSubject = new BehaviorSubject<{}[]>([]);
  public filePhotoList$ = this.filePhotoListSubject.asObservable();

  @Input() file?: File;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private adService: AdService
  ) {
    this.user = new User();
    this.showPreview = false;
    this.photoSourceObj = null;
  }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid;
    this.user = await this.userService.getUser(uid);
    if (this.user) {
      const docSnap = await getDoc(this.user.residence);
      this.residenceName = docSnap.get('name');
    }
  }

  async createAd(
    title: string,
    category: any,
    price: any,
    description: any,
    file: any,
    state: any
  ) {
    if (this.user) {
      this.showPreview = false;
      if(file){
        const storage = getStorage();
        const storageRef = ref(storage, 'Images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
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
      else{
        await this.adService.createAd(
          title,
          category,
          price,
          description,
          [],
          state
        );
      }
    }
  }

  takePhoto(FormimagesUrl: HTMLInputElement, event: any) {
    this.file = event.target.files[0];
    if (FormimagesUrl.files) {
      this.photoSourceObj = FormimagesUrl.files[0];
    }

    if (!!this.photoSourceObj) {
      this.showPreview = true;
      const reader = new FileReader();
      reader.readAsDataURL(this.photoSourceObj);

      reader.onload = (_e) => {
        const imageUrl = reader.result;

        this.photoReadersubject.next([
          ...this.photoReadersubject.getValue(),
          imageUrl,
        ]);

      };
    }
  }

}
