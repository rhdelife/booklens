import { useEffect, useState } from 'react'

const Toast = ({ message, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        const cleanupTimer = setTimeout(() => {
          if (onClose) onClose()
        }, 300) // 애니메이션 완료 후 콜백
        return () => clearTimeout(cleanupTimer)
      }, duration)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [message, duration, onClose])

  if (!message) return null

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {message}
    </div>
  )
}

export default Toast

