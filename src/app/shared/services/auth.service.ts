import { Injectable } from '@angular/core';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: any = undefined;

  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus = this.authStatusSub.asObservable();

  constructor(public fireAuth: AngularFireAuth, public router: Router) {
    this.authStatusListener();
  }

  authStatusListener(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user)=>{
      if(user){
        console.log(user);
        this.authStatusSub.next(user);
        console.log('User is logged in');
      }
      else{
        this.authStatusSub.next(null);
        console.log('User is logged out');
      }
    });
  }

  signUp(email: string, password: string): Promise<any> {
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password)
      .then((_userCredential) => {
        this.router.navigate(['home']);
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  private handleError(error: any): void{
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert(`${errorCode}: ${errorMessage}`);
  }

  signIn(email: string, password: string): Promise<any> {
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password)
      .then((_userCredential) => {
          this.router.navigate(['home']);
      })
      .catch((error) => {
        this.handleError(error);
      });
  }

  signOut(): Promise<any>{
    const auth = getAuth();
    return signOut(auth).then(() => {
      this.router.navigate(['home']);
    }).catch((error) => {
      window.alert(error);
    });
  }
}
