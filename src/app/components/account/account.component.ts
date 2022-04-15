import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  path: string = "/home"
  user: User | undefined = undefined;

  constructor(public authService: AuthService, private userService: UserService) {
  }

  async ngOnInit() {
    this.authService.user.subscribe(async value => {
      this.user = await this.userService.getUser(value?.uid);
    });
  }


  signOut(){
    this.authService.signOut();
  }
}
