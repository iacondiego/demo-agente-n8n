'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types/chat'
import MessageBubble from './MessageBubble'
import { scrollToBottom } from '@/lib/utils'

interface ChatAreaProps {
  messages: Message[]
  onQuestionClick?: (question: string) => void
}

export default function ChatArea({ messages, onQuestionClick }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom(chatContainerRef.current)
  }, [messages])

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto chat-scroll bg-immobrand-darker px-6 py-6"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(30, 64, 175, 0.05) 0%, transparent 70%)'
      }}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-immobrand-blue rounded-full flex items-center justify-center mx-auto mb-4 glow-blue-strong gradient-animated">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-immobrand-cream mb-2">
                ¡Bienvenido/a a tu Asesor Virtual!
              </h3>
              <p className="text-gray-300 mb-6">
                Estoy aquí para ayudarte a encontrar la propiedad perfecta.
                Puedes preguntarme sobre casas, departamentos, precios, ubicaciones y más.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  'Busco un piso de 3 ambientes tengo presupuesto de 200.000 dolares',
                  'Busco local para alquiler en Ciudad de México de 45 m2',
                  'Busco un piso que acepte mascotas, tenga parking'
                ].map((question, i) => (
                  <button
                    key={i}
                    onClick={() => onQuestionClick?.(question)}
                    className="glass-effect p-3 rounded-lg message-glow hover:glow-blue transition-all duration-300 text-left group"
                  >
                    <span className="text-immobrand-accent font-medium group-hover:text-immobrand-lightblue transition-colors">" {question} "</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
} 