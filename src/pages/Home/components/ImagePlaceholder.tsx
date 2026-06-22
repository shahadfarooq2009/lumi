interface ImagePlaceholderProps {
  className?: string
  /** Soft gradient pair — defaults to Lumi lavender */
  from?: string
  to?: string
  /** Accessible label for the slot */
  label?: string
  /** Show inner inset frame hint */
  framed?: boolean
}

export function ImagePlaceholder({
  className = '',
  from = '#EDE9FF',
  to = '#DDD6FE',
  label = 'Image placeholder',
  framed = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      role="img"
      aria-label={label}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-60 blur-2xl"
        style={{ background: `radial-gradient(circle, ${to}, transparent 70%)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full opacity-40 blur-xl"
        style={{ background: `radial-gradient(circle, ${from}, transparent 70%)` }}
        aria-hidden
      />

      {/* Subtle diagonal sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 45%, transparent 55%, rgba(255,255,255,0.12) 100%)',
        }}
        aria-hidden
      />

      {/* Inner frame — signals “drop image here” without icons or text */}
      {framed ? (
        <div
          className="absolute inset-[10%] rounded-[16px] border border-white/40 bg-white/15 backdrop-blur-[2px]"
          aria-hidden
        >
          <div className="absolute inset-0 rounded-[15px] bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        </div>
      ) : null}

      {/* Soft skeleton shimmer bar */}
      <div
        className="pointer-events-none absolute bottom-[18%] left-[14%] right-[14%] h-2 rounded-full bg-white/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[12%] left-[22%] right-[30%] h-1.5 rounded-full bg-white/20"
        aria-hidden
      />
    </div>
  )
}
