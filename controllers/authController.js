const { generateJWTtoken } = require('../utills/generateJWTtoken.js')
const User = require('../models/Users2Model.js')
const Message = require('../models/MessageModel.js')

exports.authUser = async (req, res) => {
  const { mobile, imei, info } = req.body

  const UserExists = await User.findOne({ mobile })

  if (UserExists) {
    UserExists.imei = imei
    UserExists.info = info
    const updateduser = await UserExists.save()

    return res.status(201).json({
      success: true,
      _id: updateduser._id,
      mobile: updateduser.mobile,
      imei: updateduser.imei,
      info: updateduser.info,

      token: generateJWTtoken(updateduser._id),
    })
  }
  const user = await User.create({
    mobile,
    imei,
    info,
  })
  await user.save()
  if (user) {
    res.status(201).json({
      success: true,
      _id: user._id,
      mobile: user.mobile,
      imei: user.imei,
      info: user.info,

      token: generateJWTtoken(user._id),
    })
  } else {
    return res.status(400).json({ message: 'Invalid User Data' })
  }
}
exports.updateStatus = async (req, res) => {
  const { userId } = req.body
  await Message.updateMany(
    { userid: userId, seen: false },
    { $set: { seen: true } }
  )

  return res.status(201).json({
    success: true,
  })
}
exports.messageStatus = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)

    await res.status(201).json({
      message,
      messagestatus: message.seen,
    })
  } catch (err) {
    res.status(500).json({
      message: err.toString(),
    })
  }
}
