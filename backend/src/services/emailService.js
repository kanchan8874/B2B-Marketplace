import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

let transporter

const createTransporter = () => {
  if (transporter) return transporter

  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    // In development, we silently skip email sending if config is missing
    // This avoids crashing the app while still allowing local testing.
    return null
  }

  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASSWORD,
    },
  })

  return transporter
}

export const sendEmail = async ({ to, subject, html, text }) => {
  const tx = createTransporter()
  if (!tx) {
    if (env.NODE_ENV === 'development') {
      console.log('[emailService] Email config missing, skipping send:', { to, subject })
    }
    return
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to,
    subject,
    text: text || '',
    html: html || text || '',
  }

  await tx.sendMail(mailOptions)
}

export const sendKYCStatusEmail = async ({ to, name, role, status, reason }) => {
  const title = status === 'Approved' ? 'KYC verification approved' : 'KYC verification rejected'
  const roleLabel = role === 'seller' ? 'seller' : 'buyer'

  const textLines = [
    `Hi ${name || 'there'},`,
    '',
    `Your ${roleLabel} verification has been ${status.toLowerCase()}.`,
  ]

  if (status === 'Rejected' && reason) {
    textLines.push('', 'Reason:', reason)
  }

  textLines.push('', 'Regards,', 'B2B Marketplace Team')

  await sendEmail({
    to,
    subject: `[KYC] ${title}`,
    text: textLines.join('\n'),
  })
}

export const sendMessageNotificationEmail = async ({ to, recipientName, fromName, subject, snippet }) => {
  const textLines = [
    `Hi ${recipientName || 'there'},`,
    '',
    `You have a new message from ${fromName || 'a user'}:`,
    '',
    `Subject: ${subject}`,
    '',
    snippet || '',
    '',
    'Log in to your account to reply.',
    '',
    'Regards,',
    'B2B Marketplace Team',
  ]

  await sendEmail({
    to,
    subject: `[Message] New message from ${fromName || 'a user'}`,
    text: textLines.join('\n'),
  })
}

export const sendProductModerationEmail = async ({ to, sellerName, productName, status }) => {
  const title = status === 'Live' ? 'Product approved' : 'Product status updated'

  const textLines = [
    `Hi ${sellerName || 'there'},`,
    '',
    `Your product "${productName}" has been ${status === 'Live' ? 'approved and is now live' : `updated to status: ${status}`}.`,
    '',
    'Log in to your seller workspace for full details.',
    '',
    'Regards,',
    'B2B Marketplace Team',
  ]

  await sendEmail({
    to,
    subject: `[Products] ${title}`,
    text: textLines.join('\n'),
  })
}

export const shouldSendEmailForUser = (user, type) => {
  const prefs = user?.notificationPreferences || {}
  if (type === 'message') return prefs.emailOnNewMessage !== false
  if (type === 'kyc') return prefs.emailOnKycStatus !== false
  if (type === 'product') return prefs.emailOnProductModeration !== false
  return true
}


