'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types/chat'
import MessageBubble from './MessageBubble'
import { scrollToBottom } from '@/lib/utils'

interface ChatAreaProps {
  messages: Message[]
}

export default function ChatArea({ messages }: ChatAreaProps) {
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="glass-effect p-3 rounded-lg message-glow hover:glow-blue transition-all duration-300">
                  <span className="text-immobrand-accent font-medium">💼 Departamentos</span>
                  <p className="text-gray-300 mt-1">En venta y alquiler</p>
                </div>
                <div className="glass-effect p-3 rounded-lg message-glow hover:glow-blue transition-all duration-300">
                  <span className="text-immobrand-accent font-medium">🏡 Casas</span>
                  <p className="text-gray-300 mt-1">Todas las zonas</p>
                </div>
                <div className="glass-effect p-3 rounded-lg message-glow hover:glow-blue transition-all duration-300">
                  <span className="text-immobrand-accent font-medium">📍 Ubicaciones</span>
                  <p className="text-gray-300 mt-1">Busca por zona</p>
                </div>
                <div className="glass-effect p-3 rounded-lg message-glow hover:glow-blue transition-all duration-300">
                  <span className="text-immobrand-accent font-medium">📅 Visitas</span>
                  <p className="text-gray-300 mt-1">Agenda fácilmente</p>
                </div>
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