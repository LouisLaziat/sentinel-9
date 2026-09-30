import { useEffect, useRef } from 'react'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  children: ReactNode
  className: string
  labelledBy: string
  describedBy?: string
  initialFocus?: RefObject<HTMLInputElement | null>
  onClose: () => void
}

export function Modal({ children, className, labelledBy, describedBy, initialFocus, onClose }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog?.showModal()
    initialFocus?.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true })
    }
  }, [initialFocus])

  return createPortal(
    <dialog
      aria-describedby={describedBy}
      aria-labelledby={labelledBy}
      className={`uplink-dialog ${className}`}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      ref={dialogRef}
    >{children}</dialog>,
    document.body,
  )
}
