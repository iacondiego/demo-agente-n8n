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
            <div>
              {message.content && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap mb-2">
                  {message.content}
                </p>
              )}
              
              {/* Mostrar archivos adjuntos */}
              {message.files && message.files.length > 0 && (
                <div className="space-y-2">
                  {message.files.map((file) => (
                    <div key={file.id} className="border rounded-lg overflow-hidden">
                      {file.type === 'image' ? (
                        <div>
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="max-w-full h-auto max-h-48 object-cover"
                          />
                          <div className="p-2 bg-gray-50 text-xs text-gray-600">
                            📷 {file.name}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🎵</span>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{file.name}</div>
                              <audio controls className="mt-1 w-full max-w-64">
                                <source src={file.url} type={file.mimeType} />
                                Tu navegador no soporta audio.
                              </audio>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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