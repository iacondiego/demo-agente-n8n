'use client'

import { useState, KeyboardEvent } from 'react'
import { SendIcon } from '../icons/PropertyIcons'
import Button from '../ui/Button'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-end space-x-3">
        {/* Campo de texto */}
        <div className="flex-1">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe la ciudad o el tipo de propiedad que buscas..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus-ring text-immobrand-navy placeholder-gray-500"
            rows={1}
            style={{
              minHeight: '44px',
              maxHeight: '120px',
              resize: 'none'
            }}
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1 px-1">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>

        {/* Botón de envío */}
        <Button
          onClick={handleSubmit}
          disabled={!inputValue.trim() || disabled}
          className="mb-6" // Ajuste para alinear con el textarea
        >
          <SendIcon size={16} />
        </Button>
      </div>
    </div>
  )
} 