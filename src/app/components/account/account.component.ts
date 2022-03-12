import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  isAuthenticated: any;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.authStatusListener();
  }

  signOut(){
    this.authService.signOut();
  }
}
