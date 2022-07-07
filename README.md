![Seneca Notion-Provider](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Notion-Provider_ is a plugin for [Seneca](http://senecajs.org)


Provides access to the Notion API using the Seneca *provider*
convention. Notion API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.

See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.

NOTE: underlying third party SDK needs to be replaced as out of date and has a security issue.

[![npm version](https://img.shields.io/npm/v/@seneca/trello-provider.svg)](https://npmjs.com/package/@seneca/trello-provider)
[![build](https://github.com/senecajs/seneca-trello-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-trello-provider/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-trello-provider/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-trello-provider?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-trello-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-trello-provider)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/19462/branches/505954/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=19462&bid=505954)
[![Maintainability](https://api.codeclimate.com/v1/badges/f76e83896b731bb5d609/maintainability)](https://codeclimate.com/github/senecajs/seneca-trello-provider/maintainability)


| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|


## Quick Example


```js

// Setup - get the key value (<SECRET>) separately from a vault or
// environment variable.
Seneca()
  // Get API keys using the seneca-env plugin
  .use('env', {
    var: {
      $NOTION_TOKEN: String,
    }
  })
  .use('provider', {
    provider: {
      notion: {
        keys: {
          authToken: {
            value: '$NOTION_TOKEN'
          },
        }
      }
    }
  })
  .use('notion-provider')

let pageId = await seneca.entity('provider/notion/page')
                  .load$('<notion_page_id>');

Console.log('PAGE', pageId)

pageId.properties.checkMe.checkbox = false;
pageId = await pageId.save$()

Console.log('UPDATED PAGE', pageId)

```

## Install

```sh
$ npm install @seneca/notion-provider @seneca/env
```



<!--START:options-->


## Options

* `debug` : boolean <i><small>false</small></i>


Set plugin options when loading with:
```js


seneca.use('NotionProvider', { name: value, ... })


```


<small>Note: <code>foo.bar</code> in the list above means 
<code>{ foo: { bar: ... } }</code></small> 



<!--END:options-->

<!--START:action-list-->


## Action Patterns

* [role:entity,base:notion,cmd:load,name:page,zone:provider](#-roleentitybasenotioncmdloadnamepagezoneprovider-)
* [role:entity,base:notion,cmd:save,name:page,zone:provider](#-roleentitybasenotioncmdsavenamepagezoneprovider-)
* [sys:provider,get:info,provider:notion](#-sysprovidergetinfoprovidernotion-)


<!--END:action-list-->

<!--START:action-desc-->


## Action Descriptions

### &laquo; `role:entity,base:notion,cmd:load,name:page,zone:provider` &raquo;

Load Notion page data into an entity.



----------
### &laquo; `role:entity,base:notion,cmd:save,name:page,zone:provider` &raquo;

Update Notion page data from an entity.



----------
### &laquo; `sys:provider,get:info,provider:notion` &raquo;

Get information about the provider.



----------


<!--END:action-desc-->
