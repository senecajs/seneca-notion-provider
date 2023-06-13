/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const Joi = require('@hapi/joi')

const messages = {
  get_info: {
    desc: 'Get information about the Notion SDK.',
  },

  load_page: {
    desc: 'Load Notion page data into an entity.',
    examples: {},
    reply_desc: {}
  },

  save_page: {
    desc: 'Update/Save Notion page data into an entity.',
    examples: {},
    reply_desc: {}
  },

  list_page: {
    desc: 'List Noion page data into an entity.',
    examples: {},
    reply_desc: {}
  }

}

const sections = {
  /*
  intro: {
    path: '../seneca-provider/doc/intro.md'
  },

  support: {
    path: '../seneca-provider/doc/support.md'
  }
  */

}

export default {
  messages,
  sections,
}

if ('undefined' !== typeof(module)) {
  module.exports = {
    messages,
    sections,
  }
}
