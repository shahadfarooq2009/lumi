import { useEffect, useRef } from 'react'

export function GridSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (event: MouseEvent) => {
      el.style.setProperty('--mouse-x', `${event.clientX}px`)
      el.style.setProperty('--mouse-y', `${event.clientY}px`)
      el.style.opacity = '1'
    }

    const onLeave = () => {
      el.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <div ref={ref} className="lumi-grid-spotlight" aria-hidden />
}
