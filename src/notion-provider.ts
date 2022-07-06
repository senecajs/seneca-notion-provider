/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Pkg = require('../package.json')

const Notion = require('@notionhq/client')
const fetch = require('node-fetch')

type NotionProviderOptions = {}

function NotionProvider(this: any, options: NotionProviderOptions) {
  const seneca: any = this
  const entityBuilder = this.export('provider/entityBuilder')
   
  seneca.message('sys:provider,provider:notion,get:info', get_info)
    
  async function get_info(this: any, _msg: any) {
    return {
      ok: true,
      name: 'notion',
      version: Pkg.version,
      sdk: {
        name: 'notion',
        version: Pkg.dependencies['notion'],
      }
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
	      let limit
	      if(msg.q){
                limit = msg.q.limit$ || 100 // The maximum number of results to display per page
	      }
	      else{
	       limit = 100
	      }
	      const options = {
	        method: 'POST',
		headers: {
		  'Authorization' : `Bearer ${this.shared.authTok}`,
		  'Accept': 'application/json',
		  'Notion-Version': '2022-02-22',
		  'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({page_size: limit})
	      };
	      // see https://developers.notion.com/reference/post-search for usage
	      let res = await fetch('https://api.notion.com/v1/search', options)
	      let obj = await res.json()
	      let list = obj.results.filter(v => v.object == 'page')
				    .map(v => entize(v))
	      return list
            }
          },

          load: {
            action: async function(this: any, entize: any, msg: any) {
              let id = msg.q.id
	      const options = {
	        method: 'GET',
		headers: {
		  'Authorization': `Bearer ${this.shared.authTok}`,
		  'Accept': 'application/json',
		  'Notion-Version': '2022-02-22',
		  'Content-Type': 'application/json'
		}
	      }
	      let res = await fetch(`https://api.notion.com/v1/pages/${id}`, options)
              let obj = await res.json()
	      return entize(obj)
            }
          },
                    
	  save: {
	    action: async function(this: any, entize: any, msg: any) {
	      let ent = msg.ent
	      let id = ent.id
	      let properties = ent.properties
	      let obj
	      try{
	        await this.shared.sdk.pages.update({page_id: id, properties: ent.properties})
		obj = await this.entity('provider/notion/page').load$(id) // a fix to get all the properties
	      }
	      catch(err){
	        if(err.status >= 400 && err.status < 500){
		  return null
		}
		throw err
	      }
	      return entize(obj)
            }
          }
        }
      }
    }
  });
    
  this.prepare(async function(this: any) {
    let authTok = await this.post('sys:provider,get:key,provider:notion,key:authToken')
    if (!authTok.ok) {
      this.fail('api-key-missing')
    }
    this.shared.sdk = new Notion.Client({ auth: authTok.value })
    this.shared.authTok = authTok.value // needed for 'fetch'
  })
    
  return {
    exports: {
      sdk: () => this.shared.sdk,
    }
  }
}
const defaults = {
    debug: false
}
Object.assign(NotionProvider, { defaults })

export default NotionProvider

if (typeof (module) !== 'undefined') {
  module.exports = NotionProvider
}
//# sourceMappingURL=notion-provider.js.map
