const mongoose = require('mongoose');

const ParksSchema = new mongoose.Schema ({

   name: {
      type: String,
      required: true
   },
   
   capital_city: String,
   total_area : String ,
   population: String
});

module.exports = mongoose.model('Links', ParksSchema);