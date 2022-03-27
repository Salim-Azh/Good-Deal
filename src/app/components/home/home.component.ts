import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { getAuth } from 'firebase/auth';
import { Ad } from 'src/app/model/ad.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SearchService } from 'src/app/services/search.service';
import { ResidenceService } from 'src/app/services/residence.service';
import { Residence } from 'src/app/model/residence.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

/*
 * La classe HomeComponent permet
 *    - l'affichage de toutes les annonces si l'utilisateur n'est pas connecté
 *    - l'affichage de toutes les annonces de la résidence de l'utilisateur s'il est connecté
 *    - la recherche suivant le titre de l'annonce ou la résidence
 *
 */
export class HomeComponent implements OnInit {
  /*
    Récupération de l'url de l'image
     Failed à cause d'un problème d'accès et d'authentification

    const storage = getStorage();
    const url = getDownloadURL(ref(storage, 'asus-router-5b2c15befa6bcc0036b45c76.jpg'));
   */

  ads: Ad[] = [];
  residences: Residence[] = [];
  selectedResidence: Residence | undefined = undefined;
  user: User;
  selected: Ad | null = null;

  showFilters: boolean;

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private searchService: SearchService,
    private residenceService: ResidenceService
  ) {
    this.user = new User();
    this.showFilters = false;
  }


  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid;
    try {
      this.user = await this.userService.getUser(uid);
      this.ads = await this.searchService.searchDefault();
      this.residences = await this.residenceService.getResidences();
    } catch (error) {
      console.log(error)
    }
  }

  switchFilters(){
    this.showFilters = !this.showFilters;
  }

  onChangeResidence(residenceName : string){
    if (residenceName =="none") {
      this.selectedResidence = undefined;
    } else {
      this.residences.forEach(residence => {
        if (residence.name == residenceName) {
          this.selectedResidence = residence;
        }
      });
    }
  }

  async getSearchResultsTextWithNoFilters(input: any) {
    if (input) {
      this.ads = await this.searchService.searchText(input);
    }
  }

  async search(input?: string) {
    if(this.selectedResidence){
      if (input) {
        this.ads = await this.searchService.searchTextResidence(input, this.selectedResidence.reference);
      }
      else {
        this.ads = await this.searchService.searchResidence(this.selectedResidence.reference);
      }
    }
    else{
      if (input) {
        this.ads = await this.searchService.searchText(input);
      }
      else {
        this.ads = await this.searchService.getAds();
      }
    }
  }

  async onSelect(ad: Ad) {
    this.selected = ad;
    //this.listAds.nativeElement.setAttribute('fxHide.lt-sm', '');
    //this.detailsAds.nativeElement.removeAttribute('fxHide.lt-sm');
  }


  //Récupération d'elements html pour gérer la version phone de l'affichage
  //des détails d'une annonce Failed
  //@ViewChild('listAds') listAds!: ElementRef;
  //@ViewChild('deatailsAds') detailsAds!: ElementRef;

}
