const constants = require('./Constants');

module.exports = {
  getItemsCatalog: async function(axios,apiKey){
    try {
    const response = await axios.get(
      constants.ITEMS_CATALOG_URL.
        replace(constants.TORN_API_KEY_PLACEHOLDER,apiKey));
    const catalog = {
      timestamp: new Date(),
      items:[]
    }
    const items=response.data.items;
      Object.keys(items).forEach(function(id){
        catalog.items.push({
          id:id,
          name:items[id].name,
          mPrice:items[id].market_value
        });
      });
    return catalog;
  } catch (error) {
    console.error(error);
    return error;
  }
  }
}