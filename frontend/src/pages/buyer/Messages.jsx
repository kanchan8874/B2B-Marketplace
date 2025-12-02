import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Send, ArrowLeft } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import FormField from '../../components/common/FormField.jsx'
import { getConversations, getConversationMessages, replyToConversation } from '../../services/messageService.js'
import useFormValidation from '../../hooks/useFormValidation.js'
import { required, minLength, characterLimit } from '../../utils/validators.js'

const replyInitialValues = { body: '' }
const replyValidationSchema = {
  body: [required('Message'), minLength('Message', 10), characterLimit('Message', 10, 2000)],
}

const Messages = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const { values, errors, handleChange, handleBlur, validateForm, resetForm } = useFormValidation(
    replyInitialValues,
    replyValidationSchema,
    { validateOnChange: false },
  )

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const response = await getConversations()
      if (response.data) {
        setConversations(response.data)
        if (response.data.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId) => {
    try {
      const response = await getConversationMessages(conversationId)
      if (response.data) {
        setMessages(response.data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const handleReply = async (event) => {
    event.preventDefault()
    if (!validateForm() || !selectedConversation) return

    try {
      setSubmitting(true)
      await replyToConversation(selectedConversation._id, values.body)
      resetForm()
      await loadMessages(selectedConversation._id)
      await loadConversations() // Refresh to update unread counts
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert(error.message || 'Failed to send reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Messages</h1>
          <p className="text-sm text-neutral-600 mt-1">Communicate with sellers about products</p>
        </div>
        <Button onClick={() => navigate('/buyer/products')} variant="secondary" className="rounded-full">
          Browse Products
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        {/* Conversations List */}
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-sm text-neutral-600">No conversations yet</p>
              <Button
                onClick={() => navigate('/buyer/products')}
                size="sm"
                className="mt-4 rounded-full"
                variant="secondary"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const isSelected = selectedConversation?._id === conv._id
                const unreadCount = conv.buyerUnreadCount || 0
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-neutral-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {conv.seller?.name || conv.seller?.companyName || 'Seller'}
                        </p>
                        {conv.product && (
                          <p className="text-xs text-neutral-600 truncate mt-1">{conv.product.name}</p>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 rounded-full bg-blue-600 text-white text-xs font-semibold px-2 py-1 min-w-[24px] text-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Messages View */}
        {selectedConversation ? (
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 flex flex-col h-[600px]">
            <div className="border-b border-neutral-200 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                {selectedConversation.seller?.name || selectedConversation.seller?.companyName || 'Seller'}
              </h2>
              {selectedConversation.product && (
                <p className="text-sm text-neutral-600 mt-1">{selectedConversation.product.name}</p>
              )}
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-neutral-600">No messages yet</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSent = msg.sender?._id === selectedConversation.buyer?._id
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-4 ${
                          isSent
                            ? 'bg-blue-600 text-white'
                            : 'bg-neutral-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {isSent ? 'You' : msg.sender?.name || 'Seller'}
                        </p>
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReply} className="border-t border-neutral-200 pt-4">
              <FormField
                id="body"
                name="body"
                label="Reply"
                required
                as="textarea"
                rows={3}
                value={values.body}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.body}
                placeholder="Type your message..."
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  size="md"
                  className="rounded-full flex items-center gap-2"
                  disabled={submitting}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50/70 via-white/95 to-teal-50/70 flex items-center justify-center h-[600px]">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-sm text-neutral-600">Select a conversation to view messages</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Messages

