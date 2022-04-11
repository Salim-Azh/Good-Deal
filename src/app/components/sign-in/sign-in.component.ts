import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentReference } from 'firebase/firestore';
import { Residence } from 'src/app/model/residence.model';
import { AuthService } from 'src/app/services/auth.service';
import { ResidenceService } from 'src/app/services/residence.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() redirectTo = "";
  signup: boolean = false;
  residences: Residence[] = [];

  disabledLoginBtn: boolean;
  disabledSignUpBtn : boolean;

  email:string;
  password:string;
  firstName: string;
  lastName: string;
  residenceName: string;

  showErrorMsg: boolean;
  errorMsg: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private residenceService: ResidenceService,
  ) {
    this.disabledLoginBtn = true;
    this.disabledSignUpBtn = true;
    this.email = "";
    this.password = "";
    this.firstName = "";
    this.lastName = "";
    this.residenceName = "";
    this.errorMsg = "";
    this.showErrorMsg = false;
  }

  async ngOnInit(): Promise<void> {
    this.residences = await this.residenceService.getResidences();
  }

  setEmailFormState(fEmail:string){
    this.email = fEmail;
    this.setDisableBtn();
  }

  setPasswordFormState(fPassword:string){
    this.password = fPassword;
    this.setDisableBtn();
  }

  setFirstNameFormState(fFirstName:string){
    this.firstName = fFirstName;
    this.setDisableBtn();
  }

  setLastNameFormState(fLastName:string){
    this.lastName = fLastName;
    this.setDisableBtn();
  }

  setResidenceNameFormState(fResidenceName:string){
    this.residenceName = fResidenceName;
    this.setDisableBtn();
  }

  setDisableBtn(){
    if (this.signup) {
      this.disabledSignUpBtn = !this.email || !this.password || !this.firstName || !this.residenceName
    }
    else{
      this.disabledLoginBtn = !this.email || !this.password
    }
  }

  setFormType() {
    this.showErrorMsg = false;
    this.signup = !this.signup;
  }

  async login() {
    const errorMsg: string | void = await this.authService.signIn(this.email, this.password);
    if (errorMsg) {
      this.errorMsg = errorMsg;
      this.showFormError();
    }
    else{
      this.router.navigate([this.redirectTo])
    }
  }


  private showFormError(){
    this.showErrorMsg = true;
    setTimeout(()=>{
      this.showErrorMsg = false
    },
    5000);
  }

  async register() {

    const residenceRef = this.getResidenceRefFromName();
    const username = this.createUsername();

    if (residenceRef) {
      const errorMsg: string|void = await this.authService.signUp(username, this.email, this.password, residenceRef)
      if (errorMsg) {
        this.errorMsg = errorMsg;
        this.showFormError()
      }
      else {
        this.router.navigate([this.redirectTo])
      }
    }
  }

  private createUsername(){
    let username = "";
    if (this.lastName) {
      username = `${this.firstName} ${this.lastName}`
    }
    else{
      username = `${this.firstName}`
    }
    return username
  }

  private getResidenceRefFromName(){
    let residenceRef: DocumentReference | undefined = undefined;
    this.residences.forEach(resid => {
      if (this.residenceName == resid.name) {
        residenceRef = resid.reference;
      }
    });
    return residenceRef;
  }
}
