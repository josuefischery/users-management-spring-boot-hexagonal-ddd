import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

type Notification = {
  type: 'success' | 'error' | 'info'
  message: string
}

interface StatusMessageProps {
  notification: Notification | null
  onClose: () => void
}

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

export function StatusMessage({ notification, onClose }: StatusMessageProps) {
  if (!notification) return null

  const Icon = iconByType[notification.type]

  return (
    <section className={`status-message ${notification.type}`} role="status">
      <Icon size={18} aria-hidden="true" />
      <p>{notification.message}</p>
      <button type="button" className="icon-action" onClick={onClose} aria-label="Cerrar mensaje">
        <X size={16} aria-hidden="true" />
      </button>
    </section>
  )
}
