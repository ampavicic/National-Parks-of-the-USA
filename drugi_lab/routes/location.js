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
      const query = { name: req.body.name };
      const lok = dbo.collection("location")
      const cursor = await lok.find (query).toArray();
   
      //const data = JSON.stringify(parkovi)
      res.json (cursor)
      //return data;
    });

});
module.exports = router;