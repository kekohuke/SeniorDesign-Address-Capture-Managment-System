// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('mongoose-double')(mongoose);

var SchemaTypes = mongoose.Schema.Types;
// this will be our data base's data structure 
const DataSchema = new Schema({
  id: Number,
  picture: {
    type: String,
    require: true,
    get: v => `${root}${v}`
  },
  city:{
    type: String,
    require: true
  },
  state:{
    type: String,
    require: true
  },
  name:{
    type: String
  },
  address: {
    type: String,
    require: true
  },
  accuracy: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  lat:{
    type: SchemaTypes.Double,
  },
  lng:{
    type: SchemaTypes.Double,
  }
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("new_Data", DataSchema);