import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  authState } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { doc, DocumentReference, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User|null>;

  constructor(private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {
    this.user = authState(auth);
  }

  async signUp(username: string, email: string, password: string, residenceRef: DocumentReference) {

    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async ()=>{
        const uid = getAuth().currentUser?.uid;
        if (uid) {
          await setDoc(doc(this.firestore, "users", uid), {
            ads: {},
            residence: residenceRef,
            username: username
          });
        }

      })
      .catch((error)=>{
        const code = error.code
        if (code == "auth/email-already-in-use") {
          return "Compte déjà existant pour cette adresse email";
        }
        if (code == "auth/invalid-email") {
          return "Adresse email invalide";
        }
        return `${code} ${error.message}`
      })
  }

  async signIn(email: string, password: string) {

    return signInWithEmailAndPassword(this.auth, email, password)
      .then(()=>{
        // intentional empty method : needed for type Promise<string | void>
      })
      .catch((error)=>{
        const code = error.code
        if (code == "auth/wrong-password") {
          return "Mauvais mot de passe";
        }
        if (code == "auth/user-not-found") {
          return "Aucun utilisateur trouvé pour cette adresse email";
        }
        if (code == "auth/invalid-email") {
          return "Adresse email invalide";
        }
        return `${code} ${error.message}`
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
