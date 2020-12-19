const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ItemSchema = new Schema({
    item_name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    input_date: {
        type: Date,
        default: Date.now,
        required: true,
    }
  })

  ItemSchema.path('price').get(function(num) {
    return (num / 100).toFixed(2);
  });
  
  // Setter
  ItemSchema.path('price').set(function(num) {
    return num * 100;
  });

const Item = mongoose.model('item', ItemSchema)
module.exports = Item