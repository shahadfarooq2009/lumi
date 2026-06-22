import { ACHIEVEMENTS } from '../data/accountData'

export function AchievementsSection() {
  return (
    <section className="account-section-card mt-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="m-0 font-display text-[17px] font-extrabold text-[#1B1530]">Achievements</h2>
        <button type="button" className="border-0 bg-transparent p-0 text-[13px] font-semibold text-[#7C4DFF]">
          View all
        </button>
      </div>

      <div className="account-achievements-scroll">
        {ACHIEVEMENTS.map(({ title, description, date, icon: Icon, gradient, unlocked, frame }) => (
          <div
            key={title}
            className={`account-hex shrink-0 ${unlocked ? 'account-hex--unlocked' : 'account-hex--locked'}`}
          >
            <div
              className={`account-hex__shape ${
                unlocked
                  ? `account-hex__shape--${frame} bg-gradient-to-br ${gradient}`
                  : 'account-hex__shape--locked'
              }`}
            >
              <Icon size={24} strokeWidth={2} />
            </div>
            <p className="account-hex__title mt-3 m-0 text-[13px] font-bold text-[#1B1530]">{title}</p>
            <p className="account-hex__desc mt-1 m-0 max-w-[120px] text-[11px] leading-snug text-[#9B94B0]">
              {description}
            </p>
            {unlocked && date ? (
              <p className="mt-1.5 m-0 text-[10px] font-semibold text-[#7C4DFF]">{date}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
