#!/usr/bin/env node
import cdk = require('@aws-cdk/core')
import { CdkWorkshopStack } from '../cdk'

const app = new cdk.App()
new CdkWorkshopStack(app, 'CdkWorkshopStack')
