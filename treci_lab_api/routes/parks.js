const express = require('express');
const router = express.Router();
const Park = require('../models/park');

router.get('/', async (req, res) => {

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
          "location_name": cursor[0].name,
          "location_capital_city": cursor[0].capital_city,
          "location_population" : cursor[0].population,
          "location_area" : cursor[0].area
        }
        parkovi[i].location = location;
      }
      console.log (typeof(parkovi))
      const data = JSON.stringify(parkovi)
      res.json (parkovi)
      //return data;
    });

});

router.get('/prikaz', async (req, res) => {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/"
    MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      const cursor = dbo.collection("parkovi").find ({})
      const parkovi = await cursor.toArray();
      const parks = []
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
        
        const park = {
          "name" : parkovi[i].name,
          "location_name":  cursor[0].name,
          "location_area": cursor[0].area,
          "location_population": cursor[0].population,
          "location_capital_city": cursor[0].capital_city,
          "date": parkovi[i].date,
          "area": parkovi[i].area,
          "visitors": parkovi[i].visitors,
          "fees": parkovi[i].fees,
          "website" : parkovi[i].website,
          "climate": parkovi[i].climate,
          "WiFi_access": parkovi[i].WiFi_access,
          "cellular_access": parkovi[i].cellular_access,
          "average_temperature": parkovi[i].average_temperature,
          "picture": parkovi[i].picture
        }
        parks.push (park)
        parkovi[i].location = location;
      }
      console.log (typeof(parks))
      //console.log (data)
      //const data = JSON.stringify(parkovi)
      //return parks; //ili data
      res.json (parks)
    });

});
module.exports = router;