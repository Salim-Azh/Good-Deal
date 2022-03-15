import { DocumentReference, Timestamp } from "firebase/firestore";

export interface Ads {
    id: string,
    advertiser: DocumentReference,
    advertiserName: string,
    category: string,
    createdAt: Timestamp,
    description: string,
    imagesUrl: any[],
    latitude: number,
    longitude: number,
    price: number,
    residenceName: string,
    state: string,
    title: string
}
