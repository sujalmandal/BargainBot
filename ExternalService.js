const constants = require('./Constants');
const axios = require('axios');
axios.defaults.timeout = 2000;

module.exports = {
  getItemsCatalog: async function(apiKey){
    try {
    const source = axios.CancelToken.source();
    const timeout = setTimeout(() => {
      source.cancel();
    }, 5000);
    const response = await axios.get(
      constants.ITEMS_CATALOG_URL.
        replace(constants.TORN_API_KEY_PLACEHOLDER,apiKey),
        {cancelToken: source.token});
    clearTimeout(timeout);
    const catalog = {
      timestamp: Date.now(),
      items:[]
    }
    const items=response.data.items;
      Object.keys(items).forEach(function(id){
        if(items[id].market_value>0){
          catalog.items.push({
            id:id,
            name:items[id].name,
            mPrice:items[id].market_value,
            type:items[id].type
          });
        }
      });
    return catalog;
  } catch (error) {
    console.error("getItemsCatalog(): error-> "+error);
    return error;
  }
  },
  getLowestListingForItem: async function(itemId,apiKey){
    try {
        var url=constants.ITEM_PRICE_URL.replace(constants.TORN_API_KEY_PLACEHOLDER,apiKey);
        url=url.replace(constants.TORN_ITEM_ID_PLACEHOLDER,itemId);
        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
          source.cancel();
        }, 5000);
        const response = await axios.get(url,{cancelToken: source.token});
        clearTimeout(timeout);
        const itemmarketItem = response.data.itemmarket[0];
        const bazaarItem = response.data.bazaar[0];
        const lowestListingType = itemmarketItem.cost < bazaarItem.cost?"market":"bazaar";
        return {
          market:itemmarketItem,
          bazaar:bazaarItem,
          lowest:lowestListingType
        };
      } catch (error) {
        console.error("getLowestListingForItem(): error ->"+error);
        return error;
      }
  }
}