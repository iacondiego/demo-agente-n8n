import { WebhookResponse } from '@/types/chat'

interface PollingConfig {
  interval: number      // Intervalo en ms entre polls
  maxAttempts: number   // Máximo número de intentos
  timeout: number       // Timeout total en ms
}

const DEFAULT_CONFIG: PollingConfig = {
  interval: 1000,      // 1 segundo
  maxAttempts: 30,     // 30 intentos = 30 segundos máximo
  timeout: 30000       // 30 segundos timeout total
}

class ResponsePoller {
  private activePolls = new Map<string, {
    controller: AbortController
    startTime: number
  }>()

  async pollForResponse(
    sessionId: string, 
    config: Partial<PollingConfig> = {}
  ): Promise<WebhookResponse> {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    const controller = new AbortController()
    const startTime = Date.now()
    
    // Registrar poll activo
    this.activePolls.set(sessionId, { controller, startTime })
    
    try {
      for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
        // Verificar si se agotó el timeout total
        if (Date.now() - startTime > finalConfig.timeout) {
          throw new Error('Timeout: No se recibió respuesta en el tiempo esperado')
        }

        // Verificar si fue cancelado
        if (controller.signal.aborted) {
          throw new Error('Polling cancelado')
        }

        try {
          const response = await fetch(
            `/api/webhook/response?sessionId=${encodeURIComponent(sessionId)}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              signal: controller.signal
            }
          )

          if (!response.ok) {
            console.warn(`[POLLER] Intento ${attempt}: HTTP ${response.status}`)
            
            // Si es un error del servidor, seguir intentando
            if (response.status >= 500) {
              await this.delay(finalConfig.interval)
              continue
            }
            
            // Si es error de cliente, fallar inmediatamente
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          
          // Si no hay respuesta todavía, continuar polling
          if (!data.hasResponse) {
            await this.delay(finalConfig.interval)
            continue
          }

          // Respuesta encontrada, construir objeto WebhookResponse
          const webhookResponse: WebhookResponse = {
            response: data.response,
            success: data.success,
            error: data.error,
            data: data.data
          }

          console.log(`[POLLER] Respuesta recibida para session ${sessionId} en intento ${attempt}`)
          
          return webhookResponse

        } catch (error) {
          // Si es el último intento, lanzar error
          if (attempt === finalConfig.maxAttempts) {
            throw error
          }
          
          // Si no es el último intento, loguear y continuar
          console.warn(`[POLLER] Intento ${attempt} falló:`, error)
          await this.delay(finalConfig.interval)
        }
      }

      // Si llegamos aquí, se agotaron los intentos
      throw new Error(`No se recibió respuesta después de ${finalConfig.maxAttempts} intentos`)

    } finally {
      // Limpiar poll activo
      this.activePolls.delete(sessionId)
    }
  }

  // Cancelar polling para una sesión específica
  cancelPolling(sessionId: string): boolean {
    const activePoll = this.activePolls.get(sessionId)
    if (activePoll) {
      activePoll.controller.abort()
      this.activePolls.delete(sessionId)
      console.log(`[POLLER] Polling cancelado para session ${sessionId}`)
      return true
    }
    return false
  }

  // Cancelar todos los pollings activos
  cancelAllPolling(): void {
    Array.from(this.activePolls.entries()).forEach(([sessionId, poll]) => {
      poll.controller.abort()
    })
    this.activePolls.clear()
    console.log('[POLLER] Todos los pollings cancelados')
  }

  // Obtener estadísticas de pollings activos
  getActivePollingStats() {
    const now = Date.now()
    const stats = Array.from(this.activePolls.entries()).map(([sessionId, poll]) => ({
      sessionId,
      elapsedTime: now - poll.startTime,
      isActive: !poll.controller.signal.aborted
    }))

    return {
      activeCount: this.activePolls.size,
      sessions: stats
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Instancia singleton
export const responsePoller = new ResponsePoller()

// También exportar la clase para testing
export { ResponsePoller } 