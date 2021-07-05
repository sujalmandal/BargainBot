module.exports = {
  addMyKey: function(db,userName,messageText){
    if(!messageText){
      return "bad command\ncorrect usage:\n/addmykey INSERT_YOUR_KEY_HERE";
    }
  }
}