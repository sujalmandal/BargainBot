const constants = require('./Constants');
const dao = require('./DataService');
const apiKeyProvider = require('./ApiKeyProvider');
const externalService = require('./ExternalService');
const fs = require('fs')
const Discord = require('discord.js');
const BloomFilter = require('bloom-filter-cpp').BloomFilter;
const filter = new BloomFilter();

module.exports = {
  loadCatalog: async function() {
  catalog = await dao.getCatalog();
    if (!catalog) {
      catalog = await externalService.getItemsCatalog(apiKeyProvider.getDefault());
      dao.saveCatalog(catalog);
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
        catalog = await dao.getCatalog();
      }
      else{
        catalog = cachedCatalog;
      }
      return catalog.items.filter(item=>{
        return item.id==itemId;
      })[0];
  },
  getMessage: function(itemInfo,lowestListing,priceDiffSingle,profitToPriceRatio,priceDiffTotal,catalog){
    if(!filter.exists(lowestListing.ID)){
      filter.add(lowestListing.ID);
      return new Discord.MessageEmbed().setColor('#9B59B6')
          .setTitle(itemInfo.name)
          .setURL(constants.SHOP_URL.replace(constants.TORN_ITEM_ID_PLACEHOLDER,itemInfo.id))
          .setDescription("Funds required "+constants.MONEY_FORMAT(lowestListing.cost*lowestListing.quantity))
          .addFields(
            { name : 'Total profit possible: ', value: constants.MONEY_FORMAT(priceDiffTotal), inline: true },
            { name: 'Market price: ', value: constants.MONEY_FORMAT(itemInfo.mPrice), inline: true },
            { name: 'Current cost: ', value: constants.MONEY_FORMAT(lowestListing.cost), inline: true },
            { name: 'Quantity listed: ', value: lowestListing.quantity, inline: true },
            { name: 'Undervalued by: ', value: constants.MONEY_FORMAT(priceDiffSingle), inline: true },
            { name: 'Profit to price ratio: ', value: profitToPriceRatio+"%", inline: true }
          )
          .setFooter("market price last updated "+constants.TIME_AGO_FORMATTER.format(catalog.timestamp))
          .setTimestamp(Date.now());
    }
    else{
      //message already sent
      return null;
    }
  }
}