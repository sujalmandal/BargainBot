const Discord = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
db.set("key", "value").then(() => {});
db.get("key").then(value => {});
db.list("prefix").then(matches => {});
db.list().then(keys => {});
db.delete("key").then(() => {});


const client = new Discord.Client();
const API_KEY = process.env['API_KEY']

client.once('ready', () => {
  console.log("bot loaded!");
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('pong');
  }
});

client.login(API_KEY);