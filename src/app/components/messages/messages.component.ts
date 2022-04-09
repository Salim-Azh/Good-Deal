import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { ChatService } from 'src/app/services/chat.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Chat } from 'src/app/model/chat.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  path: string = "/messages";
  chats: Chat[] = [];

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private chatService: ChatService
    ) {}

  async ngOnInit(): Promise<void> {

    onAuthStateChanged(getAuth(), async user => {
      this.chats = await this.chatService.getChats();
    });
    
  }
}
