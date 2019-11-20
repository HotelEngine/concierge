import * as Got from "got";
import * as parser from "fast-xml-parser";

export default class GiataClient {
  constructor(options: GiataClientOptions) {
    const clientOptions: Got.GotJSONOptions = {
      ...(options.gotOptions || {}),
      baseUrl: "https://multicodes.giatamedia.com/",
      json: true,
      headers: {
        Authorization: Buffer.from(
          `Basic ${options.username}:${options.password}`
        ).toString("base64")
      }
    };
    this.options = options;
    this.client = Got.extend(clientOptions);
  }

  private client: Got.GotInstance;
  private basePath = "webservice/rest/1.latest";
  private options: any;
  private parse(res: Got.Response<string>) {
    return parser.parse(res.body, {
      ...this.options.parserOptions,
      ...{
        attrNodeName: "attributes",
        attributeNamePrefix: "",
        ignoreAttributes: false,
        textNodeName: "text"
      }
    });
  }

  public async listProperties(since?: Date, options?: object) {
    return this.client
      .get(
        `${this.basePath}/properties/multi` + since
          ? `/since/${since.toISOString().split("T")[0]}`
          : "",
        options
      )
      .then(this.parse);
  }

  public async listPropertiesMovedSince(since?: Date, options?: object) {
    return this.client
      .get(
        `${this.basePath}/properties/moved` + since
          ? `/since/${since.toISOString().split("T")[0]}`
          : "",
        options
      )
      .then(this.parse);
  }

  public async getProperty(id: string, options: object) {
    return this.client
      .get(`${this.basePath}/properties/${id}`, options)
      .then(this.parse);
  }

  public async listHotelChains(options: object) {
    return this.client.get(`${this.basePath}/chains`, options).then(this.parse);
  }
}

// export default GiataClient

interface GiataClientOptions {
  gotOptions?: Got.GotJSONOptions;
  username: string;
  password: string;
  parserOptions?: object;
}
