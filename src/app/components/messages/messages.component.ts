import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { User } from '../../model/user.model';
import { Chat } from 'src/app/model/chat.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  path: string = "/chats";
  authUid: string | undefined;
  user: User;
  chats: Chat[];
  selected?: Chat;
  sub: Subscription = new Subscription;

  public getScreenWidth: any;
  SCREEN_SM = 960;
  messagesDisplay = "";
  chatDisplay = "";
  returnDisplay = "";
  detailsMode = false;

  chatCSS = "";
  messagesCSS = "";

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatService: ChatService,
    private router: Router
  ) {
    this.router.getCurrentNavigation()?.extras.state;

    this.authUid = undefined;
    this.user = new User();
    this.chats = [];
  }

  async ngOnInit(): Promise<void> {

    this.initMasterDetailsPattern();

    onAuthStateChanged(getAuth(), async user => {

      await this.getChats();

      if (this.chats){
        this.initMasterDetailsPattern();
      }

      this.sub = this.authService.user.subscribe(async value => {
        this.user = await this.userService.getUser(value?.uid);
      });
    });
  }


  initMasterDetailsPattern() {

    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth < this.SCREEN_SM) {
      this.messagesDisplay = "block";
      this.chatDisplay = "none";
    }
    else {
      this.returnDisplay = "none";
      if (!this.selected) {
        this.selected = this.chats[0];
      }
      this.setTabletCSS();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {

    this.getScreenWidth = window.innerWidth;
    if (!this.selected) {
      this.selected = this.chats[0];
    }

    if (this.getScreenWidth < this.SCREEN_SM) {
      this.chatCSS = "";
      this.messagesCSS = "";
      if (!this.detailsMode) {
        this.chatDisplay = "none";
      }
      else {
        this.chatDisplay = "block";
        this.returnDisplay = "block";
        this.messagesDisplay = "none";
      }
    }
    else {
      this.chatDisplay = "block";
      this.messagesDisplay = "block";
      this.returnDisplay = "none";
      this.setTabletCSS();
    }
  }

  async getChats(){

    this.chats = await this.chatService.loadChats();

  }

  setTabletCSS() {
    this.messagesCSS = "float:left; width:40%; overflow:scroll; padding-top:20px;";
    this.chatCSS = "float:left; height:100vh !important; width:60%; overflow:hidden; position:fixed; right:0; top:0;";
  }

  onSelect(chat: Chat) {

    this.detailsMode = true;
    this.selected = chat;
    if (this.getScreenWidth < this.SCREEN_SM) {
      this.messagesDisplay = "none";
      this.chatDisplay = "block";
      this.returnDisplay = "block";
    } else {
      this.returnDisplay = "none";
    }

    this.chatService.read(chat.id);

  }

  redirectedToChatList() {
    this.detailsMode = false;
    this.selected = undefined;
    this.chatDisplay = "none";
    this.messagesDisplay = "block";
  }

}
