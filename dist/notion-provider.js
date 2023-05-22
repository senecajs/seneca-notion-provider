"use strict";
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const Pkg = require('../package.json');
function NotionProvider(options) {
    const seneca = this;
    const makeUtils = this.export("provider/makeUtils");
    const { makeUrl, getJSON, postJSON, deleteJSON, patchJSON, entityBuilder } = makeUtils({
        name: "notion",
        // url: options.url,
    });
    let { search_endpoint, db_endpoint, page_endpoint } = options.api;
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
                            let res = await postJSON(search_endpoint, makeConfig(config));
                            let list = res.results.filter((v) => v.object == 'page')
                                .map((v) => entize(v));
                            return list;
                        }
                    },
                    load: {
                        action: async function (entize, msg) {
                            let id = msg.q.id;
                            let res;
                            null == id ? this.fail('invalid_id') : null;
                            res = await getJSON(page_endpoint + `/${id}`, makeConfig());
                            return entize(res);
                        }
                    },
                    save: {
                        action: async function (entize, msg) {
                            let q = msg.q || {};
                            let ent = msg.ent;
                            let id = ent.id;
                            let properties = ent.properties || {};
                            let res;
                            // database_id must be provided if creating a new page
                            if (!q.db_id && !id) {
                                this.fail('invalid_db_id');
                            }
                            const config = null == id
                                ? {
                                    body: {
                                        'parent': {
                                            'database_id': q.db_id
                                        },
                                        'properties': { ...properties }
                                    }
                                }
                                : {
                                    body: {
                                        'properties': { ...properties }
                                    }
                                };
                            (null == id)
                                ? (res = await postJSON(page_endpoint, makeConfig(config)))
                                : (res = await patchJSON(page_endpoint + `/${id}`, makeConfig(config)));
                            return entize(res);
                        }
                    }
                }
            },
            database: {
                cmd: {
                    list: {
                        action: async function (entize, msg) {
                            let q = msg.q || {};
                            const config = {
                                body: { ...q }
                            };
                            // see https://developers.notion.com/reference/post-search for usage
                            let res = await postJSON(search_endpoint, makeConfig(config));
                            let list = res.results.filter((v) => v.object == 'database')
                                .map((v) => entize(v));
                            return list;
                        }
                    },
                    load: {
                        action: async function (entize, msg) {
                            let id = msg.q.id;
                            let res;
                            null == id ? this.fail('invalid_id') : null;
                            res = await getJSON(db_endpoint + `/${id}`, makeConfig());
                            return entize(res);
                        }
                    },
                    save: {
                        action: async function (entize, msg) {
                            let q = msg.q || {};
                            let ent = msg.ent;
                            let id = ent.id;
                            let properties = ent.properties || {};
                            let title = ent.title || [];
                            let res;
                            // page_id must be provided if creating a new db
                            if (!q.page_id && !id) {
                                this.fail('invalid_page_id');
                            }
                            const config = null == id
                                ? {
                                    body: {
                                        'parent': {
                                            'page_id': q.page_id
                                        },
                                        'title': [...title],
                                        'properties': { ...properties }
                                    }
                                }
                                : {
                                    body: {
                                        'title': [...title],
                                        'properties': { ...properties }
                                    }
                                };
                            (null == id)
                                ? (res = await postJSON(db_endpoint, makeConfig(config)))
                                : (res = await patchJSON(db_endpoint + `/${id}`, makeConfig(config)));
                            return entize(res);
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
        let headers = {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
            'Notion-Version': '2021-05-13',
            'Content-Type': 'application/json'
        };
        // TODO: authenticate
        // Allow user to override
        seneca.shared.headers = { ...headers, ...options.headers };
    });
    return {
        exports: {
            sdk: () => this.shared.sdk,
        }
    };
}
const defaults = {
    debug: false,
    api: {
        search_endpoint: 'https://api.notion.com/v1/search',
        db_endpoint: 'https://api.notion.com/v1/databases',
        page_endpoint: 'https://api.notion.com/v1/pages',
    },
    headers: {
        'Accept': 'application/json',
        'Notion-Version': '2021-05-13',
        'Content-Type': 'application/json'
    }
};
Object.assign(NotionProvider, { defaults });
exports.default = NotionProvider;
if (typeof (module) !== 'undefined') {
    module.exports = NotionProvider;
}
//# sourceMappingURL=notion-provider.js.map
//# sourceMappingURL=notion-provider.js.map