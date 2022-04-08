import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, DocumentReference, getDoc, getDocs, query, setDoc } from 'firebase/firestore';
import { Residence } from 'src/app/model/residence.model';
import { User } from 'src/app/model/user.model';
import { AdService } from 'src/app/services/ad.service';
import { AuthService } from 'src/app/services/auth.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { UserService } from 'src/app/services/user.service';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() redirectTo = "";
  signup:boolean = false;
  residences: Residence[] = [];

  username: any;

  ads: { adRef: DocumentReference, title: string, id?: string, deal: boolean }[] = [];


  SelectedValue: string;
  usernameValue: string;
  authUid: string | undefined;
  user: User;

  constructor(private authService: AuthService, private router: Router, private residenceService: ResidenceService,
    private userService: UserService,
    private adService: AdService,
    private firestore: Firestore) {

      this.user = new User();
    this.SelectedValue= "";
    this.usernameValue = "";
    this.authUid = undefined;




   }

  async ngOnInit(): Promise<void> {
  this.residences = await this.residenceService.getResidences();


  }


  login(email:string, password:string){
    console.log('email');
    this.authService.signIn(email,password);
    this.router.navigate([this.redirectTo])
  }

  change(){
    this.signup = !this.signup;

  }

  async register(email:string, password:string){


    this.authService.signUp(email,password).then(async () => {

      const residenceRef = this.SelectedValue;
      const username = this.usernameValue;
      console.log(residenceRef);
      console.log(username);
      const uid = getAuth().currentUser?.uid;
      console.log('Uid',uid)
      console.log('User: ',email)



      const dbInstance = doc(this.firestore, 'users/'+ uid);
      const docSnap = await getDoc(this.user.residence);

      const docData = {
        ads: this.ads,
        residence: this.SelectedValue,
        username: username
      };
      setDoc(dbInstance, docData)

    });







    this.router.navigate([this.redirectTo])
  }



}




