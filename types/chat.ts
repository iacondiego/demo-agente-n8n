export interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isTyping?: boolean
  files?: FileAttachment[]
}

export interface FileAttachment {
  id: string
  name: string
  type: 'image' | 'audio'
  size: number
  url: string
  mimeType: string
}

export interface ChatState {
  messages: Message[]
  isTyping: boolean
  inputValue: string
}

export interface BotStatus {
  status: 'available' | 'typing' | 'away'
  lastSeen?: Date
}

export interface PropertyCard {
  id: string
  title: string
  price: string
  location: string
  type: 'house' | 'apartment' | 'office' | 'land'
  imageUrl?: string
  features: string[]
}

// Tipos para webhook de n8n
export interface WebhookRequest {
  message: string
  userId?: string
  sessionId?: string
  timestamp: string
  files?: FileAttachment[]
}

export interface WebhookResponse {
  response: string
  success: boolean
  error?: string
  data?: {
    properties?: PropertyCard[]
    suggestions?: string[]
    actions?: string[]
  }
}

export interface ApiError {
  message: string
  status: number
  code?: string
} 