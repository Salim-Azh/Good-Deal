import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User|null>;

  constructor(private auth: Auth,private router: Router) {
    this.user = authState(auth);
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .catch((error) => {
        this.handleError(error);
      });
  }

  private handleError(error: any){
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(`${errorCode}: ${errorMessage}`);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .catch((error) => {
        this.handleError(error);
      });
  }

  signOut(){
    return signOut(this.auth).then(() => {
      this.router.navigate(['home']);
    }).catch((error) => {
      window.alert(error);
    });
  }
}
