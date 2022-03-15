import { DocumentReference } from 'firebase/firestore';
import { Ad } from './ad.model';

export class Residence {
   id!: string;
   name!: string;
   city!: string;
   displayAddress!: string;
   latitude!: number;
   longitude!: number;
}
