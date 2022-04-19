import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/model/chat.model';
import { Message } from 'src/app/model/message.model';
import { User } from 'src/app/model/user.model';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-chat',
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss']
})
export class MyChatComponent implements OnInit,OnDestroy {

  @Input() chat?: Chat;

  public getScreenWidth: any;
  SCREEN_SM = 960;
  textFieldCSS = "";
  modal__contentCSS = "";

  id: string;
  currentUser: User;
  messages: Message[];
  ladate: any;
  displayDate: string;
  heure: any;
  msgToSend?: string;

  subscription: Subscription = new Subscription
  sendBtnDisabled: boolean;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private messageService: MessageService,
  ) {
    this.id = "";
    this.currentUser = new User();
    this.messages = [];
    this.displayDate = "";
    this.sendBtnDisabled = true;
  }

  async ngOnInit() {
    let subscription1 = this.route.params.subscribe(async params => {
      this.id = params['id'];
    });

    let subscription2 = this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });

    onAuthStateChanged(getAuth(), async user => {

      if (this.chat) {
        this.messages = await this.messageService.loadMessagesByChatRef(this.chat.ref)
      }
    });

    this.messages.forEach(msg => {
      this.heure = this.formatDate(msg.sentAt);
    });

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > this.SCREEN_SM) {
      this.setTabletCSS();
    } else {
      this.setPhoneCSS();
    }

    this.subscription.add(subscription1)
    this.subscription.add(subscription2)

  }


  async ngOnChanges(_simpleChange: any) {

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > this.SCREEN_SM) {
      this.setTabletCSS();
    } else {
      this.setPhoneCSS();
    }

    if (this.chat) {
      this.messages = await this.messageService.loadMessagesByChatRef(this.chat.ref)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async send(msg: string) {
    if (this.chat && !this.sendBtnDisabled) {
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
      this.setPhoneCSS();
    } else {
      this.setTabletCSS();


    }
  }

  setTabletCSS(){
    this.textFieldCSS = "padding: 15px 20px 35px 20px; bottom:76px; width: 60%;";
    this.modal__contentCSS = "top:5px; bottom:110px;";
  }


  setPhoneCSS(){
    this.textFieldCSS = "padding:20px; bottom:0; left:0; min-width: 100%";
    this.modal__contentCSS = "top:45px; bottom:45px;";
  }

  setMsgState(msgToSend: string){
    this.msgToSend = msgToSend;
    this.sendBtnDisabled = !this.msgToSend
  }
}
