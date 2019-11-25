import GiataClient from './lib/giata-client/giata-client'
import { IProperty } from './concierge-types'
import { getProperty } from './src/formatters/property-formatters'

async function saveProperties(properties: IProperty[]) {
    // call lambda / add to queue / save properties
}

async function queueJob(offset: string) {
    // call lambda or add to queue
}

async function go() {
    const client = new GiataClient({
        username: process.env.GIATA_USERNAME,
        password: process.env.GIATA_PASSWORD
    })
    const result = await client.listProperties()
    const properties = result.body.properties
    const offset = properties && properties.more && properties.more.attributes['xlink:href']
    if (offset) {
        queueJob(offset)
    }
    if (properties) {
        saveProperties(properties.property.map(getProperty))
    }
}

go()
