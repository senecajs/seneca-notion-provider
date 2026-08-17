![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/notion-provider

[![build](https://github.com/senecajs/seneca-notion-provider/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-notion-provider/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-notion-provider/badge.svg)](https://snyk.io/test/github/senecajs/seneca-notion-provider)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|


Provides access to the Notion API using the Seneca *provider*
convention. Notion API entities are represented as Seneca entities so
that they can be accessed using the Seneca entity API and messages.
See [seneca-entity](senecajs/seneca-entity) and the [Seneca Data
Entities
Tutorial](https://senecajs.org/docs/tutorials/understanding-data-entities.html) for more details on the Seneca entity API.
NOTE: underlying third party SDK needs to be replaced as out of date and has a security issue.


## Install

```sh
$ npm install @seneca/notion-provider @seneca/env
```



<!--START:options-->

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

## More Examples

See [test/](test/) for more usage examples.

## Motivation

A [Seneca.js](http://senecajs.org) plugin.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-notion-provider/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)

## API

### Options

*None.*


<!--END:options-->

<!--START:action-list-->

### Action Patterns

* ["role":"entity","base":"notion","cmd":"list","name":"database","zone":"provider"](#-roleentitybasenotioncmdlistnamedatabasezoneprovider-)
* ["role":"entity","base":"notion","cmd":"list","name":"page","zone":"provider"](#-roleentitybasenotioncmdlistnamepagezoneprovider-)
* ["role":"entity","base":"notion","cmd":"load","name":"database","zone":"provider"](#-roleentitybasenotioncmdloadnamedatabasezoneprovider-)
* ["role":"entity","base":"notion","cmd":"load","name":"page","zone":"provider"](#-roleentitybasenotioncmdloadnamepagezoneprovider-)
* ["role":"entity","base":"notion","cmd":"save","name":"database","zone":"provider"](#-roleentitybasenotioncmdsavenamedatabasezoneprovider-)
* ["role":"entity","base":"notion","cmd":"save","name":"page","zone":"provider"](#-roleentitybasenotioncmdsavenamepagezoneprovider-)
* ["sys":"provider","get":"info","provider":"notion"](#-sysprovidergetinfoprovidernotion-)


<!--END:action-list-->

<!--START:action-desc-->

### Action Descriptions

### &laquo; `"role":"entity","base":"notion","cmd":"list","name":"database","zone":"provider"` &raquo;

No description provided.



----------
### &laquo; `"role":"entity","base":"notion","cmd":"list","name":"page","zone":"provider"` &raquo;

List Noion page data into an entity.





#### Replies With


```
{}
```


----------
### &laquo; `"role":"entity","base":"notion","cmd":"load","name":"database","zone":"provider"` &raquo;

No description provided.



----------
### &laquo; `"role":"entity","base":"notion","cmd":"load","name":"page","zone":"provider"` &raquo;

Load Notion page data into an entity.





#### Replies With


```
{}
```


----------
### &laquo; `"role":"entity","base":"notion","cmd":"save","name":"database","zone":"provider"` &raquo;

No description provided.



----------
### &laquo; `"role":"entity","base":"notion","cmd":"save","name":"page","zone":"provider"` &raquo;

Update/Save Notion page data into an entity.





#### Replies With


```
{}
```


----------
### &laquo; `"sys":"provider","get":"info","provider":"notion"` &raquo;

Get information about the Notion SDK.



----------


<!--END:action-desc-->

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

The [SenecaJS org](http://senecajs.org/) encourages participation. If you feel you can help in any way, be
it with bug reporting, documentation, examples, extra testing, or new features, feel free
to [create an issue](https://github.com/senecajs/seneca-maintain/issues/new), or better yet - [submit a Pull Request](https://github.com/senecajs/seneca-maintain/pulls). For more
information on contribution, please see our [Contributing Guide](http://senecajs.org/contribute).

## Background

Check out the SenecaJS roadmap [here](https://senecajs.org/roadmap/)!
