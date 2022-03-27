import { DocumentReference } from "firebase/firestore";

export interface Residence {
   id: string;
   reference: DocumentReference;
   name: string;
   city: string;
   displayAddress: string;
   latitude: number;
   longitude: number;
}
