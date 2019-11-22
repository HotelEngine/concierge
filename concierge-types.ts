export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface PropertyCode {
    codes: string[];
    supplierName: string;
}

export interface Property {
    location: GeoLocation;
    codes: PropertyCode[];
    id?: string;
    giataId: string;
}
