const Pkg = require('../package.json')

module.exports = {
  print: false,
  pattern: 'sys:provider,provider:notion',
  allow: { missing: true },

  calls: [
    {
      pattern: 'get:info',
      out: {
        ok: true,
        name: 'notion',
        version: Pkg.version,
        sdk: {
          name: 'notion',
          version: Pkg.dependencies['@notionhq/client'],
        }
      },
    }
  ]
}
