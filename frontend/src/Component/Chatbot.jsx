import React, { useEffect, useState } from 'react'
import { IoChatbubbleEllipses, IoClose } from 'react-icons/io5'
import { CHATBOT_RESPONSES, CHAT_STORAGE_KEY } from '../constants/chatbotResponses'

const DEFAULT_MESSAGES = [
  { from: 'bot', text: CHATBOT_RESPONSES.welcome },
]

function loadChatHistory() {
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.length > 0 ? parsed : DEFAULT_MESSAGES
    }
  } catch {
    // ignore
  }
  return DEFAULT_MESSAGES
}

function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(loadChatHistory)

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  }, [messages])

  const handleOption = (id, label) => {
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: label },
      { from: 'bot', text: CHATBOT_RESPONSES.answers[id] },
    ])
  }

  const clearChat = () => {
    setMessages(DEFAULT_MESSAGES)
    localStorage.removeItem(CHAT_STORAGE_KEY)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-pink text-white rounded-full shadow-card flex items-center justify-center hover:bg-brand-pink-dark transition-all duration-300 hover:scale-105"
        aria-label="Open support chat"
      >
        {open ? <IoClose className="w-7 h-7" /> : <IoChatbubbleEllipses className="w-7 h-7" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden animate-slide-up flex flex-col max-h-[480px]">
          <div className="bg-brand-pink text-white px-4 py-3 font-semibold flex justify-between items-center">
            <span>TripBnb Support</span>
            <button type="button" onClick={clearChat} className="text-xs text-white/80 hover:text-white">
              Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                    msg.from === 'user'
                      ? 'bg-brand-pink text-white rounded-br-md'
                      : 'bg-brand-light text-brand-dark rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-brand-border flex flex-wrap gap-2">
            {CHATBOT_RESPONSES.options.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className="text-xs px-3 py-1.5 rounded-full border border-brand-border hover:border-brand-pink hover:text-brand-pink transition-colors"
                onClick={() => handleOption(id, label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
