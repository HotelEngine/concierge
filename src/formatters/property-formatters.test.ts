import * as Tap from 'tap'
import * as Formatters from './property-formatters'
import ListPropertiesSinceResponse from '../giata-client/giata-responses/list-properties/list-properties-since'

Tap.test('getGeo', test => {
    const result = Formatters.getGeoLocation(ListPropertiesSinceResponse.properties.property[0])
    test.matchSnapshot(result, 'it should get the correct lat and long')
    test.end()
})

Tap.test('getActivePropertyCodes', test => {
    const result = Formatters.getActivePropertyCodes(ListPropertiesSinceResponse.properties.property[0])
    test.matchSnapshot(result, 'it should produce an array of property codes')
    test.end()
})

Tap.test('getGiataId', test => {
    const result = Formatters.getGiataId(ListPropertiesSinceResponse.properties.property[0])
    test.matchSnapshot(result, 'it should produce a giata property id')
    test.end()
})

Tap.test('getProperty', test => {
    const result = Formatters.getProperty(ListPropertiesSinceResponse.properties.property[0])
    test.matchSnapshot(result, 'it should produce a property')
    test.end()
})
