const mongoose = require('mongoose')

const DepartmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_at: {
    type: Date,
    required: true
  },
  updated_at: {
    type: Date,
    required: true
  }
})

DepartmentSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    ret.id = doc._id
  }
})

module.exports = mongoose.model('Department', DepartmentSchema, 'departments')
