const Discord = require('discord.js');
const Database = require("@replit/database")
const axios = require('axios');
const commandHandler = require('./CommandHandler');
const externalService = require('./ExternalService');
const client = new Discord.Client();
const ITEM_DATA = "ITEM_CATALOG_KEY";
const DISCORD_BOT_API_KEY = process.env['API_KEY'];
const INITIAL_TORN_API_KEY = process.env['TRANSHUMAN_API_KEY'];
const TIME_INTERVAL = 3000;
client.login(DISCORD_BOT_API_KEY);
const db = new Database();
currentChannel = null;
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
  loadCatalog();
});

client.on('message', messageEvent => {
  userName = messageEvent.author.username;
  messageText = messageEvent.content;
  if (messageText.startsWith("/")) {
    handleCommand(userName, messageEvent);
  }
});

function handleCommand(userName, messageEvent) {
  console.log("Received: " + messageText);

  if(commandHandler.isInitCmd(messageEvent)){
    timerObject=commandHandler.startMonitoringPrices(TIME_INTERVAL,currentChannel);
  }
  else if(commandHandler.isStopCmd(messageEvent)){
    commandHandler.stopMonitoringPrices(timerObject);
  }
  else if (commandHandler.isAddMyKeyCmd(messageEvent)) {
    commandHandler.addMyKey(db,userName,messageEvent);
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}

async function loadCatalog() {
  catalog = await db.get("ITEM_CATALOG_KEY");
  if (!catalog) {
    console.log("catalog not found! Requesting now..");
    catalog = await externalService.getItemsCatalog(axios, INITIAL_TORN_API_KEY);
    await db.set("ITEM_CATALOG_KEY",catalog);
    console.log("catalog saved successfully!");
  }
  else{
    console.log("catalog found!");
    console.log(catalog);
  }
}
