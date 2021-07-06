module.exports = {
  
  plushies:[{id:"384",name:"Camel Plushie"},{id:"281",name:"Lion Plushie"},{id:"274",name:"Panda Plushie"},{id:"269",name:"Monkey Plushie"},{id:"273",name:"Chamois Plushie"},{id:"268",name:"Red Fox Plushie"},{id:"266",name:"Nessie Plushie"}],
  
  flowers:[{id:"385",name:"Tribulus Omanense"},{id:"276",name:"Peony"},{id:"282",name:"African Violet"},{id:"277",name:"Cherry Blossom"},{id:"267",name:"Heather"},{id:"271",name:"Ceibo Flower"},{id:"264",name:"Orchid"},{id:"272",name:"Edelweiss"},{id:"617",name:"Banana Orchid"}],
  
  energyDrinks:[{id:"555",name:"Can of X-MASS"},{id:"533",name:"Can of Taurine Elite"},{id:"532",name:"Can of Red Cow"},{id:"554",name:"Can of Rockstar Rudolph"},{id:"553",name:"Can of Santa Shooters"},{id:"530",name:"Can of Munster"},{id:"987",name:"Can of Crocozade"},{id:"986",name:"Can of Damp Valley"},{id:"985",name:"Can of Goose Juice"}],
  
  misc:[{id:"370",name:"Drug Pack"},{id:"206",name:"Xanax"},{id:"367",name:"Feathery Hotel Coupon"},{id:"366",name:"Erotic DVD"},{id:"226",name:"Smoke Grenade"}],
  
  items:[206,367,366,384,281,274,269,273,268,385,276,282,277],
  
  getNextItemId :function(){
    return this.items[Math.floor(Math.random()*this.items.length)];
  }
}