"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require('@hapi/joi');
const docs = {
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
    },
    list_page: {
        desc: 'List Notion page data into an entity.',
    }
};
exports.default = docs;
if ('undefined' !== typeof (module)) {
    module.exports = docs;
}
//# sourceMappingURL=NotionProvider-doc.js.map