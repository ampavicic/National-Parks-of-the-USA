//import { MongoClient } from "mongodb";
const express = require("express");
const path = require("path");
const mangoos = require('mongoose');
const bodyParser = require('body-parser');
var mongo = require('mongodb');
const app = express();
const fs = require('fs')

const parse  = require('json2csv').Parser;

app.set("views", path.join(__dirname, "view"));
app.engine("html", require("ejs").renderFile);
app.get("/table", async function (req, res) {
   res.render("datatable.html");
 });

app.use(express.json());
app.use(express.static("view"));

const parkRoute = require ('./routes/parks');

app.use('/parks', parkRoute);
const locationkRoute = require ('./routes/location');

app.use('/location', locationkRoute);


// app.get("/table", async function (req, res) {
//   var JSONfile = await base.getJSON();
//   res.render("datatable.html");
// });
// app.get("/data", async function (req, res) {
//   var JSONfile = await base.getJSON();
//   //console.log(JSONfile[0].venues);
//   res.send(JSONfile);
// });
// app.post("/venues", async function (req, res) {
//   //console.log(req.body.year);
//   var venues = await base.getVenues(req.body.year);
//   res.json({
//     venues: venues,
//   });
// });

//import { MongoClient } from "mongodb";
//const MongoClient = require('mongodb').MongoClient;
//const url = "mongodb://localhost:27017/"
// const client = new MongoClient(url);
// async function run() {
//    try {
//      await client.connect();
//      const database = client.db("parkovi");
//      const parkovi = database.collection("parkovi");
//      const location = database.collection("location");
     
//      var parks;
//      parkovi.find ({}).toArray (function(err, result) {
//          if (err) throw err;
//          parks = result;
//          console.log(parks);
//          //db.close();
//        });
//      console.log (parks)
//    } finally {
//      await client.close();
//    }
//  }
//  run().catch(console.dir);




function arrayToCSV (data) {
   csv = data.map(row => Object.values(row));
   csv.unshift(Object.keys(data[0]));
   return csv.join('\n');
}


var location;
var newParks = [];
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"
MongoClient.connect(url, async function(err, db) {
   
  if (err) throw err;
  console.log("Database connected!");
  var dbo = db.db("parkovi");
  
  const cursor = dbo.collection("parkovi").find ({})
  const parkovi = await cursor.toArray();
//   .toArray (function(err, result) {
//    if (err) throw err;
//    const parks = result;
//    console.log(parks.length);
//    //db.close();
//    });
   var csv = '_id,name,location_name,location_population,location_area,location_capital_city,date,area,visitors,website,fees,climate,WiFi_access,cellular_access,average_temperature,picture'
   var line = ','
   for (let i = 0; i < parkovi.length; i++){
      //const id = parkovi[i].location;
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
      csv += parkovi[i]._id + line + parkovi[i].name + line + parkovi[i].location.name + line + 
      parkovi[i].location.population+ line + parkovi[i].location.area+ line + parkovi[i].location.capital_city
      + line + parkovi[i].date+ line + parkovi[i].area+ line + parkovi[i].visitors+ line + parkovi[i].website
      + line + parkovi[i].fees+ line + parkovi[i].climate+ line + parkovi[i].WiFi_access+ line + parkovi[i].cellular_access
      + line + parkovi[i].average_temperature+ line + parkovi[i].picture + '\r\n'
   }
   //console.log (csv)
   const data = JSON.stringify(parkovi)
   
   fs.writeFile('./data/parkovi.json', String (data),{ flag: 'w+' }, err => {
      if (err) {
        console.error(err)
        return
      }
      return;
      //file written successfully
   })
   fs.writeFile('./data/parkovi.csv', String (csv),{ flag: 'w+' }, err => {
      if (err) {
        console.error(err)
        return
      }
      return;
      //file written successfully
   })

  
   
});



// mangoos.connect(process.env.DB_CONNECTION, () => {
//    console.log ('conected');}
//    );

// const db = mangoos.connection;
// db.on('error', (error) => {console.log(error)});
// db.once('open', (error) => {console.log('Conected to db')});

app.listen(5000, ()=> {console.log('Server started')});