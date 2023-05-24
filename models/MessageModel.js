const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    from: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    seen: { type: Boolean, default: false },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'Users2' },
  },
  {
    timestamps: true,
  }
)
module.exports = Message = mongoose.model('Message', MessageSchema)
