const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Users2Schema = mongoose.Schema(
  {
    mobile: {
      type: String,
    },
    imei: {
      type: String,
    },
    info: {
      type: String,
    },

    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

Users2Schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

Users2Schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = Users2 = mongoose.model('Users2', Users2Schema)
