const constants = require('./Constants');

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

  /* command handlers */
  addMyKey: function(db,messageEvent){
    userName=messageEvent.author.username;
    apiKey=messageEvent.content.split(constants.CMD_PARAM_SEPARATOR)[1];
    if(!apiKey){
      messageEvent.channel.send(constants.INVALID_CMD_ADD_MY_KEY);
    }
  },
  startMonitoringPrices: function(messageEvent){
    timerObject=setInterval(
      function(){
        messageEvent.channel.send("hi");
        
      },
      constants.PRICE_UPDATE_INTERVAL);
    return timerObject;
  },
  stopMonitoringPrices: function(timerObject,messageEvent){
    clearInterval(timerObject);
    messageEvent.channel.send(constants.MSG_STOP_MONITOR_PRICE);
  }
}