import { IGeoLocation, IProperty, IPropertyCode } from '../../concierge-types'
import { IGiataProperty } from '../../lib/giata-client/giata-types'

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
    return property.propertyCodes.provider.map(p => {
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
        giataId: getGiataId(property),
        codes: getActivePropertyCodes(property),
        location: getGeoLocation(property)
    }
}
