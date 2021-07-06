const constants = require('./Constants');
const apiKeyProvider = require('./ApiKeyProvider')
const externalService = require('./ExternalService');
const appService = require('./AppService');
const itemIdProvider = require('./AppService');

const db = require('./DatabaseProvider');

module.exports = {
  /* command detectors */
  isAddMyKeyCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_ADD_MY_KEY);
  },
  isInitCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_START_MONITOR);
  },
  isStopCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_STOP_MONITOR);
  },
  isPurgeCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_STOP_PURGE);
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
      var listing = await externalService.getLowestListingForItem(itemId,apiKeyProvider.getDefault());
      //console.log("listing :"+JSON.stringify(listing));
      var lowestListing = listing[listing.lowest];
      var itemInfo=await appService.getItemInfo(itemId);
      //console.log("iteminfo : "+JSON.stringify(itemInfo));
      var priceDiffSingle=itemInfo.mPrice-lowestListing.cost;
      var priceDiffTotal=priceDiffSingle*lowestListing.quantity;
      if(priceDiffTotal>150000){
        messageEvent.channel.send(itemInfo.name+": total profit to be made $"+priceDiff+" qty: "+lowestListing.quantity);
      }
      //console.log("cost: "+lowestListing.cost+" quantity: "+lowestListing.quantity);
    },
    constants.PRICE_UPDATE_INTERVAL);
    return timerObject;
  },
  stopMonitoringPrices: function(timerObject,messageEvent){
    clearInterval(timerObject);
    messageEvent.channel.send(constants.MSG_STOP_MONITOR_PRICE);
  },
  purge: async function(messageEvent){
    await db.connect().delete(constants.DB_CATALOG_STORE_KEY_NAME);
    messageEvent.channel.send("purged catalog");
  }
}