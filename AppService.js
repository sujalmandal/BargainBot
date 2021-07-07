const constants = require('./Constants');
const db = require('./DatabaseProvider');
const apiKeyProvider = require('./ApiKeyProvider');
const externalService = require('./ExternalService');
const fs = require('fs')

module.exports = {
  loadCatalog: async function() {
  catalog = await db.connect().get(constants.DB_CATALOG_STORE_KEY_NAME);
    if (!catalog) {
      console.log("catalog not found! Requesting now..");
      catalog = await externalService.getItemsCatalog(apiKeyProvider.getDefault());
      await db.connect().set(constants.DB_CATALOG_STORE_KEY_NAME,catalog);
      fs.writeFile("./catalog.json", JSON.stringify(catalog), function(err){
        if (err) throw err;
        console.log("wrote catalog to file");
      });
      console.log("catalog saved successfully!");
    }
    else{
      console.log("catalog found!");
      var totalItems=catalog.items.length;
      var timeDiffText=constants.TIME_AGO_FORMATTER.format(catalog.timestamp);
      console.log("total items: "+totalItems+" last updated "+timeDiffText);
    }
    return catalog;
  },
  getItemInfo: async function(itemId,cachedCatalog){
      var catalog=null;
      if(cachedCatalog==null){
        catalog = await db.connect()
        .get(constants.DB_CATALOG_STORE_KEY_NAME);
      }
      else{
        catalog = cachedCatalog;
      }
      return catalog.items.filter(item=>{
        return item.id==itemId;
      })[0];
  }
}