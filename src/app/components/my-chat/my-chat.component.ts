import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
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
export class MyChatComponent implements OnInit {

  id: string;
  chat?:Chat;
  currentUser: User;
  messages: Message[];
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
  }

  async ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = params['id'];
    });

    try {
      this.chat = await this.chatService.getChatById(this.id)
    } catch (error) {
      console.log(error)
    }
    this.authService.user.subscribe(async value => {
      this.currentUser = await this.userService.getUser(value?.uid);
    });

    if(this.chat) {
      this.messages = await this.messageService.getMessagesByChatRef(this.chat.ref)
    }

    this.messages.forEach(msg => {
      //msg.sentAt = this.formatDate(msg.sentAt);
    });
  }

  formatDate(timestamp : Timestamp){

  }


}
