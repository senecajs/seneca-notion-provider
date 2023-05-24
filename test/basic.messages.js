const Pkg = require('../package.json')

module.exports = {
  print: false, // true for debugging
  pattern: 'sys:provider,provider:notion',
  allow: { missing: true },

  data: {
    notion: {
      page: {
        pg01: { id: 'pg01', properties: {} }
      },
      database: {
        db0: { id: 'db01', properties: {} }
      }
    }
  },

  calls: [
    {
      name: 'get_info',
      pattern: 'get:info,provider:notion,sys:provider',
      out: {
        ok: true,
        name: 'notion',
        version: Pkg.version,
      },
    },

    {
      name: 'load_page',
      pattern: 'base:notion,cmd:load,name:page,role:entity',
      params: {
          id: 'pg01'
      },
      out: { 'entity$': '-/notion/page', id: 'pg01', properties: {} }

    },

    {
      name: 'load_database',
      pattern: 'base:notion,cmd:load,name:database,role:entity',
      params: {
          id: 'db01'
      },
      out: { 'entity$': '-/notion/database', id: 'db01', properties: {} }

    },

    {
      name: 'save_page',
      pattern: 'base:notion,cmd:save,name:page,role:entity',
      params: {
        ent: {
          id$: 'pg02',
          properties: {
            Name: {
              title: [ { text: { content: 'My new page' } } ]
            },
            Description: {
              rich_text: [ { text: { content: 'This is the desc' } } ]
            }
          },
        }
      },

      out: {
        'entity$': '-/notion/page',
        properties: {
          Name: {
            title: [ { text: { content: 'My new page' } } ]
          },
          Description: {
            rich_text: [ { text: { content: 'This is the desc' } } ]
          }
        },
        id: 'pg02'
      }

    },

    {
      name: 'save_database',
      pattern: 'base:notion,cmd:save,name:database,role:entity',
      params: {
        ent: {
          id$: 'db02',
          properties: {
            Name: {
              title: [ { type: 'text', text: { content: 'My new database' } } ]
            }
          },

        }

      },

      out: {
        'entity$': '-/notion/database',
        id: 'db02',
        properties: {
          Name: {
            title: [ { type: 'text', text: { content: 'My new database' } } ]
          }
        },

      }

    },

    
    {
      name: 'list_page',
      pattern: 'base:notion,cmd:list,name:page,role:entity',
      params: {},
      out: [
        { 'entity$': '-/notion/page', id: 'pg01', properties: {} },
        {
          'entity$': '-/notion/page',
          properties: {
            Name: {
              title: [ { text: { content: 'My new page' } } ]
            },
            Description: {
              rich_text: [ { text: { content: 'This is the desc' } } ]
            }
          },
          id: 'pg02'
        }

      ],

    },

    {
      name: 'list_database',
      pattern: 'base:notion,cmd:list,name:database,role:entity',
      params: {},
      out: [
        { 'entity$': '-/notion/database', id: 'db01', properties: {} },
        {
          'entity$': '-/notion/database',
          id: 'db02',
          properties: {
            Name: {
              title: [ { type: 'text', text: { content: 'My new database' } } ]
            }
          },
        }
      ],

    },


  ]
}
