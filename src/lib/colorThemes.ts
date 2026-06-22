import type { ColorTheme } from './userSettings'

export type ColorThemeTokens = {
  brand: string
  brandLight: string
  brandSoft: string
  brandSofter: string
  brandDeep: string
  brandRgb: string
  lumiPrimary: string
  lumiPrimary2: string
  lumiSecondary: string
  lumiSoft: string
  lumiSoft2: string
  pricingPrimary: string
  pricingPrimaryDeep: string
  pricingSecondary: string
  pricingAccent: string
  pricingBg: string
  pricingBgSoft: string
  pricingLine: string
  settingsAccent: string
  settingsAccentSoft: string
  settingsAccentBorder: string
}

export const COLOR_THEME_TOKENS: Record<ColorTheme, ColorThemeTokens> = {
  purple: {
    brand: '#7c4dff',
    brandLight: '#b388ff',
    brandSoft: '#f3eeff',
    brandSofter: '#f8f5ff',
    brandDeep: '#5b2fd9',
    brandRgb: '124, 77, 255',
    lumiPrimary: '#7c4dff',
    lumiPrimary2: '#9a6bff',
    lumiSecondary: '#b388ff',
    lumiSoft: '#f1edff',
    lumiSoft2: '#f8f5ff',
    pricingPrimary: '#7c4dff',
    pricingPrimaryDeep: '#9a6bff',
    pricingSecondary: '#b388ff',
    pricingAccent: '#e9deff',
    pricingBg: '#f7f7ff',
    pricingBgSoft: '#efebff',
    pricingLine: '#ece7fb',
    settingsAccent: '#7c4dff',
    settingsAccentSoft: '#f3eeff',
    settingsAccentBorder: '#c4b5fd',
  },
  blue: {
    brand: '#2563eb',
    brandLight: '#60a5fa',
    brandSoft: '#eff6ff',
    brandSofter: '#f0f9ff',
    brandDeep: '#1d4ed8',
    brandRgb: '37, 99, 235',
    lumiPrimary: '#2563eb',
    lumiPrimary2: '#3b82f6',
    lumiSecondary: '#60a5fa',
    lumiSoft: '#eff6ff',
    lumiSoft2: '#f0f9ff',
    pricingPrimary: '#2563eb',
    pricingPrimaryDeep: '#3b82f6',
    pricingSecondary: '#60a5fa',
    pricingAccent: '#dbeafe',
    pricingBg: '#f8fbff',
    pricingBgSoft: '#eff6ff',
    pricingLine: '#dbeafe',
    settingsAccent: '#2563eb',
    settingsAccentSoft: '#eff6ff',
    settingsAccentBorder: '#93c5fd',
  },
  pink: {
    brand: '#ec4899',
    brandLight: '#f472b6',
    brandSoft: '#fdf2f8',
    brandSofter: '#fff1f2',
    brandDeep: '#db2777',
    brandRgb: '236, 72, 153',
    lumiPrimary: '#ec4899',
    lumiPrimary2: '#f472b6',
    lumiSecondary: '#fb7185',
    lumiSoft: '#fdf2f8',
    lumiSoft2: '#fff1f2',
    pricingPrimary: '#ec4899',
    pricingPrimaryDeep: '#f472b6',
    pricingSecondary: '#fb7185',
    pricingAccent: '#fce7f3',
    pricingBg: '#fff8fc',
    pricingBgSoft: '#fdf2f8',
    pricingLine: '#fce7f3',
    settingsAccent: '#ec4899',
    settingsAccentSoft: '#fdf2f8',
    settingsAccentBorder: '#f9a8d4',
  },
}

export function applyColorTheme(theme: ColorTheme) {
  const root = document.documentElement
  const tokens = COLOR_THEME_TOKENS[theme]

  root.dataset.lumiColorTheme = theme

  root.style.setProperty('--brand', tokens.brand)
  root.style.setProperty('--brand-light', tokens.brandLight)
  root.style.setProperty('--brand-soft', tokens.brandSoft)
  root.style.setProperty('--brand-softer', tokens.brandSofter)
  root.style.setProperty('--brand-deep', tokens.brandDeep)
  root.style.setProperty('--brand-rgb', tokens.brandRgb)

  root.style.setProperty('--lumi-primary', tokens.lumiPrimary)
  root.style.setProperty('--lumi-primary-2', tokens.lumiPrimary2)
  root.style.setProperty('--lumi-secondary', tokens.lumiSecondary)
  root.style.setProperty('--lumi-soft', tokens.lumiSoft)
  root.style.setProperty('--lumi-soft-2', tokens.lumiSoft2)
  root.style.setProperty('--lumi-purple', tokens.lumiPrimary)
  root.style.setProperty('--lumi-purple-light', tokens.lumiPrimary2)
  root.style.setProperty('--lumi-purple-pink', tokens.lumiSecondary)

  root.style.setProperty('--pricing-primary', tokens.pricingPrimary)
  root.style.setProperty('--pricing-primary-deep', tokens.pricingPrimaryDeep)
  root.style.setProperty('--pricing-secondary', tokens.pricingSecondary)
  root.style.setProperty('--pricing-accent', tokens.pricingAccent)
  root.style.setProperty('--pricing-bg', tokens.pricingBg)
  root.style.setProperty('--pricing-bg-soft', tokens.pricingBgSoft)
  root.style.setProperty('--pricing-line', tokens.pricingLine)

  root.style.setProperty('--settings-accent', tokens.settingsAccent)
  root.style.setProperty('--settings-accent-soft', tokens.settingsAccentSoft)
  root.style.setProperty('--settings-accent-border', tokens.settingsAccentBorder)

  root.style.setProperty('--shadow-glow', `0 8px 28px -6px rgba(${tokens.brandRgb}, 0.32)`)
  root.style.setProperty('--shadow-lg', `0 12px 32px -8px rgba(${tokens.brandRgb}, 0.18)`)
}
