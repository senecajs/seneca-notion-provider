import * as Fs from 'fs'

const Seneca = require('seneca');
const SenecaMsgTest = require('seneca-msg-test');

import NotionProvider from '../src/notion-provider'
import NotionProviderDoc from '../src/NotionProvider-doc'

const BasicMessages = require('./basic.messages.js');

// Only run some tests locally (not on Github Actions).
let Config = undefined
if (Fs.existsSync(__dirname + '/local-config.js')) {
  Config = require('./local-config')
}

describe('notion-provider', () => {
  test('happy', async ()=>{
    expect(NotionProvider).toBeDefined()
    expect(NotionProviderDoc).toBeDefined()
    const seneca = await makeSeneca()

    let sdk = seneca.export('NotionProvider/sdk')()
    expect(sdk).toBeDefined()
		
    expect(await seneca.post('sys:provider,provider:notion,get:info')).toMatchObject({
      ok: true,
      name: 'notion',
     })
  })

  test('messages', async () => {
    const seneca = await makeSeneca()
    await (SenecaMsgTest(seneca, BasicMessages)())
  })

  test('page-basic', async () => {
    if(!Config) return
    const seneca = await makeSeneca()

    const list = await seneca.entity('provider/notion/page').list$()
    expect(list.length > 0).toBeTruthy();

    const page0 = await seneca.entity('provider/notion/page')
		    .load$(Config.page0.id);

    expect(page0.url).toEqual('https://www.notion.so/<your_page_url>');

    page0.properties.checkMe.checkbox = true;
    let page0r = await page0.save$()
    expect(page0r.id).toEqual(page0.id);
    expect(page0r.properties.checkMe.checkbox).toEqual(page0.properties.checkMe.checkbox);

    const page0u = await seneca.entity("provider/notion/page")
				    .load$(Config.page0.id)
    expect(page0u.url).toEqual('https://www.notion.so/<your_page_url>');
    expect(page0u.properties.checkMe.checkbox).toEqual(page0u.properties.checkMe.checkbox);
 })

})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('env', {
      // debug: true,
      file: [__dirname + '/local-env.js;?'],
      var: {
	$NOTION_TOKEN: String
      }
    })
    .use('provider', {
      provider: {
        notion: {
          keys: {
            authToken: { value: '$NOTION_TOKEN' }
          }
        }
      }
    })
    .use(NotionProvider)

  return seneca.ready()
}
