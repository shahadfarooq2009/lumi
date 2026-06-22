import { User } from 'lucide-react'
import { USER } from '../data/accountData'

export function AccountDetailsCard() {
  const rows = [
    { label: 'Plan', value: 'Free' },
    { label: 'Member since', value: USER.joinedLabel },
    { label: 'Email', value: USER.email },
    { label: 'Password', value: '••••••••', action: 'Change' },
  ]

  return (
    <section className="account-section-card flex h-full flex-col">
      <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-[#1B1530]">Account</h2>

      <dl className="m-0 flex flex-1 flex-col gap-0 p-0">
        {rows.map(({ label, value, action }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 border-b border-[#F3EEFF] py-3.5 last:border-b-0"
          >
            <dt className="text-[13px] font-medium text-[#9B94B0]">{label}</dt>
            <dd className="m-0 flex items-center gap-3 text-[13px] font-semibold text-[#1B1530]">
              {value}
              {action ? (
                <button type="button" className="border-0 bg-transparent p-0 text-[13px] font-semibold text-[#7C4DFF]">
                  {action}
                </button>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ECE7FB] bg-[#F3EEFF] py-3 text-[14px] font-bold text-[#7C4DFF] transition-colors hover:bg-[#EDE5FF]"
      >
        <User size={16} strokeWidth={2.2} />
        Edit Profile
      </button>
    </section>
  )
}
