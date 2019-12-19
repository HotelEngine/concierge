import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import cdk = require('@aws-cdk/core')
import Stack = require('./stack')
import * as Tap from 'tap'

Tap.test('api gateway created', test => {
    const app = new cdk.App()
    const stack = new Stack.Concierge(app, 'MyTestStack')
    expectCDK(stack).to(
        haveResource('AWS::ApiGateway::RestApi', {
            'Name': 'Endpoint'
        })
    )
    test.done()
})
