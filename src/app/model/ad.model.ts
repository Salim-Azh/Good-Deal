import { DocumentReference, Timestamp } from "firebase/firestore";

export class Ad {
   id!: string;
   advertiser!: DocumentReference;
   advertiserName!: string;
   category!: string;
   createdAt!: Timestamp;
   deal!: boolean;
   description!: string;
   imagesUrl!: any[];
   latitude!: number;
   longitude!: number;
   price!: number;
   residenceName!: string;
   residenceRef!:DocumentReference;
   state!: string;
   title!: string;
}
