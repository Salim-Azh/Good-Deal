import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  path: string = "/home"
  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  signOut(){
    this.authService.signOut();
  }
}
