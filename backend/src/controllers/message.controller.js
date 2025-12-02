import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Message } from '../models/Message.js'
import { Conversation } from '../models/Conversation.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { success } from '../utils/ApiResponse.js'
import { catchAsync } from '../utils/catchAsync.js'
import { ApiError } from '../utils/ApiError.js'
import { sendMessageNotificationEmail, shouldSendEmailForUser } from '../services/emailService.js'

export const messageValidation = {
  send: Joi.object({
    body: Joi.object({
      receiverId: Joi.string().required(),
      productId: Joi.string().optional(),
      subject: Joi.string().required().min(3).max(200),
      body: Joi.string().required().min(10).max(2000),
    }).required(),
  }),
  markRead: Joi.object({
    params: Joi.object({
      messageId: Joi.string().required(),
    }).required(),
  }),
}

/**
 * Send a message from buyer to seller
 */
export const sendMessage = catchAsync(async (req, res) => {
  const { receiverId, productId, subject, body } = req.body
  const senderId = req.user.id

  // Validate receiver exists and is a seller
  const receiver = await User.findById(receiverId)
  if (!receiver || receiver.role !== 'seller') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid seller ID')
  }

  // Validate sender is a buyer
  if (req.user.role !== 'buyer') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only buyers can send messages to sellers')
  }

  // Validate product if provided
  let product = null
  if (productId) {
    product = await Product.findById(productId)
    if (!product) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    }
    // Ensure product belongs to the seller
    if (product.seller.toString() !== receiverId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product does not belong to this seller')
    }
  }

  // Find or create conversation
  let conversation = await Conversation.findOne({
    buyer: senderId,
    seller: receiverId,
    product: productId || null,
  })

  if (!conversation) {
    conversation = await Conversation.create({
      buyer: senderId,
      seller: receiverId,
      product: productId || null,
      lastMessageAt: new Date(),
      sellerUnreadCount: 1,
    })
  } else {
    conversation.lastMessageAt = new Date()
    conversation.sellerUnreadCount += 1
    await conversation.save()
  }

  // Create message
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    product: productId || null,
    subject,
    body,
    conversationId: conversation._id,
    isRead: false,
  })

  // Populate message with sender and receiver details
  await message.populate('sender receiver product', 'name email role')

  // Email notification to seller (if enabled)
  try {
    if (shouldSendEmailForUser(receiver, 'message')) {
      await sendMessageNotificationEmail({
        to: receiver.email,
        recipientName: receiver.name || receiver.companyName,
        fromName: req.user.name || 'Buyer',
        subject,
        snippet: body.slice(0, 200),
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send message notification to seller', error)
    }
  }

  return res.status(StatusCodes.CREATED).json(success(message, 'Message sent successfully'))
})

/**
 * Get conversations for current user
 */
export const getConversations = catchAsync(async (req, res) => {
  const userId = req.user.id
  const userRole = req.user.role

  let conversations

  if (userRole === 'buyer') {
    conversations = await Conversation.find({ buyer: userId })
      .populate('seller', 'name email companyName')
      .populate('product', 'name images priceMin priceMax')
      .sort({ lastMessageAt: -1 })
  } else if (userRole === 'seller') {
    conversations = await Conversation.find({ seller: userId })
      .populate('buyer', 'name email companyName')
      .populate('product', 'name images priceMin priceMax')
      .sort({ lastMessageAt: -1 })
  } else {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only buyers and sellers can access conversations')
  }

  return res.status(StatusCodes.OK).json(success(conversations))
})

/**
 * Get messages for a specific conversation
 */
export const getConversationMessages = catchAsync(async (req, res) => {
  const { conversationId } = req.params
  const userId = req.user.id

  // Verify user is part of the conversation
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
  }

  if (conversation.buyer.toString() !== userId && conversation.seller.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to view this conversation')
  }

  // Get messages
  const messages = await Message.find({ conversationId })
    .populate('sender receiver', 'name email role companyName')
    .populate('product', 'name images')
    .sort({ createdAt: 1 })

  // Mark messages as read for current user
  await Message.updateMany(
    {
      conversationId,
      receiver: userId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    },
  )

  // Update unread count
  if (req.user.role === 'buyer') {
    conversation.buyerUnreadCount = 0
  } else {
    conversation.sellerUnreadCount = 0
  }
  await conversation.save()

  return res.status(StatusCodes.OK).json(success(messages))
})

/**
 * Reply to a conversation
 */
export const replyToConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params
  const { body: messageBody } = req.body
  const senderId = req.user.id

  // Validate conversation exists and user is part of it
  const conversation = await Conversation.findById(conversationId)
  if (!conversation) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
  }

  const isBuyer = conversation.buyer.toString() === senderId
  const isSeller = conversation.seller.toString() === senderId

  if (!isBuyer && !isSeller) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to reply to this conversation')
  }

  // Determine receiver
  const receiverId = isBuyer ? conversation.seller : conversation.buyer

  // Create reply message (reuse subject from first message or create new)
  const firstMessage = await Message.findOne({ conversationId }).sort({ createdAt: 1 })
  const subject = firstMessage ? `Re: ${firstMessage.subject}` : 'Re: Inquiry'

  // Create message
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    product: conversation.product || null,
    subject,
    body: messageBody,
    conversationId: conversation._id,
    isRead: false,
  })

  // Update conversation
  conversation.lastMessageAt = new Date()
  if (isBuyer) {
    conversation.sellerUnreadCount += 1
  } else {
    conversation.buyerUnreadCount += 1
  }
  await conversation.save()

  // Populate message
  await message.populate('sender receiver product', 'name email role companyName')

  // Email notification to receiver
  try {
    const receiverUser = await User.findById(receiverId).select(
      'name email companyName role notificationPreferences',
    )
    if (receiverUser?.email && shouldSendEmailForUser(receiverUser, 'message')) {
      await sendMessageNotificationEmail({
        to: receiverUser.email,
        recipientName: receiverUser.name || receiverUser.companyName,
        fromName: req.user.name || (req.user.role === 'buyer' ? 'Buyer' : 'Seller'),
        subject,
        snippet: messageBody.slice(0, 200),
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[email] Failed to send message reply notification', error)
    }
  }

  return res.status(StatusCodes.CREATED).json(success(message, 'Reply sent successfully'))
})

/**
 * Mark message as read
 */
export const markMessageAsRead = catchAsync(async (req, res) => {
  const { messageId } = req.params
  const userId = req.user.id

  const message = await Message.findById(messageId)
  if (!message) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Message not found')
  }

  if (message.receiver.toString() !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You can only mark your own messages as read')
  }

  message.isRead = true
  await message.save()

  // Update conversation unread count
  const conversation = await Conversation.findById(message.conversationId)
  if (conversation) {
    if (req.user.role === 'buyer') {
      conversation.buyerUnreadCount = Math.max(0, conversation.buyerUnreadCount - 1)
    } else {
      conversation.sellerUnreadCount = Math.max(0, conversation.sellerUnreadCount - 1)
    }
    await conversation.save()
  }

  return res.status(StatusCodes.OK).json(success(message, 'Message marked as read'))
})

/**
 * Admin: Get all conversations (for oversight)
 */
export const getAllConversations = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can access all conversations')
  }

  const conversations = await Conversation.find()
    .populate('buyer seller', 'name email companyName role')
    .populate('product', 'name images')
    .sort({ lastMessageAt: -1 })

  return res.status(StatusCodes.OK).json(success(conversations))
})

/**
 * Admin: Get messages for a conversation (for oversight)
 */
export const getConversationMessagesAdmin = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only admins can access conversation messages')
  }

  const { conversationId } = req.params

  const messages = await Message.find({ conversationId })
    .populate('sender receiver', 'name email role companyName')
    .populate('product', 'name images')
    .sort({ createdAt: 1 })

  return res.status(StatusCodes.OK).json(success(messages))
})

