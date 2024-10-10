const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  posterImageUrl: {
    public_id: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    altText: {
      type: String,
    }


  },
  hoverImageUrl: {
    public_id: {
      type: String,
    },
    imageUrl: {
      type: String,
    },  
     altText: {
      type: String,
    }
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
    },
    colorCode: {
      type: String,
      required: true
    },
    altText: {
      type: String,
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
  totalStockQuantity: {
    type: Number,
  },
  variantStockQuantities: [{
    variant: {
      type: String,
    },
    quantity: {
      type: Number,
    }
  }]
});


const Productdb = mongoose.model('Product', productSchema);

module.exports = Productdb;





