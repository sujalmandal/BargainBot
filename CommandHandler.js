const constants = require('./Constants');
const apiKeyProvider = require('./ApiKeyProvider')
const externalService = require('./ExternalService');
const appService = require('./AppService');
const itemIdProvider = require('./ItemProvider');
const Discord = require('discord.js');
const db = require('./DatabaseProvider');

module.exports = {
  cachedCatalog:null,
  /* command detectors */
  isAddMyKeyCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_ADD_MY_KEY);
  },
  isPurgeChat: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_PURGE_CHATS);
  },
  isInitCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_START_MONITOR);
  },
  isStopCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_STOP_MONITOR);
  },
  isUpdateCatalog: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.UPDATE_PRICES);
  },

  /* command handlers */
  addMyKey: function(messageEvent){
    userName=messageEvent.author.username;
    apiKey=messageEvent.content.split(constants.CMD_PARAM_SEPARATOR)[1];
    if(!apiKey){
      messageEvent.channel.send(constants.INVALID_CMD_ADD_MY_KEY);
    }
  },
  startMonitoringPrices: async function(messageEvent){
    timerObject=setInterval(async function(){
      //get next item to look at
      var itemId=itemIdProvider.getNextItemId();
      var itemInfo=null;
      itemInfo=await appService.getItemInfo(itemId,this.cachedCatalog);
      console.log("Checking: "+itemInfo.name);
      var listing = null;
      try{
        listing = await externalService.getLowestListingForItem(itemId,apiKeyProvider.getDefault());
        //console.log("listing :"+JSON.stringify(listing));
        var lowestListing = listing[listing.lowest];
        //console.log("iteminfo : "+JSON.stringify(itemInfo));
        var priceDiffSingle=itemInfo.mPrice-lowestListing.cost;
        var priceDiffTotal=priceDiffSingle*lowestListing.quantity;
        var profitToPriceRatio=Math.floor((priceDiffSingle/itemInfo.mPrice)*100);
        //show message only if total profit is above 100K and profit to price ratio is more than x %
        if(profitToPriceRatio>1 && priceDiffTotal>100000){
          var timeDiffText=timeAgo.format(catalog.timestamp);
          decoratedMessage=new Discord.MessageEmbed().setColor('#9ccc65')
          .setTitle(itemInfo.name+" : Funds required "+constants.MONEY_FORMAT(lowestListing.cost*lowestListing.quantity))
          .setURL(constants.SHOP_URL.replace(constants.TORN_ITEM_ID_PLACEHOLDER,itemId))
          .addFields(
            { name : 'Total profit possible: ', value: constants.MONEY_FORMAT(priceDiffTotal), inline: true },
            { name: 'Market price: ', value: constants.MONEY_FORMAT(itemInfo.mPrice), inline: true },
            { name: 'Current cost: ', value: constants.MONEY_FORMAT(lowestListing.cost), inline: true },
            { name: 'Quantity listed: ', value: lowestListing.quantity, inline: true },
            { name: 'Undervalued by: ', value: constants.MONEY_FORMAT(priceDiffSingle), inline: true },
            { name: 'profit to price ratio: ', value: profitToPriceRatio+"%", inline: true }
          )
          .setFooter("market price last updated "+constants.TIME_AGO_FORMATTER.format(catalog.timestamp))
          .setTimestamp();
          messageEvent.channel.send(decoratedMessage);
        }
      }
      catch(err){
        console.log(err);
        messageEvent.channel.send("Error connecting to torn.");
        clearInterval(timerObject);
        return null;
      }
    },
    constants.PRICE_UPDATE_INTERVAL);
    return timerObject;
  },
  stopMonitoringPrices: function(timerObject,messageEvent){
    clearInterval(timerObject);
    messageEvent.channel.send(constants.MSG_STOP_MONITOR_PRICE);
  },
  updateCatalog: async function(messageEvent){
    this.cachedCatalog=await db.connect().delete(constants.DB_CATALOG_STORE_KEY_NAME);
    messageEvent.channel.send("updated catalog");
  },
  deleteChats: function(messageEvent){
    (async () => {
      let deleted;
      do {
        deleted = await messageEvent.channel.bulkDelete(100);
      } while (deleted.size != 0);
    })();
  }
}