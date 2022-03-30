import { Component, OnInit, HostListener } from '@angular/core';
import { User } from '../../model/user.model';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
  authUid: string |undefined;
  showFilters: boolean;

  public getScreenWidth: any;
  SCREEN_SM = 960;
  adsDisplay = "";
  adDetailsDisplay = "";
  returnDisplay = "";
  detailsMode = false;
  

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private searchService: SearchService,
    private residenceService: ResidenceService
  ) {
    this.user = new User();
    this.showFilters = false;
    this.authUid = undefined;
  
  }

  async init(){
    onAuthStateChanged(getAuth(), async user => {
      this.ads = await this.searchService.searchDefault();
      if (user) {
        this.authUid = user.uid;
        this.user = await this.userService.getUser(this.authUid);
        this.residences = await this.residenceService.getResidences();
        this.residences.forEach(residence => {
          if (this.user.residence.path == residence.reference.path) {
            this.selectedResidence = residence;
          }
        });
      }
      else{
        this.residences = await this.residenceService.getResidences();
      }
    })
  }


  /**
   * Innitialisation du patron maître-détails 
   * selon la taille de l'écran
   */
  async initMasterDetailsPattern(){

    this.getScreenWidth = window.innerWidth;

    if(this.getScreenWidth < this.SCREEN_SM){
      this.adsDisplay = "block";
      this.adDetailsDisplay = "none";
    }

  }

  async ngOnInit(): Promise<void> {
    await this.init()
    await this.initMasterDetailsPattern();
  }

  /**
   * Dès que la taille de l'écran change le patron maître-détails s'adapte
   */
  @HostListener('window:resize',['$event'])
  onWindowResize(){

    this.getScreenWidth = window.innerWidth;

    
    if(this.getScreenWidth < this.SCREEN_SM){
      console.log(this.detailsMode);
      if(this.detailsMode==false){
        this.adDetailsDisplay = "none";
      }else{
        this.adDetailsDisplay = "block";
        this.adsDisplay = "none";
      } 
    } else {
      this.adDetailsDisplay = "block";
      this.adsDisplay = "block";
      this.returnDisplay = "none";
    }
  }

  switchFilters(){
    this.showFilters = !this.showFilters;
  }

  onChangeResidence(residenceName : string, input?:string){
    if (residenceName =="none") {
      this.selectedResidence = undefined;
    } else {
      this.residences.forEach(residence => {
        if (residence.name == residenceName) {
          this.selectedResidence = residence;
        }
      });
    }
    this.showFilters = false;
    this.search(input);
  }

  async getSearchResultsTextWithNoFilters(input: any) {
    if (input) {
      this.ads = await this.searchService.searchText(input);
    }
  }

  async search(input?: string) {
    if(this.selectedResidence){
      if (input) {
        console.log("a")
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

  /**
   * 
   * @param ad = l'annonce sélectionnée par l'utilisateur
   * 
   */
  async onSelect(ad: Ad) {
    this.detailsMode = true;
    console.log(this.detailsMode);
    this.selected = ad;

    /**Mode téléphone : 
     * lorsqu'une annonce est sélectionné 
     * la liste des annonces disparait 
     * et les détails de l'annonce sélectionnée apparaissent
     */   
    if(this.getScreenWidth < this.SCREEN_SM){
      this.adsDisplay = "none";
      this.adDetailsDisplay = "block";
      this.returnDisplay = "block";
    }else{
      this.returnDisplay = "none";
    }
  }

  /**Mode téléphone:
   * permet à l'utilisateur de retourner dur la liste des annonces
   * lorsqu'il est sur les détails d'une annonce
   * 
   */
  async redirectedToAdsList(){
    this.detailsMode = false;
    console.log(this.detailsMode);
    this.adDetailsDisplay = "none";
    this.adsDisplay = "block";
  }
}
