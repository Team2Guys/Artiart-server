const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  posterImageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  imageUrl: [{
    public_id: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  }],
  discountPrice: {
    type: Number,
  },

  colors: [{
    colorName: {
      type: String,
    }
  }],
  modelDetails: [{
    name: {
      type: String,
      required: true
    },
    detail: {
      type: String,
      required: true
    }
  }],
  spacification: [{
    specsDetails: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const Productdb = mongoose.model('Product', productSchema);

module.exports = Productdb;
