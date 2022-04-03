import { DocumentReference, Timestamp } from "firebase/firestore";

export class Uploadfile {
  key: string;
  name: string;
  url: string;
  file: File;
  constructor(file: File) {
    this.file = file;
  }
}
