const mongoose = require('mongoose');

const ParksSchema = new mongoose.Schema ({

   name: {
      type: String,
      required: true
   },
   location: {
      type: mongoose.Schema.Types.ObjectId, ref: "Location"
    },
   date_established_as_park: Date,
   area : String ,
   recreation_visitors: String,
   website: String,
   fees: String,
   climate: String,
   WiFi_access: String,
   cellular_access: String,
   average_temperature : String,
   picture : String
});

module.exports = mongoose.model('Links', ParksSchema);