const Discord = require('discord.js');
const Database = require("@replit/database")
const axios = require('axios');
const commandHandler = require('./CommandHandler');
const externalService = require('./ExternalService');
const appService = require('./AppService');

/* env variables */
const DISCORD_BOT_API_KEY = process.env['API_KEY'];

const client = new Discord.Client();
client.login(DISCORD_BOT_API_KEY);
const db = new Database();
timerObject = null;

client.once('ready', () => {
  console.log("checking item data..  ");
  appService.loadCatalog(db,axios,externalService);
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
    timerObject=commandHandler.startMonitoringPrices(externalService,messageEvent,axios);
  }
  else if(commandHandler.isStopCmd(messageEvent)){
    commandHandler.stopMonitoringPrices(timerObject,messageEvent);
  }
  else if(commandHandler.isPurgeCmd(messageEvent)){
    commandHandler.purge(db,messageEvent);
  }
  else if (commandHandler.isAddMyKeyCmd(messageEvent)) {
    commandHandler.addMyKey(db,messageEvent);
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}