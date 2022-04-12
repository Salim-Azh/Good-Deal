import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { ChatService } from 'src/app/services/chat.service';
import { Ad } from '../../model/ad.model'

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.component.html',
  styleUrls: ['./ad-details.component.scss']
})
export class AdDetailsComponent implements OnInit {

  @Input() ad!: Ad;
  @Input() user?: User;

  constructor(
    private router : Router,
    private chatService : ChatService,
  ) {

  }

  ngOnInit(): void {
  }

  async contactUser(){
    if(this.user && this.ad){
      await this.chatService.createChat(this.user.userRef, this.user.username, this.ad.advertiser, this.ad.advertiserName);
    }
    this.router.navigate(['messages'])
  }
}
