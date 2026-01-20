'use client'

import { useState } from 'react'
import Sidebar from '../sidebar/Sidebar'
import ChatLayout from '../chat/ChatLayout'
import VoiceAgent from '../voice/VoiceAgent'

interface MainLayoutProps {
  initialAgent?: 'text' | 'voice'
}

export default function MainLayout({ initialAgent = 'text' }: MainLayoutProps) {
  const [currentAgent, setCurrentAgent] = useState<'text' | 'voice'>(initialAgent)

  const handleAgentChange = (agent: 'text' | 'voice') => {
    setCurrentAgent(agent)
  }

  const renderAgentInterface = () => {
    switch (currentAgent) {
      case 'text':
        return <ChatLayout />
      case 'voice':
        return <VoiceAgent />
      default:
        return <ChatLayout />
    }
  }

  return (
    <div className="h-screen flex bg-immobrand-darker relative overflow-hidden">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-immobrand-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-immobrand-accent/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-immobrand-lightblue/4 rounded-full blur-2xl"></div>
      </div>

      {/* Sidebar */}
      <Sidebar
        currentAgent={currentAgent}
        onAgentChange={handleAgentChange}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {renderAgentInterface()}
      </div>
    </div>
  )
}
