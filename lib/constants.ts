export const BOT_NAME = "Asesor Virtual Inmobiliario"

// Configuración del webhook de n8n
export const WEBHOOK_CONFIG = {
  URL: "https://devwebhook.iacondiego.es/webhook/0175afe2-b56d-405c-a483-713e48b52976",
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
}



export const WELCOME_MESSAGES = [
  "¡Hola! Soy tu asesor virtual inmobiliario. ¿En qué puedo ayudarte hoy?",
  "Bienvenido/a. Estoy aquí para ayudarte a encontrar la propiedad perfecta.",
  "¡Excelente día para buscar propiedades! ¿Qué tipo de inmueble te interesa?"
]

export const QUICK_ACTIONS = [
  { label: "Ver departamentos en venta", action: "departamentos_venta" },
  { label: "Casas en alquiler", action: "casas_alquiler" },
  { label: "Agendar visita", action: "agendar_visita" },
  { label: "Contactar asesor", action: "contactar_asesor" }
]

export const BOT_RESPONSES = {
  default: [
    "Entiendo tu consulta. ¿Podrías contarme más detalles sobre lo que buscas?",
    "Perfecto, déjame ayudarte con eso. ¿En qué zona te gustaría buscar?",
    "¡Excelente elección! Tengo varias opciones que podrían interesarte."
  ],
  departamentos: [
    "Tenemos departamentos increíbles disponibles. ¿Cuántos dormitorios necesitas?",
    "¿Prefieres departamentos con vista al mar o cerca del centro de la ciudad?"
  ],
  casas: [
    "Las casas son una excelente inversión. ¿Buscas algo con jardín?",
    "¿Te interesa una casa de una o dos plantas?"
  ],
  alquiler: [
    "Para alquiler tenemos opciones muy atractivas. ¿Cuál es tu presupuesto mensual?",
    "¿Necesitas que esté amueblado o sin muebles?"
  ],
  // Mensajes de error para webhook
  error: [
    "Disculpa, tengo algunos problemas técnicos. ¿Podrías intentar de nuevo?",
    "Estoy experimentando dificultades para procesar tu consulta. Un momento por favor.",
    "Parece que hay un problema con mi conexión. Intenta nuevamente en unos segundos."
  ],
  // Mensaje mientras se conecta con n8n
  connecting: [
    "Conectando con mi sistema de propiedades...",
    "Consultando nuestra base de datos...",
    "Buscando las mejores opciones para ti..."
  ],

}

export const TYPING_DELAY = {
  min: 1000,
  max: 2500
} 