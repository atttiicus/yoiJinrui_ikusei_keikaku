interface Props {
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  message,
  confirmLabel = '确认',
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="p-5 pt-6">
          <p className="text-fg text-sm leading-relaxed mb-6 text-center">{message}</p>
          <div className="flex gap-3">
            <button className="btn-ghost flex-1 justify-center py-2.5" onClick={onCancel}>
              取消
            </button>
            <button
              className={`btn flex-1 justify-center py-2.5 ${danger ? 'bg-bad-dim text-bad' : 'bg-good-dim text-good'}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
