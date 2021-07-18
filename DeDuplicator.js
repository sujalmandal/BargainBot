module.exports = {
    timerObject:null,
    buckets:[],
    init:function(){
        if(this.timerObject==null){
            setInterval(()=>{
                this.buckets=[];
                console.log("resetting accumulated ids..");
            },5*60*1000);
        }
    },
    has:function(id){
        this.buckets.forEach((item)=>{
            if(id==item){
                return true;
            }
        });
        return false;
    },
    add:function(id){
        console.log("store listing : "+id);
        this.buckets.push(id);
    }
}