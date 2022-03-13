import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  path: string = "/home"

  constructor(public authService: AuthService, private firestore: Firestore) {}

  signOut(){
    this.authService.signOut();
  }
}
