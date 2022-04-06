import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  signup:boolean = false;
  residences: Residence[] = [];
  constructor(private authService: AuthService, private router: Router, private residenceService: ResidenceService) { }

  async ngOnInit(): Promise<void> {
  this.residences = await this.residenceService.getResidences();
  }

  login(email:string, password:string){
    this.authService.signIn(email,password);
    this.router.navigate([this.redirectTo])
  }

  change(){
    this.signup = !this.signup;
  }

  register(email:string, password:string){
    this.authService.signUp(email,password);
    this.router.navigate([this.redirectTo])
  }
}
