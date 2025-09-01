import { NextRequest, NextResponse } from 'next/server'
import { 
  getClientIP, 
  checkRateLimit, 
  validateContentType, 
  validateUserAgent, 
  validateRequestSize,
  logRequest,
  SECURITY_HEADERS,
  CORS_HEADERS
} from './middleware'

// Tipos para el endpoint
interface IncomingWebhookResponse {
  sessionId: string
  userId?: string
  response: string
  success: boolean
  error?: string
  data?: {
    properties?: Array<{
      id: string
      title: string
      price: string
      location: string
      type: 'house' | 'apartment' | 'office' | 'land'
      imageUrl?: string
      features: string[]
    }>
    suggestions?: string[]
    actions?: string[]
  }
  timestamp: string
}

// Store temporal para respuestas pendientes (en producción usar Redis/DB)
const pendingResponses = new Map<string, IncomingWebhookResponse>()

// Limpiar respuestas antiguas cada 5 minutos
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
  Array.from(pendingResponses.entries()).forEach(([sessionId, response]) => {
    const responseTime = new Date(response.timestamp).getTime()
    if (responseTime < fiveMinutesAgo) {
      pendingResponses.delete(sessionId)
    }
  })
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  const ip = getClientIP(request)
  
  try {
    // Validaciones de seguridad
    if (!validateContentType(request)) {
      logRequest(request, ip, 400)
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 400, headers: { ...SECURITY_HEADERS, ...CORS_HEADERS } }
      )
    }

    if (!validateUserAgent(request)) {
      logRequest(request, ip, 403)
      return NextResponse.json(
        { error: 'User-Agent no permitido' },
        { status: 403, headers: { ...SECURITY_HEADERS, ...CORS_HEADERS } }
      )
    }

    if (!validateRequestSize(request)) {
      logRequest(request, ip, 413)
      return NextResponse.json(
        { error: 'Request demasiado grande' },
        { status: 413, headers: { ...SECURITY_HEADERS, ...CORS_HEADERS } }
      )
    }

    // Rate limiting
    const rateLimitResult = checkRateLimit(ip)
    if (!rateLimitResult.allowed) {
      logRequest(request, ip, 429)
      return NextResponse.json(
        { 
          error: 'Demasiadas requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429, 
          headers: { 
            ...SECURITY_HEADERS, 
            ...CORS_HEADERS,
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }
    // Parsear el body del request
    const body: IncomingWebhookResponse = await request.json()
    
    // Validaciones básicas
    if (!body.sessionId || typeof body.sessionId !== 'string') {
      return NextResponse.json(
        { error: 'sessionId es requerido' },
        { status: 400 }
      )
    }

    if (!body.response || typeof body.response !== 'string') {
      return NextResponse.json(
        { error: 'response es requerido' },
        { status: 400 }
      )
    }

    if (typeof body.success !== 'boolean') {
      return NextResponse.json(
        { error: 'success debe ser boolean' },
        { status: 400 }
      )
    }

    // Agregar timestamp si no viene
    if (!body.timestamp) {
      body.timestamp = new Date().toISOString()
    }

    // Validar formato de timestamp
    const timestampDate = new Date(body.timestamp)
    if (isNaN(timestampDate.getTime())) {
      return NextResponse.json(
        { error: 'timestamp inválido' },
        { status: 400 }
      )
    }

    // Validar que la respuesta no sea muy antigua (más de 5 minutos)
    const responseTime = timestampDate.getTime()
    const now = Date.now()
    if (now - responseTime > 5 * 60 * 1000) {
      return NextResponse.json(
        { error: 'Respuesta demasiado antigua' },
        { status: 400 }
      )
    }

    // Validar estructura de data si existe
    if (body.data) {
      if (body.data.properties && !Array.isArray(body.data.properties)) {
        return NextResponse.json(
          { error: 'data.properties debe ser array' },
          { status: 400 }
        )
      }
      
      if (body.data.suggestions && !Array.isArray(body.data.suggestions)) {
        return NextResponse.json(
          { error: 'data.suggestions debe ser array' },
          { status: 400 }
        )
      }
      
      if (body.data.actions && !Array.isArray(body.data.actions)) {
        return NextResponse.json(
          { error: 'data.actions debe ser array' },
          { status: 400 }
        )
      }
    }

    // Guardar la respuesta en el store temporal
    pendingResponses.set(body.sessionId, body)

    // Log para debugging
    console.log(`[WEBHOOK-RESPONSE] Recibida respuesta para session: ${body.sessionId}`, {
      userId: body.userId,
      success: body.success,
      responseLength: body.response.length,
      hasData: !!body.data,
      timestamp: body.timestamp
    })

    // Log exitoso
    logRequest(request, ip, 200)

    // Responder con éxito
    return NextResponse.json({
      success: true,
      message: 'Respuesta recibida correctamente',
      sessionId: body.sessionId,
      receivedAt: new Date().toISOString()
    }, {
      headers: { ...SECURITY_HEADERS, ...CORS_HEADERS }
    })

  } catch (error) {
    console.error('[WEBHOOK-RESPONSE] Error procesando respuesta:', error)
    logRequest(request, ip, 500)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500, headers: { ...SECURITY_HEADERS, ...CORS_HEADERS } }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId es requerido en query params' },
        { status: 400 }
      )
    }

    // Buscar respuesta para esta sesión
    const response = pendingResponses.get(sessionId)
    
    if (!response) {
      return NextResponse.json(
        { 
          hasResponse: false,
          message: 'No hay respuesta disponible para esta sesión' 
        },
        { status: 200 }
      )
    }

    // Eliminar respuesta del store después de entregarla
    pendingResponses.delete(sessionId)

    // Log para debugging
    console.log(`[WEBHOOK-RESPONSE] Entregada respuesta para session: ${sessionId}`)

    return NextResponse.json({
      hasResponse: true,
      ...response
    })

  } catch (error) {
    console.error('[WEBHOOK-RESPONSE] Error obteniendo respuesta:', error)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// Endpoint para verificar estado del servicio
export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

// Endpoint para obtener estadísticas (desarrollo/debug)
export async function OPTIONS() {
  const stats = {
    pendingResponses: pendingResponses.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  }
  
  return NextResponse.json(stats)
} 