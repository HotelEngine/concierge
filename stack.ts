import cdk = require('@aws-cdk/core')
import lambda = require('@aws-cdk/aws-lambda')
import apigw = require('@aws-cdk/aws-apigateway')
import dynamodb = require('@aws-cdk/aws-dynamodb')
import { Duration } from '@aws-cdk/core'

export class Concierge extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const table = new dynamodb.Table(this, 'History', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            }
        })

        const propertiesTable = new dynamodb.Table(this, 'Properties', {
            partitionKey: {
                name: 'id',
                type: dynamodb.AttributeType.STRING
            }
        })

        const handler = new lambda.Function(this, 'ConciergeHandler', {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.fromAsset('build.zip'),
            handler: 'bin/handlers/concierge.handler',
            environment: {
                HISTORY_TABLE_NAME: table.tableName,
                PROPERTIES_TABLE_NAME: propertiesTable.tableName,
                GIATA_USERNAME: process.env.GIATA_USERNAME!,
                GIATA_PASSWORD: process.env.GIATA_PASSWORD!
            },
            timeout: Duration.minutes(3),
            memorySize: 512
        })

        new apigw.LambdaRestApi(this, 'Endpoint', {
            handler
        })

        table.grantReadWriteData(handler)
        propertiesTable.grantReadWriteData(handler)
    }
}
