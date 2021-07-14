const Database = require("@replit/database")
const constants = require('./Constants');
const db = new Database();

module.exports = {
  deleteCatalog: async function(){
    await db.delete(constants.DB_CATALOG_STORE_KEY_NAME);
  },
  getCatalog: async function(){
    return await db.get(constants.DB_CATALOG_STORE_KEY_NAME);
  },
  saveCatalog: async function(catalog){
    await db.set(constants.DB_CATALOG_STORE_KEY_NAME,catalog);
  }
}