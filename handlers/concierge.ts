const { DynamoDB } = require('aws-sdk')
import { createUpdateItemParams } from '../src/update-property-params'
import GiataClient from '../src/giata-client/giata-client'
import { getProperty } from '../src/formatters/property-formatters'

export const handler = async event => {
    const dynamo = new DynamoDB()

    const response = await dynamo
        .getItem({
            TableName: process.env.HISTORY_TABLE_NAME,
            Key: {
                'id': {
                    'S': 'id'
                }
            },
            AttributesToGet: ['timestamp']
        })
        .promise()

    console.log('date is', JSON.stringify(response, undefined, 2))

    const client = new GiataClient({
        username: process.env.GIATA_USERNAME!,
        password: process.env.GIATA_PASSWORD!
    })

    const since = response.timestamp ? new Date(response.timestamp) : new Date(0)

    const result = await client.listProperties({ since })
    const properties = result.body.properties
    const offset = properties && properties.more && properties.more.attributes['xlink:href']

    if (offset) {
        console.log('offset is ', JSON.stringify(offset))
    }

    if (properties) {
        await Promise.all(
            properties.property
                .filter(p => !p.attributes.status || p.attributes.status !== 'inactive')
                .map(getProperty)
                .map(p => dynamo.updateItem(createUpdateItemParams(p)).promise())
        )
    }

    const update = await dynamo
        .updateItem({
            TableName: process.env.HISTORY_TABLE_NAME,
            Key: {
                id: {
                    S: 'id'
                }
            },
            ExpressionAttributeNames: {
                '#timestamp': 'timestamp'
            },
            ExpressionAttributeValues: {
                ':timestamp': {
                    S: new Date().toISOString()
                }
            },
            UpdateExpression: 'SET #timestamp = :timestamp'
        })
        .promise()

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/plain' },
        body: `Runner started\n`
    }
}
