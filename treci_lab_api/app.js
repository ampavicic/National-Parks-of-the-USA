const express = require("express");
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const mangoos = require('mongoose');
const fs = require("fs");
const { ObjectId } = require('mongodb');

app.use(express.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"

const swaggerOptions = {
   //swaggerDefinition : JSON.parse(fs.readFileSync("openapi.json")),
   swaggerDefinition: {
      info: {
       version: "3.0.0",
       title: "National Parks of USA",
       description: "A list of some of the national parks in USA",
       contact: {
         name: "Ana Marija Pavičić"
       },
       servers: ["http://localhost:5000"]
     }
   },
   // ['.routes/*.js']
   apis: ["app.js"]
 };

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-data", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /parks:
 *  get:
 *    description: Use to request all national parks in the database
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *        description: Something went wrong
 */
 app.get("/parks", (req, res) => {
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      
      const cursor = dbo.collection("parkovi").find ({})
      const parkovi = await cursor.toArray();
      
       for (let i = 0; i < parkovi.length; i++){
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
       console.log (JSON.stringify(parkovi))
       try {
         //data = 
         const Response = {
           "status": "OK",
           "message": "All parks fetched",
           "response": {
              "parks": JSON.stringify(parkovi),
              "links": {
                    "href": "parks/1",
                    "rel": "1",
                    "type": "GET"
              }
           }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(Response);
        //res.send (JSON.stringify(parkovi))
       }
       catch {
         res.sendStatus(404);
         res.json({
            "status": "Not Found",
            "message": "Sometihing went wrong",
            "reponse": null
           })
       }
    });
 } 
 );

// Routes
/**
 * @swagger
 * /parks/{id}:
 *  get:
 *    description: Use to request specific national park with id in the database
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not found
 */
 app.get("/parks/:id", (req, res) => {
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      
      const cursor = dbo.collection("parkovi").find ({})
      const id = { name: "South Dakota" };
      const parkovi = await cursor.toArray();
      var parks = []
      for (let i = 0; i < parkovi.length; i++){
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
          if (parkovi[i]._id == req.params.id) {
             parks.push (parkovi[i])
          }
       }
       if (parks.length > 0) {
         data = JSON.stringify(parks)
         const Response = {
           "status": "OK",
           "message": "Fetched park with given id",
           "response": {
              "parks": data,
              "links": {
                    "href": "location/1",
                    "rel": "1",
                    "type": "GET"
              }
           }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(Response);
      }
      else {
         res.setHeader("Content-Type", "application/json");
         res.status(404);
         res.json({
            "status": "Not Found",
            "message": "Park doesn't exist",
            "reponse": null

         });

      }
    });
 } 
 );

 // Routes
/**
 * @swagger
 * /parks/{location}:
 *  get:
 *    description: Use to request national park in the database with given location
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not found
 */
 app.get("/parks/location/:locatoin", (req, res) => {
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      
      const cursor = dbo.collection("parkovi").find ({})
      const id = { name: "South Dakota" };
      const parkovi = await cursor.toArray();
      var parks = []
      for (let i = 0; i < parkovi.length; i++){
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
          if (parkovi[i].location.name == req.params.locatoin) {
             parks.push (parkovi[i])
          }
       }
       if (parks.length > 0) {
         data = JSON.stringify(parks)
         const Response = {
           "status": "OK",
           "message": "Fetched parks with given location",
           "response": {
              "parks": data,
              "links": {
                    "href": "location/name",
                    "rel": "name",
                    "type": "GET"
              }
           }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(Response);
      }
      else {
         res.setHeader("Content-Type", "application/json");
         res.status(404);
         res.json({
            "status": "Not Found",
            "message": "Park doesn't exist",
            "reponse": null
         });
      }
    });
 } 
 );

// Routes
/**
 * @swagger
 * /parks/{location}:
 *  get:
 *    description: Use to request national park in the database with given name
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not found
 */
 app.get("/parks/name/:name", (req, res) => {
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      
      const cursor = dbo.collection("parkovi").find ({})
      const id = { name: "South Dakota" };
      const parkovi = await cursor.toArray();
      var parks = []
      for (let i = 0; i < parkovi.length; i++){
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
   
          if (parkovi[i].name.includes (req.params.name)) {
             parks.push (parkovi[i])
          }
       }
       if (parks.length > 0) {
         data = JSON.stringify(parks)
         const Response = {
           "status": "OK",
           "message": "Fetched parks with given location",
           "response": {
              "parks": data,
              "links": {
                    "href": "location/name",
                    "rel": "name",
                    "type": "GET"
              }
           }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(Response);
      }
      else {
         res.setHeader("Content-Type", "application/json");
         res.status(404);
         res.json({
            "status": "Not Found",
            "message": "Park doesn't exist",
            "reponse": null
         });
      }
    });
 } 
 );

// Routes
/**
 * @swagger
 * /parks/{location}:
 *  get:
 *    description: Use to request national park in the database with given climate
 *    responses:
 *      '200':
 *        description: A successful response
 *      '404':
 *        description: Not found
 */
 app.get("/parks/climate/:climate", (req, res) => {
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      console.log("Database connected!");
      var dbo = db.db("parkovi");
      
      const cursor = dbo.collection("parkovi").find ({})
      const id = { name: "South Dakota" };
      const parkovi = await cursor.toArray();
      var parks = []
      for (let i = 0; i < parkovi.length; i++){
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
          if (parkovi[i].climate == req.params.climate) {
             parks.push (parkovi[i])
          }
       }
       if (parks.length > 0) {
         data = JSON.stringify(parks)
         const Response = {
           "status": "OK",
           "message": "Fetched parks with given location",
           "response": {
              "parks": data,
              "links": {
                    "href": "climate/2",
                    "rel": "2",
                    "type": "GET"
              }
           }
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200);
        res.json(Response);
      }
      else {
         res.setHeader("Content-Type", "application/json");
         res.status(404);
         res.json({
            "status": "Not Found",
            "message": "Park doesn't exist",
            "reponse": null
         });
      }
    });
 } 
 );

 // Routes
/**
 * @swagger
 * /parks:
 *  post:
 *    description: Use to add a new park to database
 *    parameters
 *      -in : body
 *       name: park
 *    responses:
 *      '200':
 *        description: A successful response
 *      '400':
 *        description: Could not add to database, check input
 */
 app.post("/parks", (req, res) => {
    console.log (req.body)
   MongoClient.connect(url, async function(err, db) {
      if (err) throw err;
      var dbo = db.db("parkovi");
      console.log("Database connected!");
      const park = req.body
      console.log (req.body.location );
      const query = { name: req.body.location };
      const lok = dbo.collection("location")
      const cursor = await lok.find (query).toArray();
      console.log (cursor)
      
      park.location = cursor[0]._id

      try {
      dbo.collection('parkovi').insertOne(park, function(err, res) {
         if (err ) {
            throw err
         };
         console.log("1 document inserted");
         db.close();
       });
       const Response = {
            "status": "OK",
            "message": "Added new national park",
            "response": {
               "parks": park,
               "links": {
                     "href": "parks/1",
                     "rel": "1",
                     "type": "POST"
               }
            }
         }
         
         res.status(200);
         res.json(Response);
      } catch {
         res.setHeader("Content-Type", "application/json");
         res.status(400);
         res.json({
            "status": "Bad request",
            "message": "Check input",
            "reponse": null
           })
      }
    });
 } 
 );

 
app.put("/parks/:name", (req, res) => {
   console.log (req.body)
  MongoClient.connect(url, async function(err, db) {
     if (err) throw err;


     var dbo = db.db("parkovi");
      
     const cursor = dbo.collection("parkovi").find({})
     const idd = ObjectId(req.params.id);
     console.log (idd)
     const id = { name: req.params.name };
     const parkovi = await cursor.toArray();
   let i;
     for (i = 0; i < parkovi.length; i++){
        if (parkovi[i].name == req.params.name) {
           break;
        }
     } 
     const staripark = parkovi [i]

     const c = await  dbo.collection("parkovi").find(id).toArray();
     console.log (c[0])

     
     const novipark = req.body
     
     const query = { name: req.body.location };
     const lok = dbo.collection("location")
     const curso = await lok.find (query).toArray();
     
     novipark.location = curso[0]._id

     if (parkovi == 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(404);
      res.json({
         "status": "Not Found",
         "message": "National Park with given id does not exist",
         "reponse": null
        })
     }

     try {
     dbo.collection('parkovi').updateOne(id, novipark, function(err, res) {
        if (err ) {
           throw err
           console.log (err)
        };
        console.log("1 document updated");
        db.close();
      });
      const Response = {
           "status": "OK",
           "message": "Updated park with given id",
           "response": {
              "parks": novipark,
              "links": {
                    "href": "parks/1",
                    "rel": "1",
                    "type": "PUT"
              }
           }
        }
        
        res.status(200);
        res.json(Response);
     } catch {
        res.setHeader("Content-Type", "application/json");
        res.status(400);
        res.json({
           "status": "Bad request",
           "message": "Check input",
           "reponse": null
          })
     }
   });
} 
);

app.delete("/parks/:id", (req, res) => {
   console.log (req.body)
  MongoClient.connect(url, async function(err, db) {
     if (err) throw err;


     var dbo = db.db("parkovi");
      
     const cursor = dbo.collection("parkovi").find({})
     const idd = ObjectId(req.params.id);
     console.log (idd)
     const id = { _id: idd };
     const parkovi = await cursor.toArray();
   let i;
     for (i = 0; i < parkovi.length; i++){
        if (parkovi[i].id == req.params.id) {
           break;
        }
     } 
     const staripark = parkovi [i]

     const c = await  dbo.collection("parkovi").find(id).toArray();
     console.log (c[0])


     if (parkovi == 0) {
      res.setHeader("Content-Type", "application/json");
      res.status(404);
      res.json({
         "status": "Not Found",
         "message": "National Park with given id does not exist",
         "reponse": null
        })
     }

     try {
     dbo.collection('parkovi').deleteOne(id,function(err, res) {
        if (err ) {
           throw err
           console.log (err)
        };
        console.log("1 document deleted");
        db.close();
      });
      const Response = {
           "status": "OK",
           "message": "Updated park with given id",
           "response": {
              "parks": novipark,
              "links": {
                    "href": "parks/1",
                    "rel": "1",
                    "type": "PUT"
              }
           }
        }
        
        res.status(200);
        res.json(Response);
     } catch {
        res.setHeader("Content-Type", "application/json");
        res.status(400);
        res.json({
           "status": "Bad request",
           "message": "Check input",
           "reponse": null
          })
     }
   });
} 
);


 


app.listen(5000, ()=> {console.log('Server started')});