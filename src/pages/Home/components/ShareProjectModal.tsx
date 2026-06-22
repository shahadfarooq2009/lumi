import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, Copy, Crown, Link2, X } from 'lucide-react'

export type ShareAccessRole = 'viewer' | 'editor' | 'play'

const ACCESS_OPTIONS: { id: ShareAccessRole; label: string; hint: string }[] = [
  { id: 'viewer', label: 'Viewer', hint: 'Can preview questions only' },
  { id: 'editor', label: 'Editor', hint: 'Can edit questions & settings' },
  { id: 'play', label: 'Play', hint: 'Can play the game' },
]

const OWNER_EMAIL = 'fatima@example.com'
const OWNER_NAME = 'Fatima'

interface ShareProjectModalProps {
  projectTitle: string
  shareUrl: string
  onClose: () => void
}

export function ShareProjectModal({ projectTitle, shareUrl, onClose }: ShareProjectModalProps) {
  const [accessRole, setAccessRole] = useState<ShareAccessRole>('viewer')
  const [inviteEmail, setInviteEmail] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return createPortal(
    <div
      className="lumi-modal-bg fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-project-title"
        className="relative flex w-full max-w-[min(480px,94vw)] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_32px_64px_-16px_rgba(27,21,48,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[#F0ECFB] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2
              id="share-project-title"
              className="m-0 font-display text-[18px] font-extrabold tracking-tight text-[#1B1530] sm:text-[20px]"
            >
              Share
            </h2>
            <p className="mt-1 truncate text-[12px] text-[#6B6585] sm:text-[13px]">{projectTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] text-[#6B6585] transition-colors hover:bg-[#F9FAFB] hover:text-[#1B1530]"
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
          <div className="mb-5 flex items-center gap-3 rounded-[16px] border border-[#ECE7FB] bg-[#FAF8FF] px-3.5 py-3">
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #FFD3E2, #B388FF)' }}
            >
              {OWNER_NAME.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Crown size={12} className="shrink-0 text-[#FF8E53]" strokeWidth={2.2} />
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#9B94B0]">Owner</span>
              </div>
              <p className="truncate text-[13px] font-bold text-[#1B1530]">{OWNER_NAME}</p>
              <p className="truncate text-[12px] text-[#6B6585]">{OWNER_EMAIL}</p>
            </div>
          </div>

          <section className="mb-5">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#9B94B0]">
              Invite by email
            </h3>
            <input
              type="email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="name@email.com"
              className="w-full rounded-xl border border-[#ECE7FB] bg-white px-3.5 py-3 text-[13px] text-[#1B1530] outline-none transition-colors placeholder:text-[#C4C0D4] focus:border-lumi-primary focus:ring-2 focus:ring-lumi-primary/15"
            />
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#9B94B0]">
              General access
            </h3>
            <div className="rounded-[16px] border border-[#ECE7FB] bg-white p-3.5">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F6F2FF] text-lumi-primary">
                  <Link2 size={16} strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#1B1530]">Anyone with the link</p>
                  <p className="text-[11px] text-[#9B94B0]">People with the link can access</p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {ACCESS_OPTIONS.map((option) => {
                  const selected = accessRole === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAccessRole(option.id)}
                      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                        selected
                          ? 'border-lumi-primary bg-[#FAF8FF]'
                          : 'border-transparent bg-[#FAFAFE] hover:bg-[#F6F2FF]'
                      }`}
                    >
                      <span
                        className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${
                          selected ? 'border-lumi-primary bg-lumi-primary' : 'border-[#D4C4FF] bg-white'
                        }`}
                      >
                        {selected ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-bold text-[#1B1530]">{option.label}</span>
                        <span className="block text-[11px] text-[#9B94B0]">{option.hint}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mb-5">
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#9B94B0]">
              Copy link
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="min-w-0 flex-1 truncate rounded-xl border border-[#ECE7FB] bg-[#FAFAFE] px-3 py-2.5 text-[12px] text-[#6B6585] outline-none"
              />
              <button
                type="button"
                onClick={() => void handleCopy()}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition-colors ${
                  copied
                    ? 'bg-[#ECFDF5] text-[#059669]'
                    : 'bg-[#F6F2FF] text-lumi-primary hover:bg-[#EDE5FF]'
                }`}
              >
                {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} strokeWidth={2.2} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </section>
        </div>

        <footer className="shrink-0 border-t border-[#ECE7FB] bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="lumi-btn-primary w-full rounded-full py-3.5 text-[14px] font-bold text-white transition-all"
          >
            Done
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  )
}
