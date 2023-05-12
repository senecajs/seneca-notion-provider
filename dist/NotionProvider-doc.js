"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
const docs = {
    get_info: {
        desc: 'Get information about the Notion SDKK.',
        validate: {
            x: Joi.string()
        }
    },
    /*
    describe_get_info: {
      desc:
        'add a doc to your minisearch',
      examples: {
        '("sys:search,cmd:add", {id: 1, ...})': 'Describe actions matching at least `a:1,b:2`.'
      },
      reply_desc: {
      },
      validate: {},
    }
    */
    /*
    describe_load_page: {
      name: 'load_page',
      desc: 'Get information about the Notion SDKK.',
      examples: {
        'base:notion,cmd:list,name:page,role:entity,zone:provider': 'Describe actions matching at least `a:1,b:2`.'
      },
      reply_desc: {
        pin: 'pin parameter',
        actions: ['{ Seneca action definition }']
      }
    }
    */
};
exports.default = docs;
if ('undefined' !== typeof (module)) {
    module.exports = docs;
}
//# sourceMappingURL=NotionProvider-doc.js.map