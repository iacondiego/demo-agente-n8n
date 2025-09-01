'use client'

import { useState, useCallback, useEffect } from 'react'
import { Message, ApiError, FileAttachment } from '@/types/chat'
import { generateMessageId, delay } from '@/lib/utils'
import { BOT_RESPONSES, TYPING_DELAY, WELCOME_MESSAGES } from '@/lib/constants'
import { webhookService } from '@/lib/webhook'
import Header from './Header'
import ChatArea from './ChatArea'
import MessageInput from './MessageInput'

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([])
  const [botStatus, setBotStatus] = useState<'available' | 'typing' | 'away'>('available')
  const [isWebhookHealthy, setIsWebhookHealthy] = useState(true)

  // Verificar salud del webhook al montar el componente
  useEffect(() => {
    const checkWebhookHealth = async () => {
      const isHealthy = await webhookService.healthCheck()
      setIsWebhookHealthy(isHealthy)
      if (!isHealthy) {
        setBotStatus('away')
      }
    }
    
    checkWebhookHealth()

    // Cleanup: cancelar operaciones pendientes al desmontar
    return () => {
      webhookService.cancelPendingOperations()
    }
  }, [])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
  }, [])

  const removeTypingMessage = useCallback(() => {
    setMessages(prev => prev.filter(msg => !msg.isTyping))
  }, [])

  const generateFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('departamento') || lowerMessage.includes('depto')) {
      return BOT_RESPONSES.departamentos[Math.floor(Math.random() * BOT_RESPONSES.departamentos.length)]
    }
    
    if (lowerMessage.includes('casa') || lowerMessage.includes('vivienda')) {
      return BOT_RESPONSES.casas[Math.floor(Math.random() * BOT_RESPONSES.casas.length)]
    }
    
    if (lowerMessage.includes('alquiler') || lowerMessage.includes('alquilar') || lowerMessage.includes('rent')) {
      return BOT_RESPONSES.alquiler[Math.floor(Math.random() * BOT_RESPONSES.alquiler.length)]
    }
    
    return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)]
  }

  const handleSendMessage = useCallback(async (content: string, files?: FileAttachment[]) => {
    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: generateMessageId(),
      content,
      sender: 'user',
      timestamp: new Date(),
      files: files
    }
    
    addMessage(userMessage)

    // Simular que el bot está escribiendo
    setBotStatus('typing')
    
    // Crear mensaje temporal de "escribiendo"
    const typingMessage: Message = {
      id: generateMessageId(),
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    }
    
    addMessage(typingMessage)

    try {
      // Mostrar mensaje de conexión aleatoriamente
      if (Math.random() > 0.7) {
        const connectingMsg = BOT_RESPONSES.connecting[Math.floor(Math.random() * BOT_RESPONSES.connecting.length)]
        const connectingMessage: Message = {
          id: generateMessageId(),
          content: connectingMsg,
          sender: 'bot',
          timestamp: new Date()
        }
        
        removeTypingMessage()
        addMessage(connectingMessage)
        
        // Breve pausa para mostrar mensaje de conexión
        await delay(1500)
        
        // Volver a mostrar typing
        addMessage(typingMessage)
      }

      // Intentar enviar al webhook de n8n y esperar respuesta via polling
      console.log(`[CHAT] Enviando mensaje a n8n para session: ${webhookService.getSessionId()}`)
      
      const webhookResponse = await webhookService.sendMessage(content, files)
      
      if (webhookResponse.success && webhookResponse.response) {
        const botMessage: Message = {
          id: generateMessageId(),
          content: webhookResponse.response,
          sender: 'bot',
          timestamp: new Date()
        }

        removeTypingMessage()
        addMessage(botMessage)
        
        // Marcar webhook como saludable si la respuesta fue exitosa
        if (!isWebhookHealthy) {
          setIsWebhookHealthy(true)
        }

        console.log(`[CHAT] Respuesta recibida de n8n exitosamente`)

      } else {
        throw new Error(webhookResponse.error || 'Respuesta inválida del webhook')
      }

    } catch (error) {
      console.error('[CHAT] Error con webhook:', error)
      
      // Marcar webhook como no saludable
      setIsWebhookHealthy(false)
      
      // Usar respuesta de fallback
      const fallbackResponse = generateFallbackResponse(content)
      const errorMessage: Message = {
        id: generateMessageId(),
        content: fallbackResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      removeTypingMessage()
      addMessage(errorMessage)

      // Opcionalmente, agregar mensaje de error discreto
      if (error instanceof Error && error.message.includes('WEBHOOK_ERROR')) {
        const errorNote: Message = {
          id: generateMessageId(),
          content: BOT_RESPONSES.error[Math.floor(Math.random() * BOT_RESPONSES.error.length)],
          sender: 'bot',
          timestamp: new Date()
        }
        
        await delay(1000)
        addMessage(errorNote)
      }
    } finally {
      setBotStatus('available')
    }
  }, [addMessage, removeTypingMessage, isWebhookHealthy])

  // Mensaje de bienvenida inicial
  useEffect(() => {
    const welcomeMessage: Message = {
      id: generateMessageId(),
      content: WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)],
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  return (
    <div className="h-screen flex flex-col bg-immobrand-cream">
      <Header botStatus={botStatus} isWebhookConnected={isWebhookHealthy} />
      <ChatArea messages={messages} />
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={botStatus === 'typing'}
        sessionId={webhookService.getSessionId()}
      />
      
      {/* Indicador discreto de estado del webhook */}
      {!isWebhookHealthy && (
        <div className="fixed bottom-20 right-6 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-lg text-xs shadow-lg">
          ⚠️ Modo sin conexión - Respuestas básicas activas
        </div>
      )}
    </div>
  )
} 