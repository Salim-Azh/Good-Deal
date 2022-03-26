import { Component, OnInit } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { User } from 'src/app/model/user.model';
import { AdService } from 'src/app/services/ad.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-ads-list',
  templateUrl: './my-ads-list.component.html',
  styleUrls: ['./my-ads-list.component.scss']
})
export class MyAdsListComponent implements OnInit {

  ads: { adRef: DocumentReference, title: string, id?: string, deal: boolean }[] = [];
  user: User;

  constructor(
    private userService: UserService,
    private adService: AdService
  ) {
    this.user = new User();
  }

  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid
    this.user = await this.userService.getUser(uid);
    this.ads = this.user.ads
  }

  async markAdAsDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await this.adService.markAdAsDealByRef(adId, adRef);
      this.ngOnInit()
    }
  }

  async cancelAdDealByRef(adId: any, adRef: any) {
    if (adRef && adId) {
      await this.adService.cancelAdDealByRef(adId, adRef);
      this.ngOnInit()
    }
  }


  //NOT WORKING ON NESTED MAPS
  async deleteAd(id: any, adRef: any, title: any) {
    if (adRef && id) {
      await this.adService.deleteAd(id, adRef,title);
      this.ngOnInit()
    }
  }
}
