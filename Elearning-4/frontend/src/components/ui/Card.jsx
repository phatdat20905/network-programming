import React from 'react'

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  hover = false 
}) => {
  const paddings = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-200
      ${paddings[padding]}
      ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card