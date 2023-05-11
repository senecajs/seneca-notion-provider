"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const Pkg = require('../package.json');
const Notion = require('@notionhq/client');
const fetch = require('node-fetch');
function NotionProvider(options) {
    const seneca = this;
    const makeUtils = this.export("provider/makeUtils");
    const { makeUrl, getJSON, postJSON, deleteJSON, entityBuilder } = makeUtils({
        name: "notion",
        // url: options.url,
    });
    seneca.message('sys:provider,provider:notion,get:info', get_info);
    const makeConfig = (config) => seneca.util.deep({
        headers: {
            ...seneca.shared.headers,
        },
    }, config);
    async function get_info(_msg) {
        return {
            ok: true,
            name: 'notion',
            version: Pkg.version,
            sdk: {
                name: 'notion',
                version: Pkg.dependencies['@notionhq/client'],
            }
        };
    }
    entityBuilder(this, {
        provider: {
            name: 'notion'
        },
        entity: {
            page: {
                cmd: {
                    list: {
                        action: async function (entize, msg) {
                            let q = msg.q || {};
                            const config = {
                                body: { ...q }
                            };
                            // see https://developers.notion.com/reference/post-search for usage
                            let res = await postJSON('https://api.notion.com/v1/search', makeConfig(config));
                            let list = res.results.filter((v) => v.object == 'page')
                                .map((v) => entize(v));
                            return list;
                        }
                    },
                    load: {
                        action: async function (entize, msg) {
                            let id = msg.q.id;
                            null == id ? this.fail('invalid_id') : null;
                            // let res = await getJSON(`https://api.notion.com/v1/pages/${id}`, makeConfig())
                            let res = await this.shared.sdk.pages.retrieve({ page_id: id });
                            return entize(res);
                        }
                    },
                    save: {
                        action: async function (entize, msg) {
                            let ent = msg.ent;
                            let id = ent.id;
                            let page = ent.page;
                            let obj;
                            try {
                                await this.shared.sdk.pages.update({ page_id: id, properties: ent.properties });
                                // obj = await this.entity('provider/notion/page').load$(id) // a fix to get all the properties
                            }
                            catch (err) {
                                if (err.status >= 400 && err.status < 500) {
                                    return null;
                                }
                                throw err;
                            }
                            return ent; // a more efficient fix for the properties issue - less efficient: uncomment "obj" and return entize(obj)
                        }
                    }
                }
            }
        }
    });
    this.prepare(async function () {
        let seneca = this;
        let res = await seneca.post('sys:provider,get:keymap,provider:notion');
        if (!res.ok) {
            this.fail('notion-missing-keymap', res);
        }
        let authToken = res.keymap.authToken.value;
        seneca.shared.sdk = new Notion.Client({ auth: authToken });
        seneca.shared.headers = {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
            'Notion-Version': '2022-02-22',
            'Content-Type': 'application/json'
        };
    });
    return {
        exports: {
            sdk: () => this.shared.sdk,
        }
    };
}
const defaults = {
    debug: false
};
Object.assign(NotionProvider, { defaults });
exports.default = NotionProvider;
if (typeof (module) !== 'undefined') {
    module.exports = NotionProvider;
}
//# sourceMappingURL=notion-provider.js.map
//# sourceMappingURL=notion-provider.js.map