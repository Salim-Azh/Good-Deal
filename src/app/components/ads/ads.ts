import { Timestamp } from "firebase/firestore";

export interface Ads {
    id?: string;
    imageUrl: string;
    title: string;
    price: number;
    residenceName: string;
}
