import { GiataProperty } from './giata-types';
import { GeoLocation, PropertyCode, Property } from './concierge-types';

const STATUS_INACTIVE = 'inactive';

const toArray = (val): any[] => {
    return Array.isArray(val) ? val : [val];
};

export const getGeoLocation = (property: GiataProperty): GeoLocation => {
    return {
        latitude: property.geoCodes.geoCode.latitude,
        longitude: property.geoCodes.geoCode.longitude
    };
};

export const getActivePropertyCodes = (property: GiataProperty): PropertyCode[] => {
    return property.propertyCodes.provider.map(p => {
        return {
            supplierName: p.attributes.providerCode,
            codes: toArray(p.code).reduce((total, code) => {
                if (
                    !Array.isArray(code.value) &&
                    (!code.attributes || (code.attributes && code.attributes.status !== STATUS_INACTIVE))
                ) {
                    total.push(code.value);
                }
                return total;
            }, [])
        };
    });
};

export const getGiataId = (property: GiataProperty): string => {
    return property.attributes.giataId;
};

export const getProperty = (property: GiataProperty): Property => {
    return {
        giataId: getGiataId(property),
        codes: getActivePropertyCodes(property),
        location: getGeoLocation(property)
    };
};
