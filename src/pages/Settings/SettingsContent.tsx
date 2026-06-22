import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  Gamepad2,
  Globe,
  Palette,
  User,
  X,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { exportUserData, resetUserProgress } from '../../lib/userSettings'
import { useUserSettings } from './hooks/useUserSettings'
import {
  SettingsActionButton,
  SettingsInput,
  SettingsListCard,
  SettingsListItem,
  SettingsPanel,
  SettingsSegment,
  SettingsSelect,
  SettingsToggle,
} from './components/SettingsUI'

type SettingsSectionId =
  | 'appearance'
  | 'language'
  | 'notifications'
  | 'account'
  | 'game'
  | 'data'
  | 'danger'

const NAV: { id: SettingsSectionId; label: string; icon: LucideIcon }[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: User },
  { id: 'game', label: 'Game settings', icon: Gamepad2 },
  { id: 'data', label: 'Data & progress', icon: BarChart3 },
]

export function SettingsContent() {
  const { theme, setTheme } = useTheme()
  const { settings, patch } = useUserSettings()
  const [active, setActive] = useState<SettingsSectionId>('appearance')

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      window.alert('Account deletion is not available in demo mode.')
    }
  }

  const handleResetProgress = () => {
    if (window.confirm('Reset all learning progress? This cannot be undone.')) {
      resetUserProgress()
      window.alert('Progress has been reset.')
    }
  }

  return (
    <div className="settings-layout-inner">
      <nav className="settings-nav" aria-label="Settings sections">
        <div className="settings-nav__list">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`settings-nav__item ${active === id ? 'settings-nav__item--active' : ''}`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setActive('danger')}
          className={`settings-nav__danger ${active === 'danger' ? 'settings-nav__danger--active' : ''}`}
        >
          <X size={18} strokeWidth={2.2} />
          Delete account
        </button>
      </nav>

      <div className="settings-content">
        {active === 'appearance' ? (
          <SettingsPanel
            title="Appearance"
            description="Customize how Lumi looks on your device."
          >
            <SettingsListCard>
              <SettingsListItem
                title="Dark mode"
                description="Switch between light and dark interface"
                action={
                  <SettingsToggle
                    label="Dark mode"
                    checked={theme === 'dark'}
                    onChange={(on) => setTheme(on ? 'dark' : 'light')}
                  />
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'language' ? (
          <SettingsPanel title="Language" description="Choose your preferred language.">
            <SettingsListCard>
              <SettingsListItem
                title="App language"
                description="Interface and content language"
                action={
                  <SettingsSegment
                    value={settings.language}
                    options={[
                      { value: 'english', label: 'English' },
                      { value: 'arabic', label: 'Arabic' },
                    ]}
                    onChange={(language) => patch({ language })}
                  />
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'notifications' ? (
          <SettingsPanel title="Notifications" description="Manage alerts and updates.">
            <SettingsListCard>
              <SettingsListItem
                title="Game notifications"
                description="Get notified about game activity"
                action={
                  <SettingsToggle
                    label="Game notifications"
                    checked={settings.notifications.games}
                    onChange={(games) => patch({ notifications: { games } })}
                  />
                }
              />
              <SettingsListItem
                title="Achievement alerts"
                description="Celebrate milestones and badges"
                action={
                  <SettingsToggle
                    label="Achievement notifications"
                    checked={settings.notifications.achievements}
                    onChange={(achievements) => patch({ notifications: { achievements } })}
                  />
                }
              />
              <SettingsListItem
                title="Email notifications"
                description="Optional email updates"
                action={
                  <SettingsToggle
                    label="Email notifications"
                    checked={settings.notifications.email}
                    onChange={(email) => patch({ notifications: { email } })}
                  />
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'account' ? (
          <SettingsPanel title="Account" description="Update your profile information.">
            <div className="settings-field-stack">
              <label className="settings-field">
                <span className="settings-field__label">Display name</span>
                <SettingsInput
                  icon={User}
                  value={settings.account.name}
                  onChange={(name) => patch({ account: { name } })}
                  placeholder="Your name"
                />
              </label>
            </div>
            <SettingsListCard>
              <SettingsListItem
                title="Profile photo"
                description="Upload a new avatar image"
                action={
                  <SettingsActionButton onClick={() => window.alert('Photo upload coming soon.')}>
                    Change
                  </SettingsActionButton>
                }
              />
              <SettingsListItem
                title="Password"
                description="Update your login password"
                action={
                  <SettingsActionButton
                    variant="primary"
                    onClick={() =>
                      window.alert('Password change will be available when login is connected.')
                    }
                  >
                    Change
                  </SettingsActionButton>
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'game' ? (
          <SettingsPanel title="Game settings" description="Defaults for how games behave.">
            <SettingsListCard>
              <SettingsListItem
                title="Default difficulty"
                description="Starting challenge level"
                action={
                  <SettingsSelect
                    value={settings.game.defaultDifficulty}
                    options={[
                      { value: 'easy', label: 'Easy' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'hard', label: 'Hard' },
                    ]}
                    onChange={(defaultDifficulty) => patch({ game: { defaultDifficulty } })}
                  />
                }
              />
              <SettingsListItem
                title="Timer"
                description="Show countdown during games"
                action={
                  <SettingsToggle
                    label="Timer"
                    checked={settings.game.timerEnabled}
                    onChange={(timerEnabled) => patch({ game: { timerEnabled } })}
                  />
                }
              />
              <SettingsListItem
                title="Sound effects"
                description="Play sounds during gameplay"
                action={
                  <SettingsToggle
                    label="Sound effects"
                    checked={settings.game.soundEffects}
                    onChange={(soundEffects) => patch({ game: { soundEffects } })}
                  />
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'data' ? (
          <SettingsPanel title="Data & progress" description="Manage your learning data.">
            <SettingsListCard>
              <SettingsListItem
                title="Reset progress"
                description="Clears streaks and milestones"
                action={
                  <SettingsActionButton variant="outline" onClick={handleResetProgress}>
                    Reset
                  </SettingsActionButton>
                }
              />
              <SettingsListItem
                title="Export my data"
                description="Download settings as JSON"
                action={
                  <SettingsActionButton variant="primary" onClick={exportUserData}>
                    Export
                  </SettingsActionButton>
                }
              />
            </SettingsListCard>
          </SettingsPanel>
        ) : null}

        {active === 'danger' ? (
          <SettingsPanel title="Delete account" description="Permanently remove your account.">
            <div className="settings-danger-box">
              <p className="settings-danger-box__text">
                Deleting your account removes all projects, progress, and settings permanently.
                This action cannot be undone.
              </p>
              <SettingsActionButton variant="danger" onClick={handleDeleteAccount}>
                Delete account
              </SettingsActionButton>
            </div>
          </SettingsPanel>
        ) : null}
      </div>
    </div>
  )
}
