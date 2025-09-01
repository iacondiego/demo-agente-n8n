# 📁 API de Archivos - Integración con n8n

## 📋 Descripción

El chatbot ahora soporta envío de **imágenes** y **audios**. Los archivos se almacenan temporalmente y están disponibles para descarga via HTTP GET desde n8n.

## 🔗 Endpoints Disponibles

### 1. Upload de Archivos
**URL**: `POST /api/files/upload`

**Uso**: Usado internamente por la interfaz para subir archivos.

### 2. Descarga de Archivos 
**URL**: `GET /uploads/{filename}`

**Uso**: Para que n8n descargue los archivos enviados por los usuarios.

## 📤 Formato de Datos Enviados a n8n

Cuando un usuario envía archivos, el webhook recibe:

```json
{
  "message": "Aquí tienes mi foto de la casa",
  "userId": "anonymous",
  "sessionId": "session_1703725200000_abc123def",
  "timestamp": "2023-12-27T19:00:00.000Z",
  "files": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "casa_frente.jpg",
      "type": "image",
      "size": 2048576,
      "url": "/uploads/550e8400-e29b-41d4-a716-446655440000.jpg",
      "mimeType": "image/jpeg"
    }
  ]
}
```

## 🔧 Configuración en n8n

### Paso 1: Detectar si hay archivos

En tu flujo de n8n, después del webhook, agrega un nodo **IF** para verificar archivos:

**Condición**: `{{ $json.files && $json.files.length > 0 }}`

### Paso 2: Procesar archivos (Ruta TRUE)

Para cada archivo, usar nodo **HTTP Request**:

**Configuración**:
- **Method**: `GET`
- **URL**: `https://tu-app.vercel.app{{ $json.files[0].url }}`
- **Response Format**: `File`

**Ejemplo con múltiples archivos**:
```javascript
// En un nodo Code, iterar archivos:
const files = $input.first().json.files || [];
const downloadedFiles = [];

for (const file of files) {
  // Usar HTTP Request para descargar cada archivo
  const fileUrl = `https://tu-app.vercel.app${file.url}`;
  // El archivo descargado estará disponible para procesar
}
```

### Paso 3: Procesar según tipo

**Para Imágenes**:
- Análisis de imagen con IA
- Extracción de texto (OCR)
- Identificación de propiedades

**Para Audios**:
- Transcripción de voz a texto
- Análisis de sentimientos
- Procesamiento de consultas verbales

## 📝 Ejemplos de Uso

### Ejemplo 1: Usuario envía foto de una casa

**Flujo en n8n**:
1. Webhook recibe mensaje con archivo imagen
2. HTTP Request descarga la imagen
3. Nodo de IA analiza la imagen
4. Respuesta: "Veo una hermosa casa de 2 plantas con jardín. ¿Te interesa algo similar?"

### Ejemplo 2: Usuario envía audio con consulta

**Flujo en n8n**:
1. Webhook recibe archivo de audio
2. HTTP Request descarga el audio
3. Nodo de transcripción convierte a texto
4. Procesamiento normal del texto
5. Respuesta basada en la consulta verbal

## 🔄 Ejemplo Completo de Flujo n8n

```
Webhook → IF (hay archivos?) 
├── TRUE → HTTP Request (descargar) → Procesar archivo → Respuesta
└── FALSE → Procesamiento normal de texto → Respuesta
```

## 🛡️ Configuraciones de Seguridad

### Tipos de Archivo Permitidos
- **Imágenes**: JPG, PNG, GIF, WebP
- **Audios**: MP3, WAV, OGG, M4A, MP4

### Límites
- **Tamaño máximo**: 10MB por archivo
- **Múltiples archivos**: Sí (sin límite de cantidad)
- **Almacenamiento**: Temporal (se recomienda procesamiento inmediato)

## 🔗 URLs de Ejemplo

**Base URL**: `https://tu-app.vercel.app`

**Descarga de archivo**:
```
GET https://tu-app.vercel.app/uploads/550e8400-e29b-41d4-a716-446655440000.jpg
```

**Verificar API de archivos**:
```
GET https://tu-app.vercel.app/api/files/upload
```

## 📋 Checklist para n8n

- [ ] Webhook configurado para recibir datos con archivos
- [ ] Nodo IF para detectar presencia de archivos
- [ ] HTTP Request configurado para descargar archivos
- [ ] Procesamiento específico para imágenes
- [ ] Procesamiento específico para audios
- [ ] HTTP Request de respuesta configurado correctamente

## 🚨 Consideraciones Importantes

1. **Procesamiento inmediato**: Los archivos se almacenan temporalmente
2. **URL completa**: Usar siempre la URL completa de Vercel para descargas
3. **Manejo de errores**: Verificar que el archivo existe antes de procesar
4. **Múltiples archivos**: El array `files` puede contener varios elementos

---

**¡Listo!** Con esta configuración, n8n puede recibir y procesar tanto texto como archivos multimedia del chatbot inmobiliario. 