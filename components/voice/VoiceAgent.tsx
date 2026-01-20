'use client'

import { useEffect } from 'react'
import { VoiceAgentIcon, MenuIcon } from '../icons/PropertyIcons'

interface VoiceAgentProps {
  onMenuClick?: () => void
}

export default function VoiceAgent({ onMenuClick }: VoiceAgentProps) {
  useEffect(() => {
    // Cargar el script de ElevenLabs si no está ya cargado
    const existingScript = document.getElementById('elevenlabs-script')

    if (!existingScript) {
      const script = document.createElement('script')
      script.id = 'elevenlabs-script'
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
      script.async = true
      script.type = 'text/javascript'

      // Agregar el script al head
      document.head.appendChild(script)

      // Cleanup al desmontar el componente
      return () => {
        const scriptElement = document.getElementById('elevenlabs-script')
        if (scriptElement) {
          document.head.removeChild(scriptElement)
        }
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col bg-immobrand-darker relative">
      {/* Header simplificado */}
      <div className="header-gradient px-6 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Botón Menu Móvil */}
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 -ml-2 text-gray-300 hover:text-white transition-colors"
            >
              <MenuIcon size={24} />
            </button>

            <div className="flex items-center justify-center w-10 h-10 bg-immobrand-accent rounded-full avatar-glow">
              <VoiceAgentIcon className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-immobrand-cream">
                Agente de Voz IA
              </h1>
              <p className="text-sm text-gray-300">
                Interacción natural por voz
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full glow-blue"></div>
            <span className="text-xs text-emerald-400">Listo para conversar</span>
          </div>
        </div>
      </div>

      {/* Contenido centrado y simplificado */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Widget de ElevenLabs centrado */}
          <div className="mb-8">
            <elevenlabs-convai
              agent-id="agent_01jxtbwt58fcwa0w8bs1s8agcm"
            ></elevenlabs-convai>
          </div>

          {/* Mensaje simple */}
          <p className="text-gray-300 text-lg mb-6">
            Presiona el botón y habla naturalmente sobre propiedades inmobiliarias
          </p>

          {/* Ejemplos mínimos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <div className="glass-effect p-3 rounded-lg text-gray-400 text-sm">
              "Preguntar por propiedad en villa florencia"
            </div>
            <div className="glass-effect p-3 rounded-lg text-gray-400 text-sm">
              "Busco una propiedad con vista al mar"
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

