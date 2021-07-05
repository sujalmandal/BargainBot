const constants = require('./Constants');

module.exports = {
  loadCatalog: async function(db,axios,externalService) {
  catalog = await db.get(constants.DB_CATALOG_STORE_KEY_NAME);
  if (!catalog) {
    console.log("catalog not found! Requesting now..");
    catalog = await externalService.getItemsCatalog(axios, INITIAL_TORN_API_KEY);
    await db.set(constants.DB_CATALOG_STORE_KEY_NAME,catalog);
    console.log("catalog saved successfully!");
  }
  else{
    console.log("catalog found!");
    console.log(catalog);
  }
}
}