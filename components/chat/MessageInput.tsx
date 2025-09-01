'use client'

import { useState, KeyboardEvent, useRef } from 'react'
import { SendIcon } from '../icons/PropertyIcons'
import { FileAttachment } from '@/types/chat'
import Button from '../ui/Button'

interface MessageInputProps {
  onSendMessage: (message: string, files?: FileAttachment[]) => void
  disabled?: boolean
  sessionId: string
}

export default function MessageInput({ onSendMessage, disabled, sessionId }: MessageInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = () => {
    if ((inputValue.trim() || attachedFiles.length > 0) && !disabled && !isUploading) {
      onSendMessage(inputValue.trim(), attachedFiles)
      setInputValue('')
      setAttachedFiles([])
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('sessionId', sessionId)

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          setAttachedFiles(prev => [...prev, result.file])
        } else {
          console.error('Error subiendo archivo:', result.error)
          alert(`Error subiendo ${file.name}: ${result.error}`)
        }
      }
    } catch (error) {
      console.error('Error en upload:', error)
      alert('Error subiendo archivos')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      {/* Archivos adjuntos */}
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((file) => (
            <div key={file.id} className="flex items-center bg-gray-100 rounded-lg px-3 py-2 text-sm">
              <span className="mr-2">
                {file.type === 'image' ? '🖼️' : '🎵'}
              </span>
              <span className="text-gray-700 truncate max-w-32">{file.name}</span>
              <button
                onClick={() => removeFile(file.id)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end space-x-3">
        {/* Campo de texto */}
        <div className="flex-1">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje o adjunta una imagen/audio..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus-ring text-immobrand-navy placeholder-gray-500"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              resize: 'none'
            }}
            disabled={disabled || isUploading}
          />
          <p className="text-xs text-gray-500 mt-1 px-1">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>

        {/* Botón de archivos */}
        <div className="flex space-x-2 mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*,audio/*"
            multiple
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            variant="ghost"
            size="sm"
          >
            {isUploading ? '📤' : '📎'}
          </Button>

          {/* Botón de envío */}
          <Button
            onClick={handleSubmit}
            disabled={(!inputValue.trim() && attachedFiles.length === 0) || disabled || isUploading}
          >
            <SendIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
} 