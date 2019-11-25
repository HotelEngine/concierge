import * as parser from 'fast-xml-parser'
import got, { Got, Options, Response } from 'got'
import { IGiataListPropertiesResponse } from './giata-types'

interface IListPropertiesSinceOptions {
    since: Date
}

interface IListPropertiesOffsetOptions {
    offset: string | number
}

interface IGenerateUrlOptions {
    path: string
    since?: Date
    offset?: string | number
}

export type ListPropertiesOptions = IListPropertiesSinceOptions | IListPropertiesOffsetOptions

export default class GiataClient {
    private client: Got
    private basePath = 'webservice/rest/1.latest'
    private options: any
    constructor(options: IGiataClientOptions) {
        const clientOptions: Options = {
            prefixUrl: 'https://multicodes.giatamedia.com/',
            headers: {
                Authorization: `Basic ${Buffer.from(`${options.username}:${options.password}`).toString('base64')}`
            }
        }
        this.options = options
        this.client = got.extend(clientOptions)
    }

    public async listProperties(options?: ListPropertiesOptions): Promise<Response<IGiataListPropertiesResponse>> {
        return this.executeRequest<IGiataListPropertiesResponse>({
            method: 'GET',
            pathname: this.generateUrlFromOptions({ ...options, path: 'properties/multi' })
        })
    }

    // public async listPropertiesMovedSince(since?: Date) {
    //     return this.executeRequest({
    //         method: 'GET',
    //         pathname: this.generateUrlSince('properties/moved', since)
    //     })
    // }

    // public async getProperty(id: string) {
    //     return this.executeRequest({
    //         method: 'GET',
    //         pathname: this.generateUrl(`${this.basePath}/properties/${id}`)
    //     })
    // }

    // public async listHotelChains() {
    //     return this.executeRequest({
    //         method: 'GET',
    //         pathname: `${this.basePath}/chains`
    //     })
    // }

    private parse(xml) {
        return parser.parse(xml, {
            ...this.options.parserOptions,
            attrNodeName: 'attributes',
            attributeNamePrefix: '',
            ignoreAttributes: false,
            textNodeName: 'text'
        })
    }

    private generateUrlFromOptions(options: IGenerateUrlOptions) {
        if (options.since) {
            return this.generateUrlSince(options.path, options.since)
        } else if (options.offset) {
            return this.generateUrlOffset(options.path, options.offset)
        } else {
            return this.generateUrl(options.path)
        }
    }

    private generateUrl(path: string): string {
        return `${this.basePath}/${path}`
    }

    private generateUrlSince(path: string, since: Date): string {
        return `${this.generateUrl(path)}/since/${since.toISOString().split('T')[0]}`
    }

    private generateUrlOffset(path: string, offset): string {
        return `${this.generateUrl(path)}/offset/${offset}`
    }

    private async executeRequest<T>(req): Promise<Response<T>> {
        const res = await this.client(req)
        return {
            ...res,
            body: this.parse(res.body)
        } as any
    }
}

interface IGiataClientOptions {
    gotOptions?: Options
    username: string
    password: string
    parserOptions?: object
}
