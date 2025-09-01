import { NextRequest } from 'next/server'

// Rate limiting simple en memoria (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Configuración de rate limiting
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,    // 1 minuto
  maxRequests: 100,       // máximo 100 requests por minuto por IP
  cleanupInterval: 5 * 60 * 1000  // limpiar cada 5 minutos
}

// Limpiar entradas antiguas del rate limiter
setInterval(() => {
  const now = Date.now()
  Array.from(rateLimitStore.entries()).forEach(([ip, data]) => {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip)
    }
  })
}, RATE_LIMIT_CONFIG.cleanupInterval)

export function getClientIP(request: NextRequest): string {
  // Intentar obtener IP real detrás de proxies
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (real) {
    return real
  }
  
  // Fallback a IP de conexión directa
  return request.ip || 'unknown'
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_CONFIG.windowMs
  
  let bucket = rateLimitStore.get(ip)
  
  // Si no existe bucket o expiró, crear nuevo
  if (!bucket || now > bucket.resetTime) {
    bucket = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    }
    rateLimitStore.set(ip, bucket)
  }
  
  // Incrementar contador
  bucket.count++
  
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - bucket.count)
  const allowed = bucket.count <= RATE_LIMIT_CONFIG.maxRequests
  
  return {
    allowed,
    remaining,
    resetTime: bucket.resetTime
  }
}

export function validateContentType(request: NextRequest): boolean {
  const contentType = request.headers.get('content-type')
  return contentType?.includes('application/json') || false
}

export function validateUserAgent(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')
  
  // Bloquear bots maliciosos conocidos
  const blockedBots = [
    'scanner',
    'exploit',
    'hack',
    'attack',
    'malware'
  ]
  
  if (userAgent) {
    const lowerUA = userAgent.toLowerCase()
    return !blockedBots.some(bot => lowerUA.includes(bot))
  }
  
  return true
}

export function validateRequestSize(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    // Máximo 10KB por request
    return size <= 10 * 1024
  }
  
  return true
}

export function logRequest(request: NextRequest, ip: string, status: number) {
  const timestamp = new Date().toISOString()
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const contentLength = request.headers.get('content-length') || '0'
  
  console.log(`[WEBHOOK-API] ${timestamp} ${ip} ${request.method} ${request.url} ${status} ${contentLength}bytes "${userAgent}"`)
}

// Headers de seguridad recomendados
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none';",
}

// CORS headers para el endpoint
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // En producción, especificar dominio exacto
  'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Max-Age': '86400', // 24 horas
} 