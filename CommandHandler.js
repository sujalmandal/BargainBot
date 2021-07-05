module.exports = {
  isAddMyKeyCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith('/ADDMYKEY');
  },
  isInitCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith('/START');
  },
  isStopCmd: function(messageEvent){
    return messageEvent.content.toUpperCase().startsWith('/STOP');
  },
  
  addMyKey: function(db,userName,messageEvent){
    apiKey=messageEvent.content.split(" ")[1];
    if(!apiKey){
      messageEvent.channel.send("bad command\n"
      +"correct usage:\n"
      +"/addmykey INSERT_YOUR_KEY_HERE");
    }
  },
  startMonitoringPrices: function(intervalTime,messageEvent){
    timerObject=commandHandler.init(intervalTime,function(){

    });
    return timerObject;
  },
  stopMonitoringPrices: function(timerObject,messageEvent){
    clearInterval(timerObject);
    messageEvent.channel.send("Okay. I will stop sending monitoring prices.");
  }
}