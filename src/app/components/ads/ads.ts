import { Timestamp } from "firebase/firestore";

export interface Ads {
    id?: string;
    advertiserName : string;
    category: string;
    createdAt: Timestamp;
    description: string;
    imagesUrl: string;
    latitude: number;
    longitude: number;
    price: number;
    residenceName: string;
    state: string;
    title: string;
}
