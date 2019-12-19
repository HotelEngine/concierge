#!/usr/bin/env node
import cdk = require('@aws-cdk/core')
import { Concierge } from './stack'

const app = new cdk.App()
new Concierge(app, 'Concierge')
