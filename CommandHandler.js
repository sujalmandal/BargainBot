const constants = require('./Constants');
const apiKeyProvider = require('./ApiKeyProvider')

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
  addMyKey: function(db,messageEvent){
    userName=messageEvent.author.username;
    apiKey=messageEvent.content.split(constants.CMD_PARAM_SEPARATOR)[1];
    if(!apiKey){
      messageEvent.channel.send(constants.INVALID_CMD_ADD_MY_KEY);
    }
  },
  startMonitoringPrices: function(externalService,messageEvent,axios){
    timerObject=setInterval(function(){
      externalService.getLowestListingForItem(151,apiKeyProvider.getDefault(),axios);
    },
    constants.PRICE_UPDATE_INTERVAL);
    return timerObject;
  },
  stopMonitoringPrices: function(timerObject,messageEvent){
    clearInterval(timerObject);
    messageEvent.channel.send(constants.MSG_STOP_MONITOR_PRICE);
  },
  purge: async function(db,messageEvent){
    await db.delete(constants.DB_CATALOG_STORE_KEY_NAME);
    messageEvent.channel.send("purged catalog");
  }
}