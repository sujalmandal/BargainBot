const TimeAgo = require('javascript-time-ago');
const en = require('javascript-time-ago/locale/en')
const currencyFormatter = require('currency-formatter');

TimeAgo.addDefaultLocale(en);
timeAgo = new TimeAgo('en-US')

module.exports={
  MONEY_FORMAT: (val)=>{
    return currencyFormatter.format(val, { code: 'USD' });
  },
  TIME_AGO_FORMATTER: timeAgo,
  ITEM_TYPE_KEY: "ITEM_TYPE_TO_MONITOR",
  ITEM_TYPE_PLUSHIE: "PLUSHIES",
  ITEM_TYPE_FLOWER: "FLOWERS",
  ITEM_TYPE_OTHERS: "OTHERS",
  ITEM_TYPE_E_DRINK: "ENERGYDRINKS",
  CMD_ADD_MY_KEY:"/ADDMYKEY",
  CMD_START_MONITOR:"/BARGAIN",
  CMD_STOP_MONITOR:"/STOP",
  UPDATE:"/UPDATE",
  PRICES:"PRICES",
  MIN_PROFIT:"MINPROFIT",
  INTERVAL:"INTERVAL",
  CMD_PURGE_CHATS:"/PURGE",
  INVALID_CMD_ADD_MY_KEY:"bad command\ncorrect usage:\n/addmykey INSERT_YOUR_KEY_HERE",
  INVALID_BARGAIN_CMD:"bad command\ncorrect usage: \n/bargain plushies/flowers/energydrinks/others",
  CMD_PARAM_SEPARATOR:" ",
  MSG_STOP_MONITOR_PRICE:"Stopped monitoring prices..",
  PRICE_UPDATE_INTERVAL:5000,
  DB_CATALOG_STORE_KEY_NAME:"ITEM_CATALOG_KEY",
  TORN_API_KEY_PLACEHOLDER:"<API_KEY>",
  TORN_ITEM_ID_PLACEHOLDER:"<ITEM_ID>",
  ITEM_PRICE_URL:"https://api.torn.com/market/<ITEM_ID>?selections=bazaar,itemmarket&key=<API_KEY>",
  ITEMS_CATALOG_URL:"https://api.torn.com/torn/?selections=items&key=<API_KEY>",
  SHOP_URL: "https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=<ITEM_ID>"
}