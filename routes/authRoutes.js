const express = require('express')
const router = express.Router()
const {
  authUser,
  updateStatus,
  messageStatus,
} = require('../controllers/authController.js')
const { protect } = require('../middlewares/authMIddleware.js')

router.post('/authUser', authUser)
router.post('/updateStatus', updateStatus)
router.get('/messageStatus/:id', messageStatus)

module.exports = router
