module.exports={
  ITEMS_TO_MONITOR:[],
  CMD_ADD_MY_KEY:"/ADDMYKEY",
  CMD_START_MONITOR:"/START",
  CMD_STOP_MONITOR:"/STOP",
  CMD_STOP_PURGE:"/PURGE",
  INVALID_CMD_ADD_MY_KEY:"bad command\ncorrect usage:\n/addmykey INSERT_YOUR_KEY_HERE",
  CMD_PARAM_SEPARATOR:" ",
  MSG_STOP_MONITOR_PRICE:"Okay. I will stop sending monitoring prices.",
  PRICE_UPDATE_INTERVAL:3000,
  DB_CATALOG_STORE_KEY_NAME:"ITEM_CATALOG_KEY",
  TORN_API_KEY_PLACEHOLDER:"<API_KEY>",
  TORN_ITEM_ID_PLACEHOLDER:"<ITEM_ID>",
  ITEM_PRICE_URL:"https://api.torn.com/market/<ITEM_ID>?selections=bazaar,itemmarket&key=<API_KEY>",
  ITEMS_CATALOG_URL:"https://api.torn.com/torn/?selections=items&key=<API_KEY>"
}