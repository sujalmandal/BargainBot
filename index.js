const Discord = require('discord.js');
const commandHandler = require('./CommandHandler');
const appService = require('./AppService');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

/* web */
app.get('/', (req, res) => {
  res.send('<h1>Bot activated/reactivated!</h1><h5>Authored by '+
    +'<a href="https://www.torn.com/profiles.php?XID=2575642">Transhumanist</a></h5>');
})

app.listen(port, () => {
  console.log("started bot. Listening at http://localhost:${port}");
})

/* env variables */
const DISCORD_BOT_API_KEY = process.env['API_KEY'];

const client = new Discord.Client();
client.login(DISCORD_BOT_API_KEY);
timerObject = null;

client.once('ready', async () => {
  console.log("loading item details..  ");
  await appService.loadCatalog();
});

client.on('message', messageEvent => {
  messageText = messageEvent.content;
  if (messageText.startsWith("/")) {
    handleCommand(messageEvent);
  }
});

function handleCommand(messageEvent) {
  console.log("Received: " + messageText);

  if(commandHandler.isStartMonitorCmd(messageEvent)){
    commandHandler.startMonitoringPrices(messageEvent);
  }
  else if(commandHandler.isStopCmd(messageEvent)){
    commandHandler.stopMonitoringPrices(messageEvent);
  }
  else if(commandHandler.isUpdateCatalog(messageEvent)){
    commandHandler.updateCatalog(messageEvent);
  }
  else if(commandHandler.isUpdateMinProfitToMonitor(messageEvent)){
    commandHandler.updateMinProfitToMonitor(messageEvent);
  }
  else if(commandHandler.isPurgeChat(messageEvent)){
    commandHandler.deleteChats(messageEvent);
  }
  else if (commandHandler.isAddMyKeyCmd(messageEvent)) {
    commandHandler.addMyKey(messageEvent);
  }
  else if(commandHandler.isUpdateInterval(messageEvent)){
    commandHandler.updateTimeInterval(messageEvent);
  } else {
    messageEvent.channel.send("No such command exists.");
  }
}