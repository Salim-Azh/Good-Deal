import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() redirectTo = "";
  signup:boolean = false;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
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
