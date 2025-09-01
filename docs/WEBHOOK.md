# 🔗 Integración Webhook n8n

## 📋 Descripción General

El chatbot inmobiliario está integrado con n8n a través de un webhook que permite procesar mensajes de manera inteligente y proporcionar respuestas personalizadas basadas en tu flujo de automatización.

## 🌐 Configuración de Webhooks

### 1. Webhook de n8n (Recepción de mensajes)
**URL**: `https://devwebhook.iacondiego.es/webhook/0175afe2-b56d-405c-a483-713e48b52976`

**Método**: `POST`
**Content-Type**: `application/json`

#### Payload Enviado:
```json
{
  "message": "Busco departamento 2 dormitorios",
  "userId": "anonymous",
  "sessionId": "session_1703725200000_abc123def", 
  "timestamp": "2023-12-27T19:00:00.000Z"
}
```

### 2. Endpoint API (Recepción de respuestas)
**URL**: `https://tu-dominio.com/api/webhook/response`

**Métodos soportados**:
- `POST`: Recibir respuesta de n8n
- `GET`: Polling para obtener respuesta
- `HEAD`: Health check
- `OPTIONS`: Estadísticas (desarrollo)

## 📤 Configuración en n8n

### Nodo HTTP Request para Responder

En tu flujo de n8n, después de procesar el mensaje, agregar un nodo **HTTP Request** con:

**Configuración del Nodo**:
- **Method**: `POST`
- **URL**: `https://tu-dominio.com/api/webhook/response`
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  ```

**Body** (JSON):
```json
{
  "sessionId": "{{ $('Webhook').item.json.sessionId }}",
  "userId": "{{ $('Webhook').item.json.userId }}",
  "response": "Tu respuesta procesada aquí",
  "success": true,
  "timestamp": "{{ $now }}",
  "data": {
    "properties": [
      {
        "id": "prop_001",
        "title": "Departamento en Palermo",
        "price": "$180,000 USD",
        "location": "Palermo, CABA",
        "type": "apartment",
        "features": ["2 dormitorios", "1 baño", "balcón"]
      }
    ],
    "suggestions": [
      "Ver más fotos",
      "Agendar visita",
      "Solicitar información"
    ]
  }
}
```

### Ejemplo de Flujo n8n

```
Webhook → [Tu lógica de procesamiento] → HTTP Request
```

## 📥 Formato de Respuesta Requerido

### Respuesta Exitosa
```json
{
  "sessionId": "session_1703725200000_abc123def",
  "userId": "user_123", 
  "response": "Encontré 3 departamentos que cumplen tus requisitos...",
  "success": true,
  "timestamp": "2023-12-27T19:01:00.000Z",
  "data": {
    "properties": [
      {
        "id": "string",
        "title": "string", 
        "price": "string",
        "location": "string",
        "type": "apartment|house|office|land",
        "imageUrl": "string",
        "features": ["array", "de", "strings"]
      }
    ],
    "suggestions": ["Ver detalles", "Agendar visita"],
    "actions": ["contact", "schedule", "more_info"]
  }
}
```

### Respuesta con Error
```json
{
  "sessionId": "session_1703725200000_abc123def",
  "response": "Lo siento, no pude procesar tu consulta en este momento.",
  "success": false,
  "error": "Database timeout",
  "timestamp": "2023-12-27T19:01:00.000Z"
}
```

## 🔧 Endpoints de la API

### POST /api/webhook/response

Recibe respuestas de n8n.

**Headers requeridos**:
- `Content-Type: application/json`

**Body**: Ver formato de respuesta arriba

**Respuesta**:
```json
{
  "success": true,
  "message": "Respuesta recibida correctamente",
  "sessionId": "session_1703725200000_abc123def",
  "receivedAt": "2023-12-27T19:01:00.000Z"
}
```

### GET /api/webhook/response

Obtiene respuesta para una sesión específica (usado internamente por el chatbot).

**Query params**:
- `sessionId`: ID de la sesión

**Respuesta**:
```json
{
  "hasResponse": true,
  "sessionId": "session_1703725200000_abc123def",
  "response": "...",
  "success": true,
  "data": {...}
}
```

## 🛡️ Seguridad y Rate Limiting

### Rate Limiting
- **Límite**: 100 requests por minuto por IP
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite total
  - `X-RateLimit-Remaining`: Requests restantes
  - `X-RateLimit-Reset`: Timestamp de reset

### Validaciones de Seguridad
- ✅ Content-Type validation
- ✅ Request size limit (10KB máximo)
- ✅ User-Agent filtering
- ✅ Rate limiting por IP
- ✅ Headers de seguridad (XSS, CSRF, etc.)

### Headers de Seguridad Aplicados
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'none'; frame-ancestors 'none';
```

## ⚙️ Configuración del Sistema

### Polling Configuration
```typescript
const POLLING_CONFIG = {
  interval: 1000,      // Poll cada 1 segundo
  maxAttempts: 30,     // Máximo 30 intentos (30 segundos)
  timeout: 30000       // Timeout total de 30 segundos
}
```

### Webhook Configuration
```typescript
const WEBHOOK_CONFIG = {
  URL: "https://devwebhook.iacondiego.es/webhook/0175afe2-b56d-405c-a483-713e48b52976",
  TIMEOUT: 30000,      // 30 segundos
  RETRY_ATTEMPTS: 3,   // 3 intentos
  RETRY_DELAY: 1000    // 1 segundo entre intentos
}
```

## 🧪 Testing del Sistema

### 1. Probar Webhook de n8n
```bash
curl -X POST \
  https://devwebhook.iacondiego.es/webhook/0175afe2-b56d-405c-a483-713e48b52976 \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message",
    "userId": "test_user",
    "sessionId": "test_session_123",
    "timestamp": "2023-12-27T19:00:00.000Z"
  }'
```

### 2. Simular Respuesta de n8n
```bash
curl -X POST \
  https://tu-dominio.com/api/webhook/response \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test_session_123",
    "response": "Esta es una respuesta de prueba",
    "success": true,
    "timestamp": "2023-12-27T19:01:00.000Z"
  }'
```

### 3. Obtener Respuesta (Polling)
```bash
curl -X GET \
  "https://tu-dominio.com/api/webhook/response?sessionId=test_session_123"
```

## 📊 Monitoring y Logs

### Logs del Sistema
Todos los requests se loguean con el formato:
```
[WEBHOOK-API] 2023-12-27T19:00:00.000Z 192.168.1.1 POST /api/webhook/response 200 1024bytes "n8n-webhook/1.0"
```

### Estadísticas del Endpoint
```bash
curl -X OPTIONS https://tu-dominio.com/api/webhook/response
```

Respuesta:
```json
{
  "pendingResponses": 5,
  "uptime": 3600,
  "timestamp": "2023-12-27T19:00:00.000Z"
}
```

## 🔄 Manejo de Errores

### Errores Comunes

| Error | Código | Descripción | Solución |
|-------|--------|-------------|----------|
| `sessionId es requerido` | 400 | Falta sessionId en request | Incluir sessionId válido |
| `response es requerido` | 400 | Falta response en request | Incluir campo response |
| `Content-Type debe ser application/json` | 400 | Header incorrecto | Usar Content-Type correcto |
| `Demasiadas requests` | 429 | Rate limit excedido | Esperar y reintentar |
| `Request demasiado grande` | 413 | Payload > 10KB | Reducir tamaño del request |

### Reintentos y Fallbacks

El sistema implementa múltiples niveles de fallback:
1. **Reintentos de envío**: 3 intentos al webhook de n8n
2. **Polling con timeout**: 30 segundos máximo de espera
3. **Respuestas fallback**: Respuestas básicas si falla todo
4. **Indicadores visuales**: Estado de conexión en tiempo real

## 🚀 Deployment

### Variables de Entorno
```env
# No hay variables específicas requeridas
# El endpoint usa configuración interna
```

### Health Checks
```bash
# Check endpoint API
curl -I https://tu-dominio.com/api/webhook/response

# Check webhook n8n  
curl -I https://devwebhook.iacondiego.es/webhook/0175afe2-b56d-405c-a483-713e48b52976
```

## 🔮 Funcionalidades Avanzadas

### Limpieza Automática
- Respuestas pendientes se eliminan automáticamente después de 5 minutos
- Rate limiting entries se limpian cada 5 minutos
- Polling se cancela automáticamente al desmontar componentes

### Session Management
- Cada conversación tiene un sessionId único
- Sessions se pueden resetear manualmente
- Polling activo se cancela al resetear

### Performance
- Store en memoria para desarrollo
- En producción, recomendado usar Redis para:
  - Rate limiting distribuido
  - Almacenamiento de respuestas pendientes
  - Estadísticas y métricas

---

## 📞 Soporte y Troubleshooting

### Problemas Comunes

1. **No se reciben respuestas**:
   - Verificar que n8n esté enviando al endpoint correcto
   - Revisar logs del servidor
   - Comprobar que sessionId coincida

2. **Rate limiting**:
   - Ajustar configuración en `middleware.ts`
   - Implementar sistema distribuido con Redis

3. **Timeouts**:
   - Ajustar configuración de polling
   - Optimizar procesamiento en n8n

### Debug Mode
Para activar logs detallados, verificar la consola del navegador para:
- `[WEBHOOK]`: Logs del servicio webhook
- `[POLLER]`: Logs del sistema de polling  
- `[WEBHOOK-API]`: Logs del endpoint API
- `[CHAT]`: Logs del componente de chat 