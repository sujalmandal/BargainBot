const Database = require("@replit/database")
const db = new Database();

module.exports = {
  connect: function(){
    return db;
  }
}