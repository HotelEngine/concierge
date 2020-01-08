# concierge

## local dev

-   clone repo
-   `npm install` (requires node 10.x, 10.16 works for sure)
-   `npm i -g aws-cdk`
-   install and configure aws-cli `https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html`
-   ask someone for aws permissions
-   `npm run build && npm run package && npm run test`
-   `cdk diff` -> should see asset names change

## features

-   deploy creates 2 endpoints at `https://ajqc53s2d7.execute-api.us-east-1.amazonaws.com/prod`

| route          | use                                                               |
| -------------- | ----------------------------------------------------------------- |
| /              | creates or updates the db with the first page of giata properties |
| /products/{id} | get a property by giata id                                        |

## references

-   https://cdkworkshop.com/15-prerequisites.html
-   https://github.com/aws-samples/aws-cdk-examples#TypeScript

## todo

-   clean up package.json scripts

    -   they are a mess

-   auth

    -   security through obscurity currently in use

-   ci/cd

    -   dont zip dev dependencies for deploys
        -   https://docs.npmjs.com/cli/prune.html

-   features
    -   run the giata indexer on a schedule
        -   https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/lambda-cron/
    -   run the giata indexer recursivly
        -   make sure only one can run at a time
-   param security
    -   `/concierge` ssm parameters (secure string vs string)
        -   secure strings not currently supported by cdk, update them someday
