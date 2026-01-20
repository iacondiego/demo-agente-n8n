'use client'

import { TextAgentIcon, VoiceAgentIcon, AIIcon, CloseIcon } from '../icons/PropertyIcons'

interface SidebarProps {
  currentAgent: 'text' | 'voice'
  onAgentChange: (agent: 'text' | 'voice') => void
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ currentAgent, onAgentChange, isOpen = false, onClose }: SidebarProps) {
  const agents = [
    {
      id: 'text' as const,
      name: 'Agente de Texto',
      description: 'Chat conversacional',
      icon: TextAgentIcon,
      available: true
    },
    {
      id: 'voice' as const,
      name: 'Agente de Voz',
      description: 'Asistente por voz',
      icon: VoiceAgentIcon,
      available: true // Ahora disponible
    }
  ]

  const sidebarClasses = `
    w-80 glass-effect border-r border-immobrand-navy h-full flex flex-col shadow-2xl
    fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
    md:relative md:translate-x-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `

  return (
    <>
      <div className={sidebarClasses}>
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-immobrand-navy/30 flex justify-between items-start">
          <div className="mb-2">
            <h2 className="text-immobrand-cream font-semibold text-lg">
              Setterless 360°
            </h2>
            <p className="text-gray-400 text-xs">
              Selecciona tu agente preferido
            </p>
          </div>
          {/* Botón de cerrar solo en móvil */}
          <button
            onClick={onClose}
            className="md:hidden p-1 text-gray-400 hover:text-white transition-colors"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Lista de Agentes */}
        <div className="flex-1 p-4 space-y-3">
          {agents.map((agent) => (
            <button
              key={agent.id}
              onClick={() => {
                if (agent.available) {
                  onAgentChange(agent.id)
                  if (onClose) onClose() // Cerrar sidebar en móvil al seleccionar
                }
              }}
              disabled={!agent.available}
              className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${currentAgent === agent.id
                ? 'bg-immobrand-blue/20 border border-immobrand-accent glow-blue'
                : agent.available
                  ? 'hover:bg-immobrand-dark/50 border border-immobrand-navy hover:border-immobrand-accent/50'
                  : 'opacity-50 cursor-not-allowed border border-immobrand-navy/30'
                }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentAgent === agent.id
                  ? 'bg-immobrand-accent/20 glow-blue animate-pulse'
                  : 'bg-immobrand-navy/30'
                  }`}>
                  <agent.icon
                    className={currentAgent === agent.id ? 'text-immobrand-accent' : 'text-gray-400'}
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${currentAgent === agent.id
                    ? 'text-immobrand-accent'
                    : 'text-immobrand-cream'
                    }`}>
                    {agent.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {agent.description}
                  </p>
                  {currentAgent === agent.id && (
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full glow-blue"></div>
                      <span className="text-emerald-400 text-xs ml-2">Activo</span>
                    </div>
                  )}
                  {!agent.available && (
                    <div className="flex items-center mt-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-orange-400 text-xs ml-2">Próximamente</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-immobrand-navy/30">
          <div className="text-center">
            <p className="text-gray-400 text-xs">
              Inmobiliaria Premium
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Asistentes IA v2.0
            </p>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar en móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}

