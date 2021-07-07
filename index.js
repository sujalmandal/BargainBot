const Discord = require('discord.js');
const commandHandler = require('./CommandHandler');
const appService = require('./AppService');

/* env variables */
const DISCORD_BOT_API_KEY = process.env['API_KEY'];

const client = new Discord.Client();
client.login(DISCORD_BOT_API_KEY);
timerObject = null;



client.once('ready', () => {
  console.log("checking item data..  ");
  appService.loadCatalog();
});

client.on('message', messageEvent => {
  messageText = messageEvent.content;
  if (messageText.startsWith("/")) {
    handleCommand(messageEvent);
  }
});

function handleCommand(messageEvent) {
  console.log("Received: " + messageText);

  if(commandHandler.isInitCmd(messageEvent)){
    timerObject=commandHandler.startMonitoringPrices(messageEvent);
  }
  else if(commandHandler.isStopCmd(messageEvent)){
    commandHandler.stopMonitoringPrices(timerObject,messageEvent);
  }
  /* update items and market price */
  else if(commandHandler.isUpdateCatalog(messageEvent)){
    commandHandler.updateCatalog(messageEvent);
  }
  else if(commandHandler.isPurgeChat(messageEvent)){
    commandHandler.deleteChats(messageEvent);
  }
  else if (commandHandler.isAddMyKeyCmd(messageEvent)) {
    commandHandler.addMyKey(messageEvent);
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}