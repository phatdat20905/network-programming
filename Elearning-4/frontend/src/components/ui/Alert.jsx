import React from 'react'
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react'

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className = '' 
}) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="h-5 w-5 text-blue-400" />,
      title: 'text-blue-800',
      text: 'text-blue-700'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />,
      title: 'text-green-800',
      text: 'text-green-700'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
      title: 'text-yellow-800',
      text: 'text-yellow-700'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="h-5 w-5 text-red-400" />,
      title: 'text-red-800',
      text: 'text-red-700'
    }
  }

  const style = styles[type]

  return (
    <div className={`rounded-md ${style.bg} ${style.border} border p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {style.icon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${style.title}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`text-sm ${style.text} ${title ? 'mt-1' : ''}`}>
              {message}
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md ${style.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${type}-500`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert