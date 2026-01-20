'use client'

import Link from 'next/link'
import { TextAgentIcon, VoiceAgentIcon, AIIcon } from '../icons/PropertyIcons'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-immobrand-darker relative overflow-hidden flex flex-col items-center justify-center font-sans text-immobrand-cream selection:bg-immobrand-accent/30">

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-immobrand-blue/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-immobrand-accent/5 rounded-full blur-[80px]"></div>
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10 animate-fade-in">
                <div className="flex items-center space-x-4">
                    <div className="relative w-48 h-16 md:w-64 md:h-24"> {/* Container for logo */}
                        <img
                            src="/logo.png"
                            alt="Setterless Logo"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="z-10 container mx-auto px-4 text-center pt-32 md:pt-0">

                <div className="mb-16 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-immobrand-lightblue to-immobrand-accent bg-clip-text text-transparent">
                        El Futuro de la <br /> Atención Inmobiliaria
                    </h1>
                    <div className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed space-y-4">
                        <p>
                            Este es un demo funcional configurado con propiedades y contexto del mercado inmobiliario de México.
                        </p>
                        <p className="text-lg text-gray-500">
                            Cada agente que implementamos se personaliza según la inmobiliaria: país, tipo de propiedades, procesos comerciales y forma de atención.
                        </p>
                    </div>

                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {/* Text Agent Card */}
                    <Link
                        href="/demo?agent=text"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-immobrand-lightblue/50 rounded-3xl p-8 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-immobrand-blue/10 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-immobrand-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-immobrand-navy/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-immobrand-blue/20">
                                <TextAgentIcon className="text-immobrand-accent w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-immobrand-accent transition-colors">Agente de Texto</h3>
                            <p className="text-gray-400 mb-6 text-sm">
                                Interactúa mediante chat natural. Respuestas instantáneas, cualificación de leads y agendamiento automático.
                            </p>

                            <div className="mt-auto px-6 py-2 rounded-full border border-immobrand-navy bg-immobrand-navy/30 text-sm font-medium group-hover:bg-immobrand-accent group-hover:text-white group-hover:border-immobrand-accent transition-all duration-300">
                                Probar Chat →
                            </div>
                        </div>
                    </Link>

                    {/* Voice Agent Card */}
                    <Link
                        href="/demo?agent=voice"
                        className="group relative bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-immobrand-navy/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-purple-500/20">
                                <VoiceAgentIcon className="text-purple-400 w-10 h-10" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors">Agente de Voz</h3>
                            <p className="text-gray-400 mb-6 text-sm">
                                Conversaciones fluidas por voz. Entonación humana, manejo de interrupciones y cierre de ventas.
                            </p>

                            <div className="mt-auto px-6 py-2 rounded-full border border-immobrand-navy bg-immobrand-navy/30 text-sm font-medium group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500 transition-all duration-300">
                                Probar Voz →
                            </div>
                        </div>
                    </Link>

                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-6 text-center text-gray-500 text-sm">
                <p>© 2026 Setterless. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}
