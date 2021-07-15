const constants = require('./Constants');
const apiKeyProvider = require('./ApiKeyProvider')
const externalService = require('./ExternalService');
const appService = require('./AppService');
const itemIdProvider = require('./ItemProvider');
const Discord = require('discord.js');
const dao = require('./DataService');

module.exports = {
  cachedCatalog:null,
  minProfitToMonitor:3,
  timerObject:null,
  /* command detectors */
  isAddMyKeyCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_ADD_MY_KEY);
  },
  isPurgeChat: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_PURGE_CHATS);
  },
  isStartMonitorCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_START_MONITOR);
  },
  isStopCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith(constants.CMD_STOP_MONITOR);
  },
  isUpdateCatalog: function(messageEvent){
    var text=messageEvent.content.toUpperCase();
    var tokens=text.split(constants.CMD_PARAM_SEPARATOR);
    var firstToken=tokens[0];
    var secondToken=tokens[1];
    return (firstToken==constants.UPDATE 
      && secondToken===constants.PRICES);
  },
  isUpdateMinProfitToMonitor: function(messageEvent){
    var text=messageEvent.content.toUpperCase();
    var tokens=text.split(constants.CMD_PARAM_SEPARATOR);
    var firstToken=tokens[0];
    var secondToken=tokens[1];
    var thirdToken=tokens[2];
    var isUpdateProfitThreshold=(
      firstToken===constants.UPDATE 
      && secondToken===constants.MIN_PROFIT
      && thirdToken!==undefined
      && !isNaN(parseInt(thirdToken))
    );
    return isUpdateProfitThreshold;
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
    itemTypeToMonitor=messageEvent.content.split(constants.CMD_PARAM_SEPARATOR)[1];
    if(!itemTypeToMonitor){
      messageEvent.channel.send(constants.INVALID_BARGAIN_CMD);
      return;
    }
    if(this.timerObject!=null){
      clearInterval(this.timerObject);
    }
    this.timerObject=setInterval(async function(){
      //get next item to look at
      var itemId=itemIdProvider.getNextItemId(itemTypeToMonitor.toUpperCase());
      if(itemId==null || itemId==undefined){
        messageEvent.channel.send("Unknown item type!");
        return;
      }
      var itemInfo=null;
      itemInfo=await appService.getItemInfo(itemId,this.cachedCatalog);
      try{
        var listing = await externalService.getLowestListingForItem(itemId,apiKeyProvider.getDefault());
        //console.log("listing :"+JSON.stringify(listing));
        var lowestListing = listing[listing.lowest];
        //console.log("iteminfo : "+JSON.stringify(itemInfo));
        var priceDiffSingle=itemInfo.mPrice-lowestListing.cost;
        var priceDiffTotal=priceDiffSingle*lowestListing.quantity;
        var profitToPriceRatio=Math.floor((priceDiffSingle/itemInfo.mPrice)*100);
        console.log(itemInfo.name+"  diff: "+priceDiffSingle+" profit to price ratio: "+profitToPriceRatio+"%");
        if(profitToPriceRatio>this.minProfitToMonitor){
          message = appService.getMessage(
            itemInfo,
            lowestListing,
            priceDiffSingle,
            profitToPriceRatio,
            priceDiffTotal,
            catalog
          );
          if(message){
            messageEvent.channel.send(message);
          }
        }
      }
      catch(err){
        console.log(err);
        messageEvent.channel.send("Error! Something, somewhere is not working.");
        clearInterval(this.timerObject);
        return null;
      }
    },
    constants.PRICE_UPDATE_INTERVAL);
    messageEvent.channel.send("showing bargains "
      +JSON.stringify(itemIdProvider.getItemNamesByType(itemTypeToMonitor.toUpperCase()))
      +" with more than "+this.minProfitToMonitor+"% profit.");
    return;
  },
  stopMonitoringPrices: function(messageEvent){
    clearInterval(this.timerObject);
    messageEvent.channel.send(constants.MSG_STOP_MONITOR_PRICE);
  },
  updateCatalog: async function(messageEvent){
    await dao.deleteCatalog();
    cachedCatalog = await appService.loadCatalog();
    messageEvent.channel.send("updated catalog.");
  },
  updateMinProfitToMonitor: async function(messageEvent){
    this.minProfitToMonitor=parseInt(messageEvent.content.split(constants.CMD_PARAM_SEPARATOR)[2]);
    messageEvent.channel.send("showing bargains with more than "+this.minProfitToMonitor+"% profit.");
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