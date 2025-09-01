import { WebhookRequest, WebhookResponse, ApiError } from '@/types/chat'
import { WEBHOOK_CONFIG } from './constants'
import { isValidWebhookResponse, getErrorMessage } from './utils'
import { responsePoller } from './responsePoller'

class WebhookService {
  private sessionId: string
  
  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async sendMessage(message: string, userId?: string): Promise<WebhookResponse> {
    const requestData: WebhookRequest = {
      message: message.trim(),
      userId: userId || 'anonymous',
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    }

    let lastError: Error | null = null

    // Implementar reintentos para el envío inicial
    for (let attempt = 1; attempt <= WEBHOOK_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.TIMEOUT)

        // Enviar mensaje al webhook de n8n
        const response = await fetch(WEBHOOK_CONFIG.URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        console.log(`[WEBHOOK] Mensaje enviado exitosamente para session: ${this.sessionId}`)

        // Iniciar polling para la respuesta
        try {
          const webhookResponse = await responsePoller.pollForResponse(this.sessionId, {
            interval: 1000,      // Poll cada segundo
            maxAttempts: 30,     // Máximo 30 segundos
            timeout: 30000       // Timeout total de 30 segundos
          })

          return webhookResponse
        } catch (pollingError) {
          console.error(`[WEBHOOK] Error en polling para session ${this.sessionId}:`, pollingError)
          throw new Error(`Error esperando respuesta: ${getErrorMessage(pollingError)}`)
        }

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(getErrorMessage(error))
        
        console.error(`[WEBHOOK] Intento ${attempt}/${WEBHOOK_CONFIG.RETRY_ATTEMPTS} falló:`, lastError.message)
        
        // Si no es el último intento, esperar antes de reintentar
        if (attempt < WEBHOOK_CONFIG.RETRY_ATTEMPTS) {
          await new Promise(resolve => 
            setTimeout(resolve, WEBHOOK_CONFIG.RETRY_DELAY * attempt)
          )
        }
      }
    }

    // Si todos los intentos fallaron, lanzar error
    const apiError: ApiError = {
      message: lastError?.message || 'Error al conectar con el webhook',
      status: 500,
      code: 'WEBHOOK_ERROR'
    }

    throw apiError
  }

  // Método para verificar salud del webhook de n8n
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(WEBHOOK_CONFIG.URL, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 segundos para health check
      })
      return response.ok
    } catch {
      return false
    }
  }

  // Método para resetear sesión
  resetSession(): void {
    // Cancelar cualquier polling activo de la sesión anterior
    responsePoller.cancelPolling(this.sessionId)
    
    // Generar nueva sesión
    this.sessionId = this.generateSessionId()
    console.log(`[WEBHOOK] Sesión reseteada: ${this.sessionId}`)
  }

  // Getter para obtener sessionId actual
  getSessionId(): string {
    return this.sessionId
  }

  // Método para cancelar operaciones pendientes
  cancelPendingOperations(): void {
    responsePoller.cancelPolling(this.sessionId)
  }

  // Método para obtener estadísticas de polling
  getPollingStats() {
    return responsePoller.getActivePollingStats()
  }
}

// Exportar instancia singleton
export const webhookService = new WebhookService()

// También exportar la clase para testing
export { WebhookService } 