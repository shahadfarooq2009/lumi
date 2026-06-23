export function FloatingShapes() {
  return (
    <>
      <div
        className="pointer-events-none absolute right-[12%] top-[10%] h-9 w-9 animate-floatSlow rounded-lg opacity-25"
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          transform: 'rotate(15deg)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[14%] left-[8%] h-[26px] w-[26px] animate-floatSlow rounded-full opacity-25"
        style={{
          background: 'linear-gradient(135deg, #f9a8d4, #fb923c)',
          animationDelay: '0.8s',
          animationDuration: '8s',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-[6%] top-[42%] h-5 w-5 animate-floatSlow opacity-30"
        style={{
          background: '#a78bfa',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          animationDelay: '1.5s',
          animationDuration: '6s',
        }}
        aria-hidden
      />
    </>
  )
}
