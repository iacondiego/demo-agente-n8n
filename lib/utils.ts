import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export function scrollToBottom(element: HTMLElement | null) {
  if (element) {
    element.scrollTop = element.scrollHeight
  }
}

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Utility para validar respuesta del webhook
export function isValidWebhookResponse(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.response === 'string' &&
    typeof data.success === 'boolean'
  )
}

// Utility para manejar errores de red
export function getErrorMessage(error: any): string {
  if (error?.message) return error.message
  if (typeof error === 'string') return error
  return 'Error desconocido'
} 