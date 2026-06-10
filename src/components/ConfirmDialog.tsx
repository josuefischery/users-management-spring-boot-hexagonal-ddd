import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  icon?: ReactNode
  isBusy: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  icon,
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <div className="dialog-title">
          {icon}
          <h2 id="confirm-title">{title}</h2>
        </div>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onCancel} disabled={isBusy}>
            {cancelLabel}
          </button>
          <button type="button" className="danger-action" onClick={onConfirm} disabled={isBusy}>
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}
