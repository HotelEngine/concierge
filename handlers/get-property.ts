const { DynamoDB } = require('aws-sdk')

export const handler = async event => {
    const dynamo = new DynamoDB()

    const response = await dynamo
        .getItem({
            TableName: process.env.PROPERTIES_TABLE_NAME,
            Key: {
                'id': {
                    'S': event.pathParameters.id
                }
            }
        })
        .promise()

    const body = DynamoDB.Converter.unmarshall(response.Item)

    return {
        statusCode: body ? 200 : 404,
        body: body ? JSON.stringify(body) : 'Not Found'
    }
}
