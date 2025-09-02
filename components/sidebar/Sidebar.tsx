'use client'

import { TextAgentIcon, VoiceAgentIcon, AIIcon } from '../icons/PropertyIcons'

interface SidebarProps {
  currentAgent: 'text' | 'voice'
  onAgentChange: (agent: 'text' | 'voice') => void
}

export default function Sidebar({ currentAgent, onAgentChange }: SidebarProps) {
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

  return (
    <div className="w-80 glass-effect border-r border-immobrand-navy h-full flex flex-col shadow-2xl">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-immobrand-navy/30">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-immobrand-blue rounded-lg flex items-center justify-center glow-blue">
            <AIIcon className="text-white" size={16} />
          </div>
          <div>
            <h2 className="text-immobrand-cream font-semibold text-lg">
              Setterless 360°
            </h2>
            <p className="text-gray-400 text-xs">
              Selecciona tu agente preferido
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Agentes */}
      <div className="flex-1 p-4 space-y-3">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => agent.available && onAgentChange(agent.id)}
            disabled={!agent.available}
            className={`w-full p-4 rounded-lg transition-all duration-300 text-left ${
              currentAgent === agent.id
                ? 'bg-immobrand-blue/20 border border-immobrand-accent glow-blue'
                : agent.available
                ? 'hover:bg-immobrand-dark/50 border border-immobrand-navy hover:border-immobrand-accent/50'
                : 'opacity-50 cursor-not-allowed border border-immobrand-navy/30'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentAgent === agent.id 
                  ? 'bg-immobrand-accent/20 glow-blue animate-pulse' 
                  : 'bg-immobrand-navy/30'
              }`}>
                <agent.icon 
                  className={currentAgent === agent.id ? 'text-immobrand-accent' : 'text-gray-400'} 
                  size={20} 
                />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${
                  currentAgent === agent.id 
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
  )
}
