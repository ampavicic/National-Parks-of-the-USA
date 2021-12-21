module.exports = class Parkovi {
  constructor() {}

  getJSON = async function () {
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/"
    MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      const cursor = dbo.collection("parkovi").find ({})
      const parkovi = await cursor.toArray();
      for (let i = 0; i < parkovi.length; i++) {
        const query = { _id: parkovi[i].location };
        const lok = dbo.collection("location")
        const cursor = await lok.find (query).toArray();
        const location = {
          "name": cursor[0].name,
          "capital_city": cursor[0].capital_city,
          "population" : cursor[0].population,
          "area" : cursor[0].area
        }
        parkovi[i].location = location;
      }
      console.log (data)
      const data = JSON.stringify(parkovi)
      return data; //ili data
    });
  };

getLocation = async function (year) {
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/"
  MongoClient.connect(url, async function(err, db) {
   
  if (err) throw err;
  console.log("Database connected!");
  var dbo = db.db("parkovi");
  
  const cursor = dbo.collection("location").find ({})
  const parkovi = await cursor.toArray();
   const data = JSON.stringify(parkovi)
   return data;
  });

}}
