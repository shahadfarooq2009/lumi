import { useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  GraduationCap,
  Plus,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LumiPageLayout } from '../Home/components/LumiPageLayout'
import { navigateToPage } from '../Home/lib/navigateToPage'
import { parseBold } from '../Home/components/pricing/parseBold'
import type { PlanId } from './pricingPlans'

type Period = 'monthly' | 'yearly'

function planIdFromTierName(name: string): PlanId {
  if (name === 'Pro') return 'pro'
  if (name === 'Classroom') return 'classroom'
  return 'free'
}

type Tier = {
  name: string
  tagline: string
  icon: LucideIcon
  priceMonthly: number
  priceYearly: number
  priceSuffix: string
  featured?: boolean
  cta: { label: string; variant: 'ghost' | 'primary'; icon?: LucideIcon }
  description: ReactNode | ((period: Period, featured?: boolean) => ReactNode)
  sectionLabel: string
  features: string[]
  iconVariant?: 'default' | 'featured' | 'classroom'
}

const SHADOW_SOFT = 'shadow-[0_8px_24px_-12px_rgba(124,77,255,0.22)]'

const TIERS: Tier[] = [
  {
    name: 'Free',
    tagline: 'Try it out, no card needed',
    icon: Sparkles,
    priceMonthly: 0,
    priceYearly: 0,
    priceSuffix: 'forever',
    cta: { label: 'Get started free', variant: 'ghost' },
    description: 'For curious learners getting started',
    sectionLabel: "WHAT'S INCLUDED",
    features: [
      '**3 projects** per month',
      'Files up to **10 pages**',
      'Access to **4 game modes**',
      'Basic AI question generation',
      'Personal leaderboard',
    ],
  },
  {
    name: 'Pro',
    tagline: 'For dedicated learners',
    icon: Zap,
    priceMonthly: 12,
    priceYearly: 9,
    priceSuffix: 'month',
    featured: true,
    cta: { label: 'Start 7-day free trial', variant: 'primary', icon: Zap },
    description: (period, featured) =>
      period === 'yearly' ? (
        <>
          Billed annually · save{' '}
          <strong className={`font-bold ${featured ? 'text-[#7DFFB8]' : 'text-pricing-good'}`}>
            $36
          </strong>
        </>
      ) : (
        'Billed monthly · cancel anytime'
      ),
    sectionLabel: 'EVERYTHING IN FREE, PLUS',
    features: [
      '**Unlimited projects**',
      'Files up to **200 pages**',
      '**All 8 game modes**',
      'Advanced AI · GPT-grade quality',
      'YouTube & web link imports',
      'Priority generation queue',
      'Export & share with classmates',
    ],
    iconVariant: 'featured',
  },
  {
    name: 'Classroom',
    tagline: 'For teachers & teams',
    icon: GraduationCap,
    priceMonthly: 29,
    priceYearly: 23,
    priceSuffix: 'month',
    cta: { label: 'Talk to sales', variant: 'ghost' },
    description: <>Up to {parseBold('**30 seats**')} included</>,
    sectionLabel: 'EVERYTHING IN PRO, PLUS',
    features: [
      '**30 student seats**',
      'Class leaderboards & analytics',
      'Live multiplayer sessions',
      'Assignments & due dates',
      'Google Classroom integration',
      'Dedicated success manager',
      'SOC 2 + FERPA compliant',
    ],
    iconVariant: 'classroom',
  },
]

const FAQ_ITEMS = [
  {
    question: 'Can I cancel anytime?',
    answer:
      "Yes — cancel any time from your account settings. You'll keep access until the end of your billing period, and you won't be charged again. No fine print, no awkward exit interviews.",
  },
  {
    question: 'How does the free trial work?',
    answer:
      "All Pro features are unlocked for 7 days, no card needed to start. We'll remind you a couple of days before the trial ends — if you don't upgrade, your account simply rolls back to Free.",
  },
  {
    question: 'Do you offer a student discount?',
    answer:
      'Verified students get 50% off Pro. Sign up with your school email and the discount applies automatically at checkout. We verify through SheerID — takes about 30 seconds.',
  },
  {
    question: 'What file types can I upload?',
    answer:
      "PDF, DOCX, PPTX, and plain text on every plan. Pro and Classroom also accept YouTube links, web URLs, and Google Docs. We're adding audio transcripts and EPUB soon.",
  },
  {
    question: 'Can I switch plans later?',
    answer:
      'Of course. Upgrades take effect immediately and we prorate the difference. Downgrades kick in at your next billing cycle, so you keep paid features until then.',
  },
  {
    question: 'What happens to my projects if I downgrade?',
    answer:
      "Nothing gets deleted. Your projects stay safe — you just won't be able to create new ones beyond the free limit, and Pro-only game modes become read-only until you upgrade again.",
  },
  {
    question: 'Do you offer school or district licenses?',
    answer:
      'Yes. For 100+ seats, our team can put together a custom quote with district-wide SSO, admin dashboards, and procurement-friendly billing. Reach out via the Talk to sales button.',
  },
]

function CheckTile({ featured = false }: { featured?: boolean }) {
  if (featured) {
    return <Check size={16} className="mt-0.5 shrink-0 text-white" strokeWidth={2.5} />
  }
  return <Check size={16} className="mt-0.5 shrink-0 text-pricing-good" strokeWidth={2.5} />
}

function TierIcon({
  icon: Icon,
  variant,
}: {
  icon: LucideIcon
  variant: 'default' | 'featured' | 'classroom'
}) {
  const iconClass =
    variant === 'featured'
      ? 'pricing-tier-icon--pro'
      : variant === 'classroom'
        ? 'pricing-tier-icon--classroom'
        : 'pricing-tier-icon--free'

  return (
    <div className={`pricing-tier-icon ${iconClass}`}>
      <Icon size={22} strokeWidth={2.25} fill={variant === 'featured' ? 'currentColor' : 'none'} />
    </div>
  )
}

function Hero({
  period,
  setPeriod,
}: {
  period: Period
  setPeriod: (p: Period) => void
}) {
  return (
    <section className="pricing-hero relative pb-[50px] pt-[60px] text-center max-[740px]:pb-9 max-[740px]:pt-10">
      <div className="pricing-hero__glow" aria-hidden />
      <div className="relative z-[1]">
      <div
        className={`mb-[22px] inline-flex items-center gap-2 rounded-full border border-pricing-line bg-pricing-surface px-3.5 py-[7px] text-[12.5px] font-bold tracking-[0.3px] text-pricing-primary ${SHADOW_SOFT}`}
      >
        <Zap size={14} strokeWidth={2.5} />
        SIMPLE PRICING · NO HIDDEN FEES
      </div>

      <h1 className="mx-auto mb-[18px] max-w-[720px] font-display text-[60px] font-extrabold leading-[1.05] tracking-[-0.035em] text-pricing-ink max-[740px]:text-[40px] max-[740px]:tracking-[-0.03em]">
        Pick the plan that fits
        <br />
        <span className="bg-gradient-to-r from-[#7C4DFF] to-[#B388FF] bg-clip-text text-transparent">
          how you learn
        </span>
        .
      </h1>

      <p className="mx-auto mb-9 max-w-[560px] text-[18px] leading-[1.55] text-pricing-muted max-[740px]:text-base">
        Start free. Upgrade when you need more games, longer files, or want to bring your class
        along for the ride.
      </p>

      <div
        className={`inline-flex items-center gap-0 rounded-full border border-[#ECE7FB] bg-white p-[5px] ${SHADOW_SOFT}`}
      >
        <button
          type="button"
          onClick={() => setPeriod('monthly')}
          style={
            period === 'monthly'
              ? {
                  background: 'linear-gradient(135deg, #7C4DFF, #9A6BFF)',
                  boxShadow: '0 6px 14px -4px rgba(124, 77, 255, 0.55)',
                  color: '#ffffff',
                }
              : { background: 'transparent', color: '#6B6585' }
          }
          className="rounded-full px-[22px] py-[9px] text-[13.5px] font-bold transition-all duration-250 hover:opacity-90"
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setPeriod('yearly')}
          style={
            period === 'yearly'
              ? {
                  background: 'linear-gradient(135deg, #7C4DFF, #9A6BFF)',
                  boxShadow: '0 6px 14px -4px rgba(124, 77, 255, 0.55)',
                  color: '#ffffff',
                }
              : { background: 'transparent', color: '#6B6585' }
          }
          className="flex items-center gap-2 rounded-full px-[18px] py-[9px] text-[13.5px] font-bold transition-all duration-250 hover:opacity-90"
        >
          Yearly
          <span
            className={`rounded-full px-[7px] py-0.5 text-[10.5px] font-bold tracking-[0.3px] transition-colors ${
              period === 'yearly'
                ? 'bg-white/20 text-white'
                : 'bg-[#D1FAE5] text-[#059669]'
            }`}
          >
            SAVE 20%
          </span>
        </button>
      </div>
      </div>
    </section>
  )
}

function TierCard({
  tier,
  period,
  onSelect,
}: {
  tier: Tier
  period: Period
  onSelect: () => void
}) {
  const price = period === 'yearly' ? tier.priceYearly : tier.priceMonthly
  const Icon = tier.icon
  const CtaIcon = tier.cta.icon
  const featured = Boolean(tier.featured)
  const description =
    typeof tier.description === 'function'
      ? tier.description(period, featured)
      : tier.description

  const boldClass = featured ? 'font-bold text-white' : 'font-bold text-pricing-ink'

  const iconVariant = tier.iconVariant ?? 'default'
  const nameClass = featured ? 'text-white' : 'text-pricing-ink'
  const taglineClass = featured ? 'text-white/75' : 'text-pricing-muted'
  const priceNumClass = featured ? 'text-white' : 'text-pricing-ink'
  const priceSuffixClass = featured ? 'text-white/75' : 'text-pricing-muted'
  const descClass = featured ? 'text-white/75' : 'text-pricing-muted'
  const sectionLabelClass = featured ? 'text-white/55' : 'text-pricing-mutedSoft'
  const featureTextClass = featured ? 'text-white/90' : 'text-pricing-ink2'
  const dividerClass = featured ? 'border-white/15' : 'border-pricing-line'

  const cardContent = (
    <>
      <div className="flex items-center gap-3.5">
        <TierIcon icon={Icon} variant={featured ? 'featured' : iconVariant} />
        <div>
          <div className={`font-display text-lg font-extrabold ${nameClass}`}>{tier.name}</div>
          <div className={`text-[12.5px] font-medium ${taglineClass}`}>{tier.tagline}</div>
        </div>
      </div>

      <div className="mt-0.5 flex items-end gap-0.5 font-oswald">
        <span className={`text-[52px] font-bold leading-none tracking-[-0.02em] ${priceNumClass}`}>$</span>
        <span
          className={`text-[52px] font-bold leading-none tracking-[-0.02em] ${priceNumClass}`}
        >
          {price}
        </span>
        <span className={`mb-1.5 text-sm font-medium ${priceSuffixClass}`}>
          /{tier.priceSuffix}
        </span>
      </div>

      <div className={`-mt-1 text-[12.5px] ${descClass}`}>{description}</div>

      {!featured && tier.cta.variant === 'ghost' ? (
        <button type="button" className="pricing-tier-cta-ghost" onClick={onSelect}>
          {tier.cta.label}
          <ArrowRight size={16} strokeWidth={2.25} />
        </button>
      ) : (
        <button
          type="button"
          className={`pricing-tier-cta-primary${featured ? ' pricing-tier-cta-primary--featured' : ''}`}
          onClick={onSelect}
        >
          {CtaIcon ? <CtaIcon size={15} fill="currentColor" /> : null}
          {tier.cta.label}
        </button>
      )}

      <div className={`mt-auto flex flex-1 flex-col border-t pt-[18px] ${dividerClass}`}>
        <div className={`text-xs font-bold tracking-[0.1em] ${sectionLabelClass}`}>
          {tier.sectionLabel}
        </div>
        <ul className="m-0 mt-2.5 flex flex-1 flex-col gap-2.5 p-0">
          {tier.features.map((feature) => (
            <li key={feature} className={`flex items-start gap-2.5 text-sm leading-snug ${featureTextClass}`}>
              <CheckTile featured={featured} />
              <span>{parseBold(feature, boldClass)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  if (featured) {
    return (
      <div className="relative z-[1] flex h-full scale-[1.04] transition-transform max-[1000px]:scale-100">
        <div className="pricing-tier-pro relative flex h-full w-full flex-col gap-4 overflow-visible rounded-[28px] p-8 transition-transform hover:-translate-y-1">
          <div className="pricing-popular-badge pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
            <span className="pricing-popular-badge__icon">
              <Sparkles size={10} fill="currentColor" strokeWidth={0} />
            </span>
            Most popular
          </div>
          <div className="pricing-tier-pro__badge-glow" aria-hidden />
          <div className="pricing-tier-pro__grid overflow-hidden rounded-[28px]" aria-hidden />
          <div className="pricing-tier-pro__shine overflow-hidden rounded-[28px]" aria-hidden />
          <div className="relative z-[1] flex h-full flex-col gap-4">{cardContent}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative z-[2] isolate flex h-full flex-col gap-4 rounded-[28px] border border-pricing-line bg-white p-8 transition-transform hover:-translate-y-1 dark:bg-[#1a1628] ${SHADOW_SOFT}`}
    >
      {cardContent}
    </div>
  )
}

function PricingGrid({ period }: { period: Period }) {
  const navigate = useNavigate()

  return (
    <section className="relative z-[2] grid grid-cols-3 items-stretch gap-5 py-10 max-[1000px]:mx-auto max-[1000px]:max-w-[480px] max-[1000px]:grid-cols-1">
      {TIERS.map((tier) => (
        <TierCard
          key={tier.name}
          tier={tier}
          period={period}
          onSelect={() =>
            navigate(`/pricing/checkout?plan=${planIdFromTierName(tier.name)}&period=${period}`)
          }
        />
      ))}
    </section>
  )
}

function TrustStrip() {
  const chips = [
    '7-day free trial',
    'Cancel anytime',
    'Secure payments',
    'Student discount available',
  ]

  return (
    <div className="pb-[60px] pt-7 text-center text-sm text-pricing-muted">
      <div>
        Trusted by <strong className="text-pricing-ink">12,000+</strong> students and teachers
      </div>
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-6">
        {chips.map((label) => (
          <span key={label} className="flex items-center gap-1.5">
            <Check size={14} className="text-pricing-good" strokeWidth={2.5} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`relative z-[2] overflow-hidden rounded-2xl border bg-white dark:bg-[#1a1628] ${SHADOW_SOFT} transition-colors ${
        isOpen ? 'border-[rgba(124,77,255,0.25)]' : 'border-pricing-line'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full cursor-pointer items-center justify-between gap-[18px] bg-transparent px-6 py-5 text-left text-[15.5px] font-bold text-pricing-ink"
      >
        {question}
        <span
          className={`grid h-[30px] w-[30px] shrink-0 place-items-center rounded-xl transition-all ${
            isOpen
              ? 'bg-gradient-to-br from-pricing-primary to-pricing-primaryDeep text-white'
              : 'bg-pricing-bgSoft text-pricing-primary'
          }`}
        >
          <Plus
            size={14}
            className={`transition-transform duration-250 ${isOpen ? 'rotate-45' : ''}`}
          />
        </span>
      </button>
      <div
        className={`overflow-hidden px-6 text-[14.5px] leading-relaxed text-pricing-muted transition-[max-height] duration-350 ease-in-out ${
          isOpen ? 'max-h-60 pb-[22px]' : 'max-h-0'
        }`}
      >
        {answer}
      </div>
    </div>
  )
}

function FAQ({
  openIndex,
  setOpenIndex,
}: {
  openIndex: number | null
  setOpenIndex: (i: number | null) => void
}) {
  return (
    <section className="py-[60px] max-[740px]:py-10">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="font-display text-[38px] font-extrabold tracking-tight text-pricing-ink max-[740px]:text-[28px]">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-base leading-relaxed text-pricing-muted">
          Still curious? We&apos;ve got answers. Anything else, just ping us.
        </p>
      </div>
      <div className="mx-auto flex max-w-[760px] flex-col gap-3">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem
            key={item.question}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </section>
  )
}

function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="pricing-final-cta relative z-[2] w-screen left-1/2 -translate-x-1/2 pb-[90px]">
      <div className="pricing-final-cta__panel">
        <div className="pricing-final-cta__grid" aria-hidden />
        <div className="pricing-final-cta__glow" aria-hidden />
        <div className="pricing-final-cta__inner">
          <div className="pricing-final-cta__layout">
            <div className="pricing-final-cta__copy">
              <span className="pricing-final-cta__badge">Get started</span>
              <h2 className="pricing-final-cta__title font-display">
                <span className="text-white">Start free.</span>{' '}
                <span className="pricing-final-cta__accent">Upgrade when you&apos;re ready.</span>
              </h2>
              <p className="pricing-final-cta__sub">
                Join 12,000+ learners turning notes into games. Create your first quiz in under a
                minute — no credit card required.
              </p>
              <button
                type="button"
                onClick={() => navigate('/pricing/checkout?plan=free&period=monthly')}
                className="pricing-final-cta__button"
              >
                <Zap size={15} fill="currentColor" />
                Start free
              </button>
              <p className="pricing-final-cta__note">Free forever · Cancel anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingFooter() {
  const links = ['Privacy', 'Terms', 'Contact', 'Status']

  return (
    <footer className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3.5 border-t border-pricing-line px-5 py-8 text-[13px] text-pricing-muted sm:px-10 max-[740px]:flex-col max-[740px]:text-center">
      <div>© 2026 Lumi. Made for curious minds.</div>
      <div className="flex flex-wrap gap-[22px] max-[740px]:justify-center">
        {links.map((link) => (
          <a key={link} href="#" className="transition-colors hover:text-pricing-primary">
            {link}
          </a>
        ))}
      </div>
    </footer>
  )
}

export function PricingPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<Period>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <LumiPageLayout
      activePage="pricing"
      onNavigate={(page) => navigateToPage(navigate, page)}
      contentClassName="font-body text-pricing-ink2"
    >
      <div className="mx-auto max-w-[1200px]">
        <Hero period={period} setPeriod={setPeriod} />
        <PricingGrid period={period} />
        <TrustStrip />
        <FAQ openIndex={openFaq} setOpenIndex={setOpenFaq} />
      </div>
      <FinalCTA />
      <PricingFooter />
    </LumiPageLayout>
  )
}
