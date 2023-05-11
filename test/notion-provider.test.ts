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

jest.setTimeout(6000)

describe('notion-provider', () => {
  test('happy', async ()=>{
    if(!Config) return
    expect(NotionProvider).toBeDefined()
    expect(NotionProviderDoc).toBeDefined()
    const seneca = await makeSeneca()

    expect(await seneca.post('sys:provider,provider:notion,get:info'))
      .toMatchObject({
        ok: true,
        name: 'notion',
      })

  })

  test('messages', async () => {
    if(!Config) return
    const seneca = await makeSeneca()
    await (SenecaMsgTest(seneca, BasicMessages)())
  })

  test('page-load', async () => {
    if(!Config) return
    const seneca = await makeSeneca()
    const id = Config.page0.id

    let load = await seneca.entity('provider/notion/page').load$(id)

    expect(load.id).toBeDefined()
    expect(load.parent.type).toEqual('database_id')
	
  })

  test('page-save-new', async () => {
    if(!Config) return
    const seneca = await makeSeneca()
    
    const db_id = Config.db0.id

    let properties = {
      "Name": {
        "title": [
          {
            "text": {
              "content": "My new page",
            }
          }
        ],
      },
      "Description": {
        "rich_text": [
          {
            "text": {
              "content": "This is the desc",
            }
          }
        ]
      },
    }

    let save = await seneca.entity('provider/notion/page')
      .data$({ properties, }).save$({ db_id, })
   
    expect(save.id).toBeDefined()
    expect(save.properties.Name.title[0].text)
      .toMatchObject(properties.Name.title[0].text)

  })

  test('page-list', async () => {
    if(!Config) return
    const seneca = await makeSeneca()

    const list = await seneca.entity('provider/notion/page').list$()
    expect(list.length > 0).toBeTruthy()
  })

  test('page-save-update', async () => {
    if(!Config) return
    const seneca = await makeSeneca()
    const id = Config.page0.id

    let properties = {
      "Name": {
        "title": [
          {
            "text": {
              "content": "Updated page",
            }
          }
        ],
      },
      "Description": {
        "rich_text": [
          {
            "text": {
              "content": "This is the updated desc",
            }
          }
        ]
      },
    }


    let load = await seneca.entity('provider/notion/page').load$(id)
    let update = await load.data$({ properties, }).save$()

    expect(update.id).toBeDefined()
    expect(update.properties.Name.title[0].text)
      .toMatchObject(properties.Name.title[0].text)
    
  })

  test('database-load', async () => {
    if(!Config) return
    const seneca = await makeSeneca()
    const id = Config.db0.id

    let load = await seneca.entity('provider/notion/database').load$(id)

    expect(load.id).toBeDefined()
    expect(load.parent.type).toEqual('page_id')

  })

  test('database-list', async () => {
    if(!Config) return
    const seneca = await makeSeneca()

    const list = await seneca.entity('provider/notion/database').list$()
    expect(list.length > 0).toBeTruthy()
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
