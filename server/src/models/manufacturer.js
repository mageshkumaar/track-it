const mongoose = require('mongoose')

const ManufacturerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  support: {
    website: {
      type: String
    },
    email: {
      type: String
    },
    phone: {
      type: String
    }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  }
})

ManufacturerSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    ret.id = doc._id
  }
})

module.exports = mongoose.model('Manufacturer', ManufacturerSchema, 'manufacturers')
