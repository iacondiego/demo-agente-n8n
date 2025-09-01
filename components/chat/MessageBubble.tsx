'use client'

import { Message } from '@/types/chat'
import { UserIcon, BotIcon } from '../icons/PropertyIcons'
import { formatTime } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.sender === 'bot'
  const isUser = message.sender === 'user'

  return (
    <div className={`flex items-start space-x-3 animate-slide-up ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isBot ? 'bg-immobrand-gold' : 'bg-immobrand-navy'
      }`}>
        {isBot ? (
          <BotIcon className="text-immobrand-navy" size={16} />
        ) : (
          <UserIcon className="text-white" size={16} />
        )}
      </div>

      {/* Contenido del mensaje */}
      <div className={`flex flex-col max-w-xs lg:max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Burbuja de mensaje */}
        <div className={`px-4 py-3 rounded-lg ${
          isBot 
            ? 'bg-white border border-gray-200 text-immobrand-navy' 
            : 'bg-immobrand-navy text-white'
        } ${
          isBot ? 'rounded-tl-none' : 'rounded-tr-none'
        }`}>
          {message.isTyping ? (
            <div className="flex items-center space-x-1">
              <span className="text-sm">Escribiendo</span>
              <div className="typing-dots text-sm"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>

        {/* Timestamp */}
        {!message.isTyping && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  )
} 