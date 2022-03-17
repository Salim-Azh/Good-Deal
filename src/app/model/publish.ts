export interface Publish {
  id: string;
  //advertiser!: DocumentReference;
  advertiserName: string;
  category: string;
  //createdAt!: Timestamp;
  deal: boolean;
  description: string;
  imagesUrl: any[];
  latitude: number;
  longitude: number;
  price: number;
  residenceName: string;
  state: string;
  title: string;
}
