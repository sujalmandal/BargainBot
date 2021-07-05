const ITEMS_CATALOG_URL="https://api.torn.com/torn/?selections=items&key=<API_KEY>";
module.exports = {
  getItemsCatalog: async function(axios,apiKey){
    try {
    const response = await axios.get(ITEMS_CATALOG_URL.replace("<API_KEY>",apiKey));
    const catalog = [];
    Object.keys(response.items).forEach(function(key){
      console.log(key);
      catalog.push({
        id:key,
        name:response.items[key].name,
        mPrice:response.items[key].market_value
      });
    });
    console.log(JSON.stringify(catalog));
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
  }
}