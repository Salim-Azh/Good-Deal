import { Component, OnInit } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from 'firebase/firestore';
import { Ad } from 'src/app/model/ad.model';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {

  searchResults: Ad[]= [];

  constructor(private firestore: Firestore) {}

  ngOnInit() {}

  async getSearchResultsTextWithNoFilters(input: any){
    if(input){
      const q = query(collection(this.firestore, "ads"), where("title", ">=",input), where("title", "<=", input+'\uf8ff'));
      const docSnap =  await getDocs(q);
      if(docSnap.size > 0){
        this.searchResults = [];
      }
      docSnap.docs.forEach(element => {
        const ad = {
          id: element.id,
          advertiser: element.get('advertiser'),
          advertiserName: element.get('advertiserName'),
          category: element.get('category'),
          createdAt: element.get('createdAt'),
          deal: element.get('deal'),
          description: element.get('description'),
          imagesUrl: element.get('imagesUrl'),
          latitude: element.get('latitude'),
          longitude: element.get('longitude'),
          price: element.get('price'),
          residenceName: element.get('residenceName'),
          state: element.get('state'),
          title: element.get('title'),
        } as Ad

        this.searchResults.push(ad);
      });
    }
  }
}
