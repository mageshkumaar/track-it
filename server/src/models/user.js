const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
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

UserSchema.set('toJSON', {
  transform: (doc, ret, options) => {
    delete ret.__v
    delete ret._id
    delete ret.password
    ret.id = doc._id
  }
})

module.exports = mongoose.model('User', UserSchema, 'users')
