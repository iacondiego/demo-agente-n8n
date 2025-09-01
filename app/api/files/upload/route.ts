import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

// Configuración de archivos permitidos
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/mp4']
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
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

    // Generar nombre único
    const fileId = randomUUID()
    const extension = file.name.split('.').pop() || ''
    const fileName = `${fileId}.${extension}`
    
    // Crear directorio de uploads si no existe
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    const filePath = join(uploadDir, fileName)

    // Convertir archivo a buffer y guardarlo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    try {
      await writeFile(filePath, buffer)
    } catch (error) {
      // Si falla, crear directorio y intentar de nuevo
      const { mkdir } = await import('fs/promises')
      await mkdir(uploadDir, { recursive: true })
      await writeFile(filePath, buffer)
    }

    // Construir URL del archivo
    const fileUrl = `/uploads/${fileName}`
    
    // Determinar tipo
    const type = isImage ? 'image' : 'audio'

    const fileInfo = {
      id: fileId,
      name: file.name,
      type,
      size: file.size,
      url: fileUrl,
      mimeType: fileType,
      sessionId
    }

    console.log(`[FILE-UPLOAD] Archivo subido: ${file.name} (${type}) para session: ${sessionId}`)

    return NextResponse.json({
      success: true,
      file: fileInfo,
      message: 'Archivo subido correctamente'
    })

  } catch (error) {
    console.error('[FILE-UPLOAD] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
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