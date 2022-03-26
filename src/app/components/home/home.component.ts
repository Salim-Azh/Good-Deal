import { Component, OnInit } from '@angular/core';
import { User } from '../../model/user.model';
import { getAuth } from 'firebase/auth';
import { Ad } from 'src/app/model/ad.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SearchService } from 'src/app/services/search.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

/**
 * La classe HomeComponent permet
 *    - l'affichage de toutes les annonces si l'utilisateur n'est pas connecté
 *    - l'affichage de toutes les annonces de la résidence de l'utilisateur s'il est connecté
 *    - la recherche suivant le titre, la catégorie de l'annonce ou la résidence
 *
 */
export class HomeComponent implements OnInit {
  /**
   * Récupération de l'url de l'image
   *  Failed à cause d'un problème d'accès et d'authentification
   *
   * const storage = getStorage();
   * const url = getDownloadURL(ref(storage, 'asus-router-5b2c15befa6bcc0036b45c76.jpg'));
   */

  ads: Ad[] = [];
  user: User;
  selected: Ad | null = null;


  constructor(
    public authService: AuthService,
    private userService: UserService,
    public searchService: SearchService
  ) {
    this.user = new User();
  }


  async ngOnInit(): Promise<void> {
    const uid = getAuth().currentUser?.uid;
    try {
      this.user = await this.userService.getUser(uid);
      this.ads = await this.searchService.searchDefault();
    } catch (error) {
      console.log(error)
    }
  }

  async getSearchResultsTextWithNoFilters(input: any){
    if(input){
      this.ads = await this.searchService.getSearchResultsTextWithNoFilters(input);
    }
  }
/*
  async getSearchResultsTextByCategory(input: any){
    if(input){
      this.ads = await this.searchService.getSearchResultsTextByCategory(input);
    }
  }

  async getSearchResultsTextByResidence(input: any){
    if(input){
      this.ads = await this.searchService.getSearchResultsTextByResidence(input);
    }
  }
*/
  /**
   * Récupération d'elements html pour gérer la version phone de l'affichage des détails d'une annonce
   * Failed
  *
  *  @ViewChild('listAds') listAds!: ElementRef;
  * @ViewChild('deatailsAds') detailsAds!: ElementRef;
  */


  async onSelect(ad: Ad) {

    this.selected = ad;
    //this.listAds.nativeElement.setAttribute('fxHide.lt-sm', '');
    //this.detailsAds.nativeElement.removeAttribute('fxHide.lt-sm');
  }

}
