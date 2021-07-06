const constants = require('./Constants');
const apiKeyProvider = require('./ApiKeyProvider')
const externalService = require('./ExternalService');
const appService = require('./AppService');

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
      var itemId=151;
      var listing = await externalService.getLowestListingForItem(itemId,apiKeyProvider.getDefault());
      console.log(listing);
      var lowestListing = listing[listing.lowest];
      var itemInfo=await appService.getItemInfo(itemId);
      console.log(itemInfo);
      var priceDiff=itemInfo.mPrice-lowestListing.cost;
      if(priceDiff>0){
        messageEvent.channel.send(itemInfo.name+" underpriced by $"+priceDiff+" qty: "+lowestListing.quantity);
      }
      else{
        messageEvent.channel.send(itemInfo.name+" overpriced price by $"+priceDiff+" qty: "+lowestListing.quantity);
      }
      console.log("cost: "+lowestListing.cost+" quantity: "+lowestListing.quantity);
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