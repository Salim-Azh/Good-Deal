import { DocumentReference } from 'firebase/firestore';

export class Residence {
   id!: string;
   name!: string;
   city!: string;
   displayAddress!: string;
   latitude!: number;
   longitude!: number;

   //ads!: { adRef: DocumentReference; title:string; price:number; imgUrl:any[]};
   //ads!: any[];

 /* constructor(id:string, name:string, ads:any[]){
      this.id=id;
      this.name=name;
      this.ads=ads;
   }*/
}
