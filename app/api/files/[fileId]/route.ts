import { NextRequest, NextResponse } from 'next/server'

// Declarar el tipo global para TypeScript
declare global {
  var tempFiles: Map<string, {
    buffer: Buffer
    mimeType: string
    name: string
    uploadedAt: Date
  }> | undefined
}

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params

    if (!fileId) {
      return NextResponse.json(
        { error: 'ID de archivo requerido' },
        { status: 400 }
      )
    }

    // Verificar si el archivo existe en memoria
    const tempFiles = globalThis.tempFiles
    if (!tempFiles || !tempFiles.has(fileId)) {
      return NextResponse.json(
        { error: 'Archivo no encontrado' },
        { status: 404 }
      )
    }

    const fileData = tempFiles.get(fileId)!

    // Verificar si el archivo no ha expirado (1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (fileData.uploadedAt < oneHourAgo) {
      tempFiles.delete(fileId)
      return NextResponse.json(
        { error: 'Archivo expirado' },
        { status: 410 }
      )
    }

    // Servir el archivo
    return new NextResponse(fileData.buffer, {
      status: 200,
      headers: {
        'Content-Type': fileData.mimeType,
        'Content-Disposition': `inline; filename="${fileData.name}"`,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('[FILE-SERVE] Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 