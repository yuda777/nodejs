const mongoose = require('mongoose')
const Double = require('@mongoosejs/double');
const Schema = mongoose.Schema

var SchemaTypes = mongoose.Schema.Types;
const AgeSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  age: {
    type: SchemaTypes.Double,
    required: true,
  },
})


const Age = mongoose.model('ages', AgeSchema)
module.exports = Age