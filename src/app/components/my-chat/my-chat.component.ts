import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/model/chat.model';
import { Message } from 'src/app/model/message.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss']
})
export class MyChatComponent implements OnInit, OnDestroy {

  id: string;
  chat?:Chat;
  currentUser: User;
  messages: Message[];
  ladate: any;
  displayDate: string;
  msg!: Message;
  heure:any;

  subscription: Subscription = new Subscription

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private chatService: ChatService,
    private messageService: MessageService,
  ) {
    this.id = "";
    this.currentUser = new User();
    this.messages = [];
    this.displayDate = "";
  }

  async ngOnInit() {
    let subscription1 = this.route.params.subscribe(async params => {
      this.id = params['id'];
    });

    try {
      this.chat = await this.chatService.getChatById(this.id)
    } catch (error) {
    }

    let subscription2 = this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });

    if(this.chat) {
      this.messages = await this.messageService.loadMessagesByChatRef(this.chat.ref)
    }

    this.messages.forEach(msg => {
      this.heure = this.formatDate(msg.sentAt);
    });

    this.subscription.add(subscription1)
    this.subscription.add(subscription2)
  }

  formatDate(ladate : Timestamp){
    const date = ladate.toDate();
    let datefinale = date.toLocaleDateString();

    let lheure = date.getHours().toString();
    let minute = date.getMinutes().toString();

    if (lheure.length == 1) {
      lheure = `0${lheure}`;
    }
    if (minute.length == 1) {
      minute = `0${minute}`;
    }

    return this.displayDate = `${datefinale} ${lheure}:${minute}`
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async send(msg: string){
    if (this.chat) {
      await this.messageService.saveMessage(msg, this.currentUser.username, this.currentUser.userRef, this.chat.ref)
    }
  }
}
