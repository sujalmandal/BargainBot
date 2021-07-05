const Discord = require('discord.js');
const Database = require("@replit/database")
const axios = require('axios');
const commandHandler = require('./CommandHandler');
const externalService = require('./ExternalService');
const jmespath = require('jmespath');

const client = new Discord.Client();
const ITEM_DATA = "ITEM_CATALOG_KEY";
const DISCORD_BOT_API_KEY = process.env['API_KEY'];
const INITIAL_TORN_API_KEY = process.env['TRANSHUMAN_API_KEY'];
client.login(DISCORD_BOT_API_KEY);
const db = new Database();


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
  messageText = messageEvent.content;
  console.log("Received: " + messageText);
  if (messageText.toUpperCase().startsWith('/ADDMYKEY')) {
    messageEvent.channel.send(commandHandler.addMyKey(db, userName, messageText.split(" ")[1]));
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}

async function loadCatalog() {
  catalog = await db.get("ITEM_CATALOG_KEY");
  if (!catalog) {
    console.log("catalog not found!");
    externalService.getItemsCatalog(axios, INITIAL_TORN_API_KEY);
  }
}