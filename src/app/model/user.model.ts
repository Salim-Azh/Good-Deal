import { DocumentReference } from "firebase/firestore";

export class User {
    id!: string;
    username!: string;
    residence!: DocumentReference;
    ads!: {
      adRef: DocumentReference;
      title: string;
      deal:boolean;
    }[];

}
