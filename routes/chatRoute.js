const express = require('express');
const  chatController = require('../Controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../Config/cloudinaryConfig');
const router = express.Router();

// protected route

router.post('/send-message', authMiddleware,chatController.sendMessage)
router.get('/conversations', authMiddleware,chatController.getConversation)
router.get('/conversations/:conversationId/messages', authMiddleware, chatController.getMessages)



router.put('/messages/read',authMiddleware,multerMiddleware,chatController.markAsRead)
router.get('/messages/:messageId',authMiddleware,chatController.deleteMessage)


module.exports = router;