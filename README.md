# concierge

## local dev

-   clone repo
-   `npm install` (requires node 10.x, 10.16 works for sure)
-   `npm i -g aws-cdk`
-   install and configure aws-cli `https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html`
-   ask someone for aws permissions
-   `npm run build && npm run package && npm run test`)
-   `cdk diff` -> should see asset names change

## tests

-   https://node-tap.org/docs/getting-started/
-   note that snapshots need to be created with the `--snapshot` flag

## features

-   deploy creates 2 endpoints at `https://ajqc53s2d7.execute-api.us-east-1.amazonaws.com/prod`

| route          | use                                                               |
| -------------- | ----------------------------------------------------------------- |
| /              | creates or updates the db with the first page of giata properties |
| /products/{id} | get a property by giata id                                        |

## references

-   https://cdkworkshop.com/15-prerequisites.html
-   https://github.com/aws-samples/aws-cdk-examples#TypeScript
-   https://github.com/HotelEngine/he-api/blob/master/app/workers/inventory/giata/process_all_inventory.rb#L1

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
    -   run the giata indexer recursivly so it correctly saves properties updated _since_
        -   make sure only one can run at a time
-   param security
    -   `/concierge` ssm parameters (secure string vs string)
        -   secure strings not currently supported by cdk, update them someday

## other stuff

-   not all of giata properties contain lat/long data!

    -   dynamo streams and/or another lambda could populate location data

-   this data is not optimized for search, which public-api craves

    -   we need a downstream endpoint that can quickly return property codes for a location

-   dont conflate property mapping with "inventory"
    -   this services responsibilities are close to being maxed out
