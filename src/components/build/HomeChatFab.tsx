import { Link, useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

function scrollToHomeChat() {
  document.getElementById('lumi-hero')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export function HomeChatIconButton({ className = 'icon-btn' }: { className?: string }) {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  if (onHome) {
    return (
      <button
        type="button"
        className={className}
        title="Quizora chat"
        aria-label="Quizora chat"
        onClick={scrollToHomeChat}
      >
        <MessageCircle size={18} strokeWidth={2} />
      </button>
    )
  }

  return (
    <Link to="/" className={className} title="Quizora chat" aria-label="Quizora chat">
      <MessageCircle size={18} strokeWidth={2} />
    </Link>
  )
}
