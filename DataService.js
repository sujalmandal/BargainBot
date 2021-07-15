const constants = require('./Constants');
const loki = require("lokijs");
const lokidb = new loki('bargainbot.db');
const catalogs = lokidb.addCollection('catalogs');
const settings = lokidb.addCollection('settings');
module.exports = {
  deleteCatalog: function(){
    catalogs.findAndRemove({key:constants.DB_CATALOG_STORE_KEY_NAME});
  },
  getCatalog: function(){
    catalogEntry=catalogs.findOne({key:constants.DB_CATALOG_STORE_KEY_NAME});
    if(catalogEntry!==null)
      return catalogEntry.data;
    else
      return null;
  },
  saveCatalog: function(catalog){
    catalogs.insert({ 
      key : constants.DB_CATALOG_STORE_KEY_NAME, 
      data: catalog 
    });
  }
}