import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { EncouragementProvider } from './components/encouragement/EncouragementProvider'
import { SettingsModalProvider } from './contexts/SettingsModalContext'
import { HomeApp } from './HomeApp'
import { MyGamePage } from './pages/Home/MyGamePage'
import { BuildPage } from './pages/BuildPage'
import { Dashboard } from './pages/Dashboard'
import { GameOverview } from './pages/GameOverview'
import { GamePlayPage } from './pages/GamePlayPage'
import { ArchivePage } from './pages/Home/ArchivePage'
import { PricingPage } from './pages/Pricing/PricingPage'
import { CheckoutPage } from './pages/Pricing/CheckoutPage'
import { AccountPage } from './pages/Account/AccountPage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { TrashPage } from './pages/Home/TrashPage'
import { FlashcardGamePage } from './games/flashcard'
import { CrosswordPage } from './games/crossword'
export default function App() {
  return (
    <BrowserRouter>
      <SettingsModalProvider>
        <EncouragementProvider>
        <Routes>
        <Route path="/" element={<HomeApp />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pricing/checkout" element={<CheckoutPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/account/profile" element={<Navigate to="/account" replace />} />
        <Route path="/account/shared" element={<Navigate to="/account" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/trash" element={<TrashPage />} />
        <Route path="/mygame" element={<MyGamePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game/:id/overview" element={<GameOverview />} />
        <Route path="/game/:id/play" element={<GamePlayPage />} />
        <Route path="/build/:id" element={<BuildPage />} />
        <Route path="/crossword/:id" element={<CrosswordPage />} />
        <Route path="/play/flashcard/:deckId" element={<FlashcardGamePage />} />
        <Route path="/play/flashcard" element={<FlashcardGamePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </EncouragementProvider>
      </SettingsModalProvider>
    </BrowserRouter>
  )
}
