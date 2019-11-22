import got, { Options, Got, Response } from 'got';
import * as parser from 'fast-xml-parser';

export default class GiataClient {
    constructor(options: GiataClientOptions) {
        const clientOptions: Options = {
            prefixUrl: 'https://multicodes.giatamedia.com/',
            headers: {
                Authorization: `Basic ${Buffer.from(`${options.username}:${options.password}`).toString('base64')}`
            }
        };
        this.options = options;
        this.client = got.extend(clientOptions);
    }

    private client: Got;
    private basePath = 'webservice/rest/1.latest';
    private options: any;
    private parse(xml) {
        return parser.parse(xml, {
            ...this.options.parserOptions,
            attrNodeName: 'attributes',
            attributeNamePrefix: '',
            ignoreAttributes: false,
            textNodeName: 'text'
        });
    }

    private generateUrl(path: string, since?: Date): string {
        return `${this.basePath}/${path}` + (since ? `/since/${since.toISOString().split('T')[0]}` : '');
    }

    private async executeRequest(req): Promise<Response> {
        const res = await this.client(req);
        return {
            ...res,
            body: this.parse(res.body)
        } as any;
    }

    public async listProperties(since?: Date): Promise<Response> {
        return this.executeRequest({
            method: 'GET',
            pathname: this.generateUrl('properties/multi', since)
        });
    }

    public async listPropertiesMovedSince(since?: Date) {
        return this.executeRequest({
            method: 'GET',
            pathname: this.generateUrl('properties/moved', since)
        });
    }

    public async getProperty(id: string) {
        return this.executeRequest({
            method: 'GET',
            pathname: this.generateUrl(`${this.basePath}/properties/${id}`)
        });
    }

    public async listHotelChains() {
        return this.executeRequest({
            method: 'GET',
            pathname: `${this.basePath}/chains`
        });
    }
}

interface GiataClientOptions {
    gotOptions?: Options;
    username: string;
    password: string;
    parserOptions?: object;
}
