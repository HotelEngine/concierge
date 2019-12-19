import { IGeoLocation, IProperty, IPropertyCode } from '../concierge-types'
import { IGiataProperty } from '../giata-client/giata-types'

const STATUS_INACTIVE = 'inactive'

const toArray = (val): any[] => {
    return Array.isArray(val) ? val : [val]
}

export const getGeoLocation = (property: IGiataProperty): IGeoLocation => {
    return {
        latitude: property.geoCodes.geoCode.latitude,
        longitude: property.geoCodes.geoCode.longitude
    }
}

export const getActivePropertyCodes = (property: IGiataProperty): IPropertyCode[] => {
    const codes = property.propertyCodes || { provider: [] }
    const providers = toArray(codes.provider)
    return providers
        .filter(p => toArray(p.code).length)
        .map(p => {
            return {
                supplierName: p.attributes.providerCode,
                codes: toArray(p.code).reduce((total, code) => {
                    if (
                        !Array.isArray(code.value) &&
                        (!code.attributes || (code.attributes && code.attributes.status !== STATUS_INACTIVE))
                    ) {
                        total.push(code.value)
                    }
                    return total
                }, [])
            }
        })
}

export const getGiataId = (property: IGiataProperty): string => {
    return property.attributes.giataId
}

export const getProperty = (property: IGiataProperty): IProperty => {
    return {
        id: getGiataId(property),
        codes: getActivePropertyCodes(property),
        location: getGeoLocation(property),
        updatedAt: ''
    }
}
