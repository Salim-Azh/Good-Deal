import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { User } from '../../model/user.model';
import { Chat } from 'src/app/model/chat.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  path: string = "/chats";
  authUid: string | undefined;
  user: User;
  chats: Chat[];
  selected: Chat | null = null;

  public getScreenWidth: any;
  SCREEN_SM = 960;
  messagesDisplay = "";
  chatDisplay = "";
  navbarDisplay = "";
  detailsMode = false;

  chatCSS = "";
  messagesCSS = "";

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatService: ChatService
    ) {
      this.authUid = undefined;
      this.user = new User();
      this.chats = [];
    }

  async initMasterDetailsPattern() {

    this.getScreenWidth = window.innerWidth;

    if(this.getScreenWidth < this.SCREEN_SM) {
      this.messagesDisplay = "block";
      this.chatDisplay = "none";
    } 
  }

  async ngOnInit(): Promise<void> {

    await this.initMasterDetailsPattern();

    onAuthStateChanged(getAuth(), async user => {

      this.chats = await this.chatService.getChats();
      console.log(this.chats);

      if (this.getScreenWidth > this.SCREEN_SM) {
        this.selected = this.chats[0];
        this.setTabletCSS();
      }

      if(user){
        this.authUid = user.uid;
        this.user = await this.userService.getUser(this.authUid);
      }
    });

  }

  /**
   * Dès que la taille de l'écran change le patron maître-détails s'adapte
   */
   @HostListener('window:resize', ['$event'])
   onWindowResize() {
 
     this.getScreenWidth = window.innerWidth;
     if (this.selected == null) {
      this.selected = this.chats[0];
    }
 
     if (this.getScreenWidth < this.SCREEN_SM) {
       this.chatCSS = "";
       this.messagesCSS = "";
       if (this.detailsMode == false) {
         this.chatDisplay = "none";
       }
       else {
         this.chatDisplay = "block";
         this.messagesDisplay = "none";
       }
     }
     else {
       this.chatDisplay = "block";
       this.messagesDisplay = "block";
       this.setTabletCSS();
     }
   }

   setTabletCSS() {
    //this.searchCSS = "display:block; position:fixed; right:0; left:0; z-index:1;";
    this.messagesCSS = "float:left; width:40%; overflow:scroll; padding-top:100px;";
    this.chatCSS = "float:left; height:100vh !important; width:60%; overflow:hidden; position:fixed; right:0; top:0; padding-top:70px;";
    //this.filterCSS = "position:fixed; min-width:52vw; left:41vw; top:72px; z-index:2;";
  }

  async onSelect(chat: Chat){
    this.detailsMode = true;
    this.selected = chat;

    if(this.getScreenWidth < this.SCREEN_SM) {
      this.messagesDisplay = "none";
      this.chatDisplay = "block";
    } else {

    }
  }


}
