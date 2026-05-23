import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, glow, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-card',
        hover && 'transition-all duration-200 hover:border-brand-500/30 hover:-translate-y-0.5',
        glow && 'hover:shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'
