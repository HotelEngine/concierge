export interface IGeoLocation {
    latitude: number
    longitude: number
}

export interface IPropertyCode {
    codes: string[]
    supplierName: string
}

export interface IProperty {
    location: IGeoLocation
    codes: IPropertyCode[]
    id: string
    // giataId: string
    updatedAt: string
}
