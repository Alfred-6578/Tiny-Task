'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type ToastProps = {
  toast: {
    id: string
    message: string
    type?: 'success' | 'error' | 'info'
    duration?: number
  }
  onDismiss: () => void
}

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const [swiped, setSwiped] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      timeoutRef.current = setTimeout(() => {
        onDismiss()
      }, toast.duration)
    }

    return () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
  }, [toast.duration])

  return (
    <AnimatePresence>
      {!swiped && (
        <motion.div
          className={`rounded-xl shadow-lg p-4 text-white flex items-center justify-between gap-3 ${
            toast.type === 'success'
              ? 'bg-green-600'
              : toast.type === 'error'
              ? 'bg-red-600'
              : 'bg-gray-800'
          }`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          drag="x"
          dragConstraints={{ left: 0, right: 100 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              setSwiped(true)
              onDismiss()
            }
          }}
        >
          <span className="text-sm">{toast.message}</span>
          <button onClick={onDismiss} className="text-white ml-auto text-sm font-bold">
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
