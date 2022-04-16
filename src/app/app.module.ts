import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';

import { FooterMobileComponent } from './components/footer-mobile/footer-mobile.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { MessagesComponent } from './components/messages/messages.component';
import { PublishComponent } from './components/publish/publish.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MyAdsListComponent } from './components/my-ads-list/my-ads-list.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

import { AuthService } from './services/auth.service';
import { AdDetailsComponent } from './components/ad-details/ad-details.component';
import { GalleryModule} from 'ng-gallery';
import { MyChatComponent } from './components/my-chat/my-chat.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterMobileComponent,
    HomeComponent,
    PublishComponent,
    MessagesComponent,
    AccountComponent,
    PageNotFoundComponent,
    MyAdsListComponent,
    SignInComponent,
    AdDetailsComponent,
    MyChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
    MatCardModule,
    GalleryModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    MatToolbarModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideMessaging(() => getMessaging()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage()),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
