import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth,private router: Router) {
  }

  authStatusListener(): any {
    onAuthStateChanged(this.auth, (user)=>{
      if(user){
        return user;
      }
      else{
        return false;
      }
    });
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((_userCredential) => {
        this.router.navigate(['home']);
      })
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
      .then((_userCredential) => {
          this.router.navigate(['home']);
      })
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
