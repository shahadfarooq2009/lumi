import type { ReactNode } from 'react'

interface PageShellProps {
  title: string
  subtitle?: string
  className?: string
  action?: ReactNode
  children: ReactNode
}

export function PageShell({ title, subtitle, className = '', action, children }: PageShellProps) {
  return (
    <section className={`pb-16 pt-2 ${className}`.trim()}>
      <div className="mb-8">
        <div className="flex flex-nowrap items-center justify-between gap-3 sm:gap-4">
          <h1 className="min-w-0 font-display text-[28px] font-extrabold leading-none tracking-tight text-[#1B1530] sm:text-[32px]">
            {title}
          </h1>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
        {subtitle ? (
          <p className="mt-1.5 text-[15px] text-[#6B6585]">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}
