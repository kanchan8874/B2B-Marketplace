import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import {
  sendMessage,
  getConversations,
  getConversationMessages,
  replyToConversation,
  markMessageAsRead,
  getAllConversations,
  getConversationMessagesAdmin,
  messageValidation,
} from '../controllers/message.controller.js'

const router = express.Router()

/**
 * @openapi
 * /messages/send:
 *   post:
 *     tags: [Messages]
 *     summary: Send a message from buyer to seller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiverId, subject, body]
 *             properties:
 *               receiverId:
 *                 type: string
 *               productId:
 *                 type: string
 *               subject:
 *                 type: string
 *               body:
 *                 type: string
 */
router.post('/send', authenticate, validateRequest(messageValidation.send), sendMessage)

/**
 * @openapi
 * /messages/conversations:
 *   get:
 *     tags: [Messages]
 *     summary: Get all conversations for current user
 *     security:
 *       - bearerAuth: []
 */
router.get('/conversations', authenticate, getConversations)

/**
 * @openapi
 * /messages/conversations/:conversationId:
 *   get:
 *     tags: [Messages]
 *     summary: Get messages for a specific conversation
 *     security:
 *       - bearerAuth: []
 */
router.get('/conversations/:conversationId', authenticate, getConversationMessages)

/**
 * @openapi
 * /messages/conversations/:conversationId/reply:
 *   post:
 *     tags: [Messages]
 *     summary: Reply to a conversation
 *     security:
 *       - bearerAuth: []
 */
router.post('/conversations/:conversationId/reply', authenticate, replyToConversation)

/**
 * @openapi
 * /messages/:messageId/read:
 *   patch:
 *     tags: [Messages]
 *     summary: Mark a message as read
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:messageId/read', authenticate, validateRequest(messageValidation.markRead), markMessageAsRead)

/**
 * Admin routes
 */
router.get('/admin/conversations', authenticate, getAllConversations)
router.get('/admin/conversations/:conversationId', authenticate, getConversationMessagesAdmin)

export default router

