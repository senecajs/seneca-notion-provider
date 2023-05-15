const Pkg = require('../package.json')

module.exports = {
  print: true, // false
  pattern: 'sys:provider,provider:notion',
  allow: { missing: true },

  data: {
    notion: {
      page: {
        pg01: { id: 'pg01', }
      },
      database: {
        db0: { id: 'db01' }
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
      out: { 'entity$': '-/notion/page', id: 'pg01' }

    },

    {
      name: 'load_database',
      pattern: 'base:notion,cmd:load,name:database,role:entity',
      params: {
          id: 'db01'
      },
      out: { 'entity$': '-/notion/database', id: 'db01' }

    },

    {
      name: 'list_page',
      pattern: 'base:notion,cmd:list,name:page,role:entity',
      params: {},
      out: [ { 'entity$': '-/notion/page', id: 'pg01' } ],

    },

    {
      name: 'list_database',
      pattern: 'base:notion,cmd:list,name:database,role:entity',
      params: {},
      out: [ { 'entity$': '-/notion/database', id: 'db01' } ],

    },

    {
      name: 'save_page',
      pattern: 'base:notion,cmd:save,name:page,role:entity',
      params: {
        ent: {
          id$: 'pg02',
          title: 'new page',
        }
      },

      out: {
        'entity$': '-/notion/page',
        title: 'new page',
        id: 'pg02'
      }

    },

    {
      name: 'save_database',
      pattern: 'base:notion,cmd:save,name:database,role:entity',
      params: {
        ent: {
          id$: 'db02',
          title: 'new database',
        }
      },

      out: {
        'entity$': '-/notion/database',
        title: 'new database',
        id: 'db02'
      }

    }


  ]
}
