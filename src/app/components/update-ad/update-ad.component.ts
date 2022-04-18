import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ad } from 'src/app/model/ad.model';
import { User } from 'src/app/model/user.model';
import { AdService } from 'src/app/services/ad.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.scss']
})
export class UpdateAdComponent implements OnInit {

  id: string;
  ad?: Ad;
  currentUser: User;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private adService: AdService,
    private userService: UserService) {
    this.id = "";
    this.currentUser = new User();
  }

  async ngOnInit(){
    this.route.params.subscribe(async params => {
      this.id = params['id'];
    });

    try {
      this.ad = await this.adService.getAdById(this.id)
    } catch (error) {
      console.log(error)
    }
    this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });
    console.log(this.id)
  }




}
