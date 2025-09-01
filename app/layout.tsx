import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Asesor Virtual Inmobiliario | Chat de Atención',
  description: 'Asistente virtual especializado en bienes raíces. Encuentra tu propiedad ideal con atención personalizada 24/7.',
  keywords: 'inmobiliaria, propiedades, casas, departamentos, venta, alquiler, asesor virtual',
  authors: [{ name: 'Inmobiliaria Premium' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1a365d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 