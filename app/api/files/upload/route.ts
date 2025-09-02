import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// Declarar el tipo global para TypeScript
declare global {
  var tempFiles: Map<string, {
    buffer: Buffer
    mimeType: string
    name: string
    uploadedAt: Date
  }> | undefined
}

// Configuración de archivos permitidos
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp4']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  let formData: FormData | null = null
  
  try {
    formData = await request.formData()
    const file: File | null = formData.get('file') as unknown as File
    const sessionId = formData.get('sessionId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró archivo' },
        { status: 400 }
      )
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId es requerido' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const fileType = file.type
    const isImage = ALLOWED_TYPES.image.includes(fileType)
    const isAudio = ALLOWED_TYPES.audio.includes(fileType)

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo imágenes y audios.' },
        { status: 400 }
      )
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 10MB.' },
        { status: 400 }
      )
    }

    // En producción (Vercel), usar almacenamiento temporal
    const fileId = randomUUID()
    const extension = file.name.split('.').pop() || ''
    const fileName = `${fileId}.${extension}`
    
    // Convertir archivo a buffer y base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    
    // Para Vercel, incluir los datos directamente en la respuesta
    // en lugar de almacenar en memoria que se pierde
    const fileData = {
      buffer,
      mimeType: fileType,
      name: file.name,
      uploadedAt: new Date(),
      base64: base64Data
    }
    
    // Almacenar temporalmente para la URL (puede fallar)
    globalThis.tempFiles = globalThis.tempFiles || new Map()
    globalThis.tempFiles.set(fileId, fileData)
    
    // Limpiar archivos antiguos (más de 1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    Array.from(globalThis.tempFiles.entries()).forEach(([id, data]) => {
      if (data.uploadedAt < oneHourAgo) {
        globalThis.tempFiles?.delete(id)
      }
    })

    // Construir URL del archivo (puede no funcionar en Vercel)
    const fileUrl = `/api/files/${fileId}`
    
    // Determinar tipo
    const type = isImage ? 'image' : 'audio'

    const fileInfo = {
      id: fileId,
      name: file.name,
      type,
      size: file.size,
      url: fileUrl,
      mimeType: fileType,
      sessionId,
      // Incluir base64 para n8n como fallback
      base64: `data:${fileType};base64,${base64Data}`
    }

    console.log(`[FILE-UPLOAD] Archivo subido: ${file.name} (${type}) para session: ${sessionId}`)

    return NextResponse.json({
      success: true,
      file: fileInfo,
      message: 'Archivo subido correctamente'
    })

  } catch (error) {
    console.error('[FILE-UPLOAD] Error completo:', {
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      sessionId: formData?.get('sessionId'),
      fileName: (formData?.get('file') as File)?.name
    })
    
    return NextResponse.json(
      { 
        error: 'Error procesando archivo',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'OK',
    maxFileSize: MAX_FILE_SIZE,
    allowedTypes: ALLOWED_TYPES
  })
} 