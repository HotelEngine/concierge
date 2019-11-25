import * as Tap from 'tap'
import * as Nock from 'nock'
import GiataClient from './giata-client'
import ListPropertiesResponse from '../../giata-responses/list-properties/list-properties-since-xml'

Tap.test('list properties', async test => {
    Nock('https://multicodes.giatamedia.com')
        .get('/webservice/rest/1.latest/properties/multi/since/2019-11-11')
        .reply(200, ListPropertiesResponse)
    const client = new GiataClient({
        username: 'username',
        password: 'password'
    })
    const response = await client.listProperties({ since: new Date(2019, 10, 11) })
    test.matchSnapshot(response.body, 'it should return json')
    test.equal(
        response.request.options.url.href,
        'https://multicodes.giatamedia.com/webservice/rest/1.latest/properties/multi/since/2019-11-11',
        'it should have the correct url'
    )
    test.equal(
        response.request.options.headers.authorization,
        'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
        'it should attach the auth header'
    )
    test.end()
})
