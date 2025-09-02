import { 
  Home, 
  Building, 
  Building2, 
  MapPin, 
  MessageCircle, 
  Send, 
  User, 
  Bot,
  Clock,
  CheckCircle2,
  Mic,
  MessageSquare,
  Zap
} from 'lucide-react'

interface IconProps {
  className?: string
  size?: number
}

export const HouseIcon = ({ className, size = 20 }: IconProps) => (
  <Home className={className} size={size} />
)

export const ApartmentIcon = ({ className, size = 20 }: IconProps) => (
  <Building className={className} size={size} />
)

export const OfficeIcon = ({ className, size = 20 }: IconProps) => (
  <Building2 className={className} size={size} />
)

export const LocationIcon = ({ className, size = 20 }: IconProps) => (
  <MapPin className={className} size={size} />
)

export const ChatIcon = ({ className, size = 20 }: IconProps) => (
  <MessageCircle className={className} size={size} />
)

export const SendIcon = ({ className, size = 20 }: IconProps) => (
  <Send className={className} size={size} />
)

export const UserIcon = ({ className, size = 20 }: IconProps) => (
  <User className={className} size={size} />
)

export const BotIcon = ({ className, size = 20 }: IconProps) => (
  <Bot className={className} size={size} />
)

export const ClockIcon = ({ className, size = 20 }: IconProps) => (
  <Clock className={className} size={size} />
)

export const CheckIcon = ({ className, size = 20 }: IconProps) => (
  <CheckCircle2 className={className} size={size} />
)

export const TextAgentIcon = ({ className, size = 20 }: IconProps) => (
  <MessageSquare className={className} size={size} />
)

export const VoiceAgentIcon = ({ className, size = 20 }: IconProps) => (
  <Mic className={className} size={size} />
)

export const AIIcon = ({ className, size = 20 }: IconProps) => (
  <Zap className={className} size={size} />
) 