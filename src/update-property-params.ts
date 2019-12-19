const AWS = require('aws-sdk')
const CODES_NAME = 'codes'
const CODES_ALIAS = CODES_NAME.toUpperCase()
const LOCATION_NAME = 'location'
const LOCATION_ALIAS = LOCATION_NAME.toUpperCase()
const UPDATED_AT_NAME = 'updated_at'
const UPDATED_AT_ALIAS = UPDATED_AT_NAME.toUpperCase()

export const createUpdateItemParams = property => {
    const prop = AWS.DynamoDB.Converter.marshall(property)

    const params = {
        ExpressionAttributeNames: {
            [`#${CODES_ALIAS}`]: CODES_NAME,
            [`#${UPDATED_AT_ALIAS}`]: UPDATED_AT_NAME
        },
        ExpressionAttributeValues: {
            [`:${CODES_NAME}`]: prop.codes,
            [`:${UPDATED_AT_NAME}`]: {
                S: new Date().toISOString()
            }
        },
        Key: {
            id: prop.id
        },
        TableName: process.env.PROPERTIES_TABLE_NAME,
        UpdateExpression: `SET #${CODES_ALIAS} = :${CODES_NAME}, #${UPDATED_AT_ALIAS} = :${UPDATED_AT_NAME}`
    }

    if (property.location) {
        params.ExpressionAttributeNames[`#${LOCATION_ALIAS}`] = LOCATION_NAME
        params.ExpressionAttributeValues[`:${LOCATION_NAME}`] = prop.location
        params.UpdateExpression += ` , #${LOCATION_ALIAS} = :${LOCATION_NAME}`
    }

    return params
}
