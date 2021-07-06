const constants = require('./Constants');
const TimeAgo = require('javascript-time-ago')
const en = require('javascript-time-ago/locale/en')
const fs = require('fs')
const apiKeyProvider = require('./ApiKeyProvider')
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

/*
db.set("key", "value").then(() => {});
db.get("key").then(value => {});
db.list("prefix").then(matches => {});
db.list().then(keys => {});
db.delete("key").then(() => {});
*/


module.exports = {
  loadCatalog: async function(db,axios,externalService) {
  catalog = await db.get(constants.DB_CATALOG_STORE_KEY_NAME);
  if (!catalog) {
    console.log("catalog not found! Requesting now..");
    catalog = await externalService.getItemsCatalog(apiKeyProvider.getDefault(),axios);
    await db.set(constants.DB_CATALOG_STORE_KEY_NAME,catalog);
    console.log("catalog saved successfully!");
  }
  else{
    console.log("catalog found!");
    fs.writeFile("./catalog.json", JSON.stringify(catalog), function(err){
      if (err) throw err;
      console.log("wrote catalog to file");
    }); 
    var totalItems=catalog.items.length;
    var timeDiffText=timeAgo.format(catalog.timestamp);
    console.log("total items: "+totalItems+" last updated "+timeDiffText);
  }
}
}