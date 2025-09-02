// Declaración de tipos para el widget de ElevenLabs
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': {
        'agent-id': string;
        children?: React.ReactNode;
      };
    }
  }
}

export {};
