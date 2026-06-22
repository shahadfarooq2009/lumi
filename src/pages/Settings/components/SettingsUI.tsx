import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function SettingsPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="settings-panel">
      <header className="settings-panel__head">
        <h3 className="settings-panel__title">{title}</h3>
        {description ? <p className="settings-panel__desc">{description}</p> : null}
      </header>
      <div className="settings-panel__body">{children}</div>
    </section>
  )
}

export function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="settings-row">
      <div className="settings-row__label">
        <span className="settings-row__text">{label}</span>
        {hint ? <span className="settings-row__hint">{hint}</span> : null}
      </div>
      <div className="settings-row__control">{children}</div>
    </div>
  )
}

export function SettingsInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  icon: Icon,
}: {
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  icon?: LucideIcon
}) {
  if (Icon) {
    return (
      <div className="settings-input-wrap">
        <Icon size={16} strokeWidth={2} className="settings-input-wrap__icon" />
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="settings-input settings-input--with-icon"
        />
      </div>
    )
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="settings-input"
    />
  )
}

export function SettingsSelect<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className="settings-select"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export function SettingsSegment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="settings-segment">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`settings-segment__btn ${value === opt.value ? 'settings-segment__btn--active' : ''}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`settings-toggle ${checked ? 'settings-toggle--on' : ''}`}
    >
      <span className="settings-toggle__knob" />
    </button>
  )
}

export function SettingsActionButton({
  children,
  onClick,
  variant = 'outline',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'outline' | 'danger' | 'primary'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`settings-action-btn settings-action-btn--${variant}`}
    >
      {children}
    </button>
  )
}

export function SettingsListCard({
  children,
}: {
  children: ReactNode
}) {
  return <div className="settings-list-card">{children}</div>
}

export function SettingsListItem({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action: ReactNode
}) {
  return (
    <div className="settings-list-item">
      <div className="settings-list-item__copy">
        <span className="settings-list-item__title">{title}</span>
        {description ? <span className="settings-list-item__desc">{description}</span> : null}
      </div>
      <div className="settings-list-item__action">{action}</div>
    </div>
  )
}
