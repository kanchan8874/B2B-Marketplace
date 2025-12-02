import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, Eye } from 'lucide-react'
import Card from '../../components/common/Card.jsx'
import Button from '../../components/common/Button.jsx'
import { getAllConversations, getConversationMessagesAdmin } from '../../services/messageService.js'

const MessageOversight = () => {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

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
      const response = await getAllConversations()
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
      const response = await getConversationMessagesAdmin(conversationId)
      if (response.data) {
        setMessages(response.data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-sm text-neutral-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Message Oversight</h1>
          <p className="text-sm text-neutral-600 mt-1">Monitor buyer-seller communications for compliance</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        {/* Conversations List */}
        <Card className="border-purple-100 bg-gradient-to-br from-purple-50/70 via-white/95 to-purple-50/70">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">All Conversations</h2>
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-sm text-neutral-600">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const isSelected = selectedConversation?._id === conv._id
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-neutral-200 bg-white hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-neutral-900 text-sm">
                          {conv.buyer?.name || 'Buyer'} ↔ {conv.seller?.name || 'Seller'}
                        </p>
                      </div>
                      {conv.product && (
                        <p className="text-xs text-neutral-600 truncate">{conv.product.name}</p>
                      )}
                      <p className="text-xs text-neutral-500">
                        {new Date(conv.lastMessageAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        {/* Messages View */}
        {selectedConversation ? (
          <Card className="border-purple-100 bg-gradient-to-br from-purple-50/70 via-white/95 to-purple-50/70 flex flex-col h-[600px]">
            <div className="border-b border-neutral-200 pb-4 mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                {selectedConversation.buyer?.name || 'Buyer'} ↔ {selectedConversation.seller?.name || 'Seller'}
              </h2>
              {selectedConversation.product && (
                <p className="text-sm text-neutral-600 mt-1">{selectedConversation.product.name}</p>
              )}
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-neutral-600">No messages found</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isFromBuyer = msg.sender?.role === 'buyer'
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isFromBuyer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl p-4 ${
                          isFromBuyer
                            ? 'bg-blue-100 text-neutral-900'
                            : 'bg-emerald-100 text-neutral-900'
                        }`}
                      >
                        <p className="text-sm font-semibold mb-1">
                          {msg.sender?.name || (isFromBuyer ? 'Buyer' : 'Seller')} ({msg.sender?.role})
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
          </Card>
        ) : (
          <Card className="border-purple-100 bg-gradient-to-br from-purple-50/70 via-white/95 to-purple-50/70 flex items-center justify-center h-[600px]">
            <div className="text-center">
              <Eye className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-sm text-neutral-600">Select a conversation to view messages</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

export default MessageOversight

