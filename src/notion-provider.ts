/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Pkg = require('../package.json')

const fetch = require('node-fetch')


type NotionProviderOptions = {
  api: any,
  headers: any,
  debug?: boolean,
}

function NotionProvider(this: any, options: NotionProviderOptions) {
  const seneca: any = this

  const makeUtils = this.export("provider/makeUtils")

  const { makeUrl, getJSON, postJSON, deleteJSON, entityBuilder } = makeUtils({
    name: "notion",
    // url: options.url,
  })

  let api_endpoint = options.api.url
   
  seneca.message('sys:provider,provider:notion,get:info', get_info)

  const makeConfig = (config?: any) =>
    seneca.util.deep(
      {
        headers: {
          ...seneca.shared.headers,
	},
      },
      config
    )
    
  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'notion',
      version: Pkg.version,
    }
  }
    
  entityBuilder(this, {
    provider: {
      name: 'notion'
    },
    entity: {
      page: {
        cmd: {
          list: {
            action: async function(this: any, entize: any, msg: any) {
              let q = msg.q || {}

              const config = {
                body: { ...q }
              }

              // see https://developers.notion.com/reference/post-search for usage
              let res: any = await postJSON(api_endpoint, makeConfig(config))

              let list = res.results.filter((v: any) => v.object == 'page')
                .map((v: any) => entize(v))
              return list
            }
          },

          load: {
            action: async function(this: any, entize: any, msg: any) {
              let id = msg.q.id
              let res: any

              null == id ? this.fail('invalid_id') : null

              res = await getJSON(`https://api.notion.com/v1/pages/${id}`, makeConfig())

              return entize(res)
            }
          },

          save: {
            action: async function(this: any, entize: any, msg: any) {
              let q: any = msg.q || {}
              let ent: any = msg.ent
              let id: any = ent.id
              let properties: any = ent.properties || {}
              let res: any

              // database_id must be provided if creating a new page
              if(!q.db_id && !id) {
                this.fail('invalid_db_id')
              }

              const config = null == id
                ? {
                    method: 'POST',
                    body: {
                      'parent': {
                        'database_id': q.db_id
                      },
                      'properties': { ...properties }
                    }
                  }
                : {
                    method: 'PATCH',
                    body: JSON.stringify({
                      'properties': { ...properties }
                    })

                  };
              (null == id)
                ? ( res = await postJSON('https://api.notion.com/v1/pages',
                makeConfig(config)) )
                : (res = await fetch(`https://api.notion.com/v1/pages/${id}`, makeConfig(config)),
                   res = await res.json() )


              return entize(res)

            }

          }

        }

      },
      
      database: {
        cmd: {
          list: {
            action: async function(this: any, entize: any, msg: any) {
              let q = msg.q || {}

              const config = {
                body: { ...q }
              }

              // see https://developers.notion.com/reference/post-search for usage
              let res: any = await postJSON(api_endpoint, makeConfig(config))

              let list = res.results.filter((v: any) => v.object == 'database')
                .map((v: any) => entize(v))
              return list
            }
          },

          load: {
            action: async function(this: any, entize: any, msg: any) {
              let id = msg.q.id
              let res: any

              null == id ? this.fail('invalid_id') : null

              res = await getJSON(`https://api.notion.com/v1/databases/${id}`, makeConfig())

              return entize(res)
            }
          },

          save: {
            action: async function(this: any, entize: any, msg: any) {
              let q: any = msg.q || {}
              let ent: any = msg.ent
              let id: any = ent.id
              let properties: any = ent.properties || {}
              let title: any = ent.title || []
              let res: any

              // page_id must be provided if creating a new db
              if(!q.page_id && !id) { 
                this.fail('invalid_page_id')
              }

              const config = null == id
                ? {
                    method: 'POST',
                    body: {
                      'parent': {
                        'page_id': q.page_id
                      },
                      'title': [ ...title ],
                      'properties': { ...properties }
                    }
                  }
                : {
                    method: 'PATCH',
                    body: JSON.stringify({
                      'title': [ ...title ],
                      'properties': { ...properties }
                    })

                  };
              (null == id)
                ? ( res = await postJSON('https://api.notion.com/v1/databases',
                makeConfig(config)) )
                : (res = await fetch(`https://api.notion.com/v1/databases/${id}`, makeConfig(config)),
                   res = await res.json() )


              return entize(res)

            }

          }


        }

      }
      
    }

  })
    
  this.prepare(async function(this: any) {
    let seneca = this

    let res =
      await seneca.post('sys:provider,get:keymap,provider:notion')

    if (!res.ok) {
      this.fail('notion-missing-keymap', res)
    }

    let authToken = res.keymap.authToken.value
    let headers = {
      'Authorization': `Bearer ${authToken}`,
      'Accept': 'application/json',
      'Notion-Version': '2021-05-13',
      'Content-Type': 'application/json'
    }


    // TODO: authenticate
    // Allow user to override
    seneca.shared.headers = { ...headers, ...options.headers } 

  })
    
  return {
    exports: {
      sdk: () => this.shared.sdk,
    }
  }
}

const defaults = {
  debug: false,
  api: {
    url: 'https://api.notion.com/v1/search'
  },
  headers: {
    'Accept': 'application/json',
    'Notion-Version': '2021-05-13',
    'Content-Type': 'application/json'
  }
}

Object.assign(NotionProvider, { defaults })

export default NotionProvider

if (typeof (module) !== 'undefined') {
  module.exports = NotionProvider
}
//# sourceMappingURL=notion-provider.js.map
