import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
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

  @Input() chat?: Chat;

  public getScreenWidth: any;
  SCREEN_SM = 960;
  textFieldCSS = "";

  id: string;
  currentUser: User;
  messages: Message[];
  ladate: any;
  displayDate: string;
  msg!: Message;
  heure: any;

  subscription: Subscription = new Subscription;

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

    let subscription2 = this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });

    if (this.chat) {
      this.messages = await this.messageService.loadMessagesByChatRef(this.chat.ref)
      console.log(this.messages);
    }
    console.log(this.chat)

    this.messages.forEach(msg => {
      this.heure = this.formatDate(msg.sentAt);
    });

    this.subscription.add(subscription1)
    this.subscription.add(subscription2)

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > this.SCREEN_SM) {
      this.setTabletCSS();
    } else {
      this.setPhoneCSS();
    }

  }


  async ngOnChanges(_simpleChange: any) {

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > this.SCREEN_SM) {
      this.setTabletCSS();
    } else {
      this.setPhoneCSS();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async send(msg: string) {
    if (this.chat) {
      await this.messageService.saveMessage(msg, this.currentUser.username, this.currentUser.userRef, this.chat.ref)
    }
  }

  formatDate(ladate: Timestamp) {
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

  @HostListener('window:resize', ['$event'])
  onWindowResize() {

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth < this.SCREEN_SM) {
      //this.textFieldCSS = "";
      this.setPhoneCSS();
    } else {
      this.setTabletCSS();


    }
  }

  setTabletCSS(){
    this.textFieldCSS = "padding: 15px 20px 35px 20px; bottom:76px; right: 0; width: 60%;";
  }

  setPhoneCSS(){
    this.textFieldCSS = "padding:20px; bottom:0; left:0;";
  }
}
