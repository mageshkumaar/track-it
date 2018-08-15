const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
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
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      // Delete the sensitive/invalid/unnecessary values from the document
      delete ret._id
      delete ret.password
      delete ret.__v

      // Rename the _id to id
      ret.id = doc.id
    }
  }
})

module.exports = mongoose.model('user', userSchema, 'users')
