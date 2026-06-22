import { Gamepad2, Users } from 'lucide-react'

const SHARED_ITEMS = [
  {
    id: '1',
    title: 'Cell Biology Crossword',
    owner: 'Sarah Ahmed',
    type: 'Crossword',
    sharedAt: '2 days ago',
  },
  {
    id: '2',
    title: 'World History Quiz',
    owner: 'Omar Hassan',
    type: 'Quiz',
    sharedAt: '5 days ago',
  },
  {
    id: '3',
    title: 'Arabic Vocabulary Match',
    owner: 'Layla Noor',
    type: 'Match',
    sharedAt: '1 week ago',
  },
]

export function AccountSharedView() {
  return (
    <section className="account-section-card">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="m-0 font-display text-[17px] font-extrabold text-[#1B1530]">
            Shared with me
          </h2>
          <p className="mt-1 text-[13px] text-[#6B6585]">
            Games and projects others have shared with you.
          </p>
        </div>
        <span className="rounded-full bg-[#F3EEFF] px-3 py-1 text-[12px] font-bold text-[#7C4DFF]">
          {SHARED_ITEMS.length} items
        </span>
      </div>

      <div className="flex flex-col gap-0">
        {SHARED_ITEMS.map(({ id, title, owner, type, sharedAt }) => (
          <div key={id} className="account-project-row">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3EEFF] text-[#7C4DFF]">
              <Gamepad2 size={18} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-bold text-[#1B1530]">{title}</div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-[#9B94B0]">
                <span className="inline-flex items-center gap-1">
                  <Users size={12} />
                  {owner}
                </span>
                <span>·</span>
                <span>{type}</span>
                <span>·</span>
                <span>{sharedAt}</span>
              </div>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl bg-[#7C4DFF] px-4 py-2 text-[12px] font-bold text-white transition-transform hover:-translate-y-px"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
