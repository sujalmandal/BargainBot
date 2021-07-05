const Discord = require('discord.js');
const Database = require("@replit/database")
const axios = require('axios');
const commandHandler = require('./CommandHandler');
const externalService = require('./ExternalService');
const priceMonitorService = require('./PriceMonitorService');

/* env variables */
const DISCORD_BOT_API_KEY = process.env['API_KEY'];
const INITIAL_TORN_API_KEY = process.env['TRANSHUMAN_API_KEY'];

const client = new Discord.Client();
client.login(DISCORD_BOT_API_KEY);
const db = new Database();
timerObject = null;

/*
db.set("key", "value").then(() => {});
db.get("key").then(value => {});
db.list("prefix").then(matches => {});
db.list().then(keys => {});
db.delete("key").then(() => {});
*/

client.once('ready', () => {
  console.log("checking item data..  ");
  priceMonitorService.loadCatalog(db,axios,externalService);
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
  else if (commandHandler.isAddMyKeyCmd(messageEvent)) {
    commandHandler.addMyKey(db,messageEvent);
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}