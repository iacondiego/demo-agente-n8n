'use client'

import { HouseIcon, BotIcon, CheckIcon } from '../icons/PropertyIcons'
import { BOT_NAME } from '@/lib/constants'

interface HeaderProps {
  botStatus: 'available' | 'typing' | 'away'
  isWebhookConnected?: boolean
}

export default function Header({ botStatus, isWebhookConnected = true }: HeaderProps) {
  const getStatusText = () => {
    if (botStatus === 'away' && !isWebhookConnected) {
      return 'Modo sin conexión'
    }
    
    switch (botStatus) {
      case 'available':
        return 'Disponible'
      case 'typing':
        return 'Escribiendo...'
      case 'away':
        return 'Ausente'
      default:
        return 'Disponible'
    }
  }

  const getStatusColor = () => {
    if (botStatus === 'away' && !isWebhookConnected) {
      return 'text-orange-600'
    }
    
    switch (botStatus) {
      case 'available':
        return 'text-green-600'
      case 'typing':
        return 'text-immobrand-gold'
      case 'away':
        return 'text-gray-500'
      default:
        return 'text-green-600'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo y Branding */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-immobrand-navy rounded-full">
            <HouseIcon className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-immobrand-navy">
              Inmobiliaria Premium
            </h1>
            <p className="text-sm text-gray-600">
              Tu hogar ideal te está esperando
            </p>
          </div>
        </div>

        {/* Estado del Bot */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-immobrand-gold rounded-full">
              <BotIcon className="text-immobrand-navy" size={16} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-immobrand-navy">
                {BOT_NAME}
              </p>
              <div className="flex items-center space-x-1">
                {botStatus === 'available' && isWebhookConnected && (
                  <CheckIcon className="text-green-600" size={12} />
                )}
                {!isWebhookConnected && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
                {botStatus === 'typing' && (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-immobrand-gold rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-immobrand-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-immobrand-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
                <span className={`text-xs ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 