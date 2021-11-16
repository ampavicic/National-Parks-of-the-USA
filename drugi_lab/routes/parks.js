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
   
      const data = JSON.stringify(parkovi)
      res.json (parkovi)
      //return data;
    });

});
module.exports = router;