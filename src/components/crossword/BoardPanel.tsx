import type { ReactNode } from 'react'

interface BoardPanelProps {
  children: ReactNode
  fill?: boolean
}

export function BoardPanel({ children, fill = false }: BoardPanelProps) {
  return (
    <section
      className={`relative flex min-h-0 flex-col items-center overflow-hidden rounded-[28px] bg-white ${
        fill ? 'min-h-0 flex-1 justify-center gap-4 p-4' : 'gap-6 p-7'
      }`}
    >
      <div
        className={`relative z-10 flex h-full w-full min-h-0 flex-col items-center ${
          fill ? 'flex-1 justify-center gap-4' : 'gap-6'
        }`}
      >
        {children}
      </div>
    </section>
  )
}
