const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
    required: Date
  }
})

CategorySchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    ret.id = doc._id
  }
})

module.exports = mongoose.model('Category', CategorySchema, 'categories')
