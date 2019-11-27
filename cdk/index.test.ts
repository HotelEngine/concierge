import { expect as expectCDK, haveResource } from '@aws-cdk/assert'
import cdk = require('@aws-cdk/core')
import CdkWorkshop = require('../cdk')
import * as Tap from 'tap'

Tap.test('SQS Queue Created', async test => {
    const app = new cdk.App()
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack')
    expectCDK(stack).to(
        haveResource('AWS::SQS::Queue', {
            VisibilityTimeout: 300
        })
    )
    test.end()
})

Tap.test('SNS Topic Created', async test => {
    const app = new cdk.App()
    const stack = new CdkWorkshop.CdkWorkshopStack(app, 'MyTestStack')
    expectCDK(stack).to(haveResource('AWS::SNS::Topic'))
    test.end()
})
