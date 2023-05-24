const cors = require('cors')
const express = require('express')
const dotenv = require('dotenv')
const logger = require('morgan')
const { connectDB } = require('./config/db.js')
const authRoutes = require('./routes/authRoutes.js')
const Message = require('./models/MessageModel.js')
const User = require('./models/Users2Model.js')

dotenv.config()

connectDB()
const app = express()
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(logger('dev'))

app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('API is running....')
})

const httpsServer = app.listen(
  process.env.PORT,
  console.log('Server running on port 5000')
)

const io = require('./utills/socket').init(httpsServer)

app.post('/messages', async (req, res) => {
  const { message, to, from } = req.body
  const mobile = to
  const UserExists = await User.findOne({ mobile })

  if (UserExists) {
    const messagge = await Message.create({
      message,
      mobile,
      from,
      userid: UserExists._id,
    })
    await messagge.save()
    const messagess = await Message.find({ userid: UserExists._id }).sort({
      timestamp: 1,
    })

    io.emit('message', messagess)
    return res.status(201).json({
      success: true,
      message: 'Message Sent Successfully',
      msgdata: messagge,
    })
  } else {
    return res.status(400).json({ success: false, message: 'User not Found' })
  }
})

io.on('connection', (socket) => {
  console.log('client joined')
  // console.log(socket)
  socket.on('joinRoom', async (userId) => {
    socket.join(userId)

    console.log('Room Joined. ROOM ID: ', userId)

    // await Message.updateMany(
    //   { userid: userId, seen: false },
    //   { $set: { seen: true } }
    // )
    const messages = await Message.find({ userid: userId }).sort({
      timestamp: 1,
    })

    socket.emit('message', messages)
  })
  // socket.on('message', async (message) => {
  //   console.log('joineeed')
  //   // Save the chat message to the database
  //   await Message.updateMany(
  //     { userid: message.userId, seen: false },
  //     { $set: { seen: true } }
  //   )
  //   const messages = await Message.find({ userid: message.userId })

  //   io.in(messages.userId).emit('message', message.messages)
  // })
  socket.on('disconnect', () => {
    console.log('User Disconnected')
  })
})

// console.log
//Listen for Chat Message

// When User Disconnects
