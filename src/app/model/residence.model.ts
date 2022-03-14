import { Ad } from './ad.model';

export class Residence {
   id!: string;
   city!: string;
   displayAdress!: string;
   latitude!: number;
   longitude!: number;
   name!: string;
   ads!: Ad[];
}