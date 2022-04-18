import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  path: string = "/home"
  user: User | undefined = undefined;

  sub!:Subscription

  constructor(public authService: AuthService, private userService: UserService) {}

  ngOnInit() {
    this.sub = this.authService.user.subscribe(async value => {
      this.user = await this.userService.getUser(value?.uid);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  signOut(){
    this.authService.signOut();
  }
}
