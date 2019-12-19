import cdk = require('@aws-cdk/core')
import lambda = require('@aws-cdk/aws-lambda')
import apigw = require('@aws-cdk/aws-apigateway')
import dynamodb = require('@aws-cdk/aws-dynamodb')
import ssm = require('@aws-cdk/aws-ssm')
import { Duration } from '@aws-cdk/core'
// import events = require('@aws-cdk/aws-events')

const optionDefaults = {
    runtime: lambda.Runtime.NODEJS_10_X,
    code: lambda.Code.fromAsset('build.zip')
}

export class Concierge extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const historyTable = new dynamodb.Table(this, 'History', {
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

        const giataUsername = ssm.StringParameter.fromStringParameterAttributes(this, 'GiataUsername', {
            parameterName: '/concierge/giata/username',
            version: 1
        })

        const giataPassword = ssm.StringParameter.fromStringParameterAttributes(this, 'GiataPassword', {
            parameterName: '/concierge/giata/password',
            version: 1
        })

        const handler = new lambda.Function(this, 'ConciergeHandler', {
            ...optionDefaults,
            handler: 'bin/handlers/concierge.handler',
            environment: {
                HISTORY_TABLE_NAME: historyTable.tableName,
                PROPERTIES_TABLE_NAME: propertiesTable.tableName,
                GIATA_USERNAME: giataUsername.stringValue,
                GIATA_PASSWORD: giataPassword.stringValue
            },
            timeout: Duration.minutes(3),
            memorySize: 512
        })

        historyTable.grantReadWriteData(handler)
        propertiesTable.grantReadWriteData(handler)

        const getPropertyHandler = new lambda.Function(this, 'GetPropertyHandler', {
            ...optionDefaults,
            environment: {
                PROPERTIES_TABLE_NAME: propertiesTable.tableName
            },
            handler: 'bin/handlers/get-property.handler'
        })

        propertiesTable.grantReadData(getPropertyHandler)

        new apigw.LambdaRestApi(this, 'Endpoint', {
            handler
        })

        const api = new apigw.RestApi(this, 'PropertiesApi', {
            restApiName: 'Giata Properties Service'
        })

        const properties = api.root.addResource('properties')
        const getOne = properties.addResource('{id}')
        const getOneIntegration = new apigw.LambdaIntegration(getPropertyHandler)
        getOne.addMethod('GET', getOneIntegration)

        // Run every day at 6PM UTC
        // See https://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html
        // const rule = new events.Rule(this, 'Rule', {
        //     schedule: events.Schedule.expression('cron(0 18 ? * MON-FRI *)')
        // })
        // rule.addTarget(new targets.LambdaFunction(handler))
    }
}
