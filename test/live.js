const Seneca = require('seneca');

Seneca({legacy: false})
  .test()
  .use('promisify')
  .use('entity')
  .use('env', {
    // debug: true,
    file: [__dirname + '/local-env.js;?'],
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
  .use('../')
  .ready(async function() {
    const seneca = this

    console.log('SDK:', seneca.export('NotionProvider/sdk')())
    console.log(await seneca.entity('provider/notion/page').list$());
    let pageId = await seneca.entity('provider/notion/page').load$('<id>');
    console.log(pageId);
    pageId.properties.checkMe.checkbox = false;
    pageId = await pageId.save$();
    console.log(pageId);
    /*
    this.act('sys:provider,get:info,provider:notion', async(err, reply)=>{
	    console.log(reply);
    });

    this.act('role:entity,base:notion,cmd:load,name:page,zone:provider', {q: {id: '77508137-5a10-4570-83ff-320643bf5e81'}}, async(err, reply)=>{
	    console.log(reply);
    });
    
    this.act('role:entity,base:notion,cmd:save,name:page,zone:provider', {ent: {id: pageId.id, properties:pageId.properties}}, async(err, reply)=>{
           if(!err)
                   console.log(reply);
   });
   */



  });
