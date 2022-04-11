import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Ad {
   id: string;
   advertiser: DocumentReference;
   advertiserName: string;
   category: string;
   createdAt: Timestamp;
   deal: boolean;
   description: string;
   imagesUrl: string;
   latitude: number;
   longitude: number;
   price: number;
   residenceName: string;
   residenceRef:DocumentReference;
   state: string;
   title: string;
   titleIgnoreCase: string;
}
