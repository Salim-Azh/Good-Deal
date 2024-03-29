import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { AdDetailsComponent } from './components/ad-details/ad-details.component';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PublishComponent } from './components/publish/publish.component';
import { MyChatComponent } from './components/my-chat/my-chat.component';
import { UpdateAdComponent } from './components/update-ad/update-ad.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'publish', component: PublishComponent},
  {path: 'chats', component: MessagesComponent},
  {path: 'account', component: AccountComponent},
  {path: 'account/:id', component: UpdateAdComponent},
  {path: 'chats/:id', component: MyChatComponent},
  {path: 'home/ads/:id/details', component: AdDetailsComponent},
  {path: '**', component: PageNotFoundComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
