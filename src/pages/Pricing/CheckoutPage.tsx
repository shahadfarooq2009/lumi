import { useMemo, useState } from 'react'
import { ArrowLeft, Check, ChevronDown, CreditCard, ShieldCheck, Zap } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LumiPageLayout } from '../Home/components/LumiPageLayout'
import { navigateToPage } from '../Home/lib/navigateToPage'
import {
  PRICING_PLANS,
  getPlanPrice,
  parseBillingPeriod,
  parsePlanId,
} from './pricingPlans'
import { PLAN_CREDIT_REWARDS, addCreditsForPlan } from '../../lib/credits'
import { UpgradeCelebration } from './UpgradeCelebration'

const SHADOW_SOFT = 'shadow-[0_8px_24px_-12px_rgba(124,77,255,0.22)]'

function FieldLabel({ children }: { children: string }) {
  return (
    <span className="mb-1.5 block text-[13px] font-semibold text-pricing-muted">{children}</span>
  )
}

function TextField({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-[13px] border bg-white px-3.5 py-3 text-[14.5px] text-pricing-ink outline-none transition-all placeholder:text-pricing-mutedSoft focus:border-[#7C4DFF] focus:ring-2 focus:ring-[#7C4DFF]/15 ${
          error ? 'border-[#FF5C7A]' : 'border-[#ECE7FB]'
        }`}
        style={{ background: '#ffffff', borderColor: error ? '#FF5C7A' : '#ECE7FB' }}
      />
      {error ? <span className="mt-1.5 block text-[13px] font-medium text-[#FF5C7A]">{error}</span> : null}
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="relative block">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-[13px] border border-[#ECE7FB] bg-white px-3.5 py-3 text-[14.5px] text-pricing-ink outline-none transition-all focus:border-[#7C4DFF] focus:ring-2 focus:ring-[#7C4DFF]/15"
        style={{ background: '#ffffff', borderColor: '#ECE7FB' }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-[42px] text-pricing-muted"
        aria-hidden
      />
    </label>
  )
}

function PriceRow({
  label,
  value,
  accent,
  bold,
  featured,
}: {
  label: string
  value: string
  accent?: boolean
  bold?: boolean
  featured?: boolean
}) {
  const labelClass = bold
    ? featured
      ? 'font-bold text-white'
      : 'font-bold text-pricing-ink'
    : featured
      ? 'text-white/75'
      : 'text-pricing-muted'

  const valueClass = bold
    ? featured
      ? 'text-lg font-bold text-white'
      : 'text-lg font-bold text-pricing-ink'
    : accent
      ? featured
        ? 'font-semibold text-[#7DFFB8]'
        : 'font-semibold text-pricing-good'
      : featured
        ? 'text-white'
        : 'text-pricing-ink'

  return (
    <div className="flex items-start justify-between gap-4 text-[14px] leading-snug">
      <span className={labelClass}>{label}</span>
      <span className={`shrink-0 font-oswald ${valueClass}`}>{value}</span>
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const planId = parsePlanId(searchParams.get('plan'))
  const period = parseBillingPeriod(searchParams.get('period'))
  const plan = PRICING_PLANS[planId]

  const [fullName, setFullName] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('United States')
  const [postalError, setPostalError] = useState<string | undefined>()
  const [formError, setFormError] = useState<string | undefined>()
  const [celebration, setCelebration] = useState<{
    fromCredits: number
    toCredits: number
    reward: number
  } | null>(null)

  const pricing = useMemo(() => {
    const subscription = getPlanPrice(plan, period)
    const hasTrial = plan.trialDays && planId !== 'free' && subscription > 0
    const promotion = hasTrial ? subscription : 0
    const dueToday = Math.max(subscription - promotion, 0)

    return {
      subscription,
      promotion,
      dueToday,
      hasTrial,
      periodLabel: period === 'yearly' ? 'Annual subscription' : 'Monthly subscription',
    }
  }, [plan, period, planId])

  const requiresPayment = planId !== 'free' && pricing.subscription > 0
  const isPro = planId === 'pro'

  const creditReward = PLAN_CREDIT_REWARDS[planId]

  const validateForm = () => {
    if (!fullName.trim()) return 'Please enter your full name.'
    if (!address1.trim()) return 'Please enter your address.'
    if (!city.trim()) return 'Please enter your city.'
    if (!region.trim()) return 'Please enter your region.'
    if (!postalCode.trim() || !/^[a-zA-Z0-9\s-]{3,10}$/.test(postalCode.trim())) {
      setPostalError('Your postal code is invalid.')
      return 'Please fix your postal code.'
    }
    setPostalError(undefined)
    return undefined
  }

  const handleSubscribe = () => {
    const error = validateForm()
    if (error) {
      setFormError(error)
      return
    }

    setFormError(undefined)
    const { previous, next, reward } = addCreditsForPlan(planId)
    setCelebration({ fromCredits: previous, toCredits: next, reward })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    handleSubscribe()
  }

  const ctaLabel =
    planId === 'free'
      ? 'Get started free'
      : pricing.hasTrial
        ? 'Start free trial'
        : 'Subscribe'

  return (
    <LumiPageLayout
      activePage="pricing"
      onNavigate={(page) => navigateToPage(navigate, page)}
      contentClassName="font-body text-pricing-ink2 !pt-28 sm:!pt-32 lg:!pt-40"
      enableSpotlight={false}
    >
      <div className="mx-auto max-w-[1080px] pb-16 pt-4 sm:pt-6">
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(`/pricing?period=${period}`)}
              aria-label="Back to pricing"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#ECE7FB] bg-white text-pricing-ink transition-all hover:border-[#B388FF] hover:text-[#7C4DFF]"
              style={{ background: '#ffffff', borderColor: '#ECE7FB' }}
            >
              <ArrowLeft size={16} strokeWidth={2.25} />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-pricing-line bg-white px-3.5 py-[7px] text-[12.5px] font-bold tracking-[0.3px] text-pricing-primary">
              <ShieldCheck size={14} strokeWidth={2.5} />
              SECURE CHECKOUT
            </div>
          </div>
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.03em] text-pricing-ink">
            {plan.checkoutTitle}
          </h1>
          <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-pricing-muted">
            Complete your details below. You can cancel anytime from your account settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          <form
            className={`space-y-6 rounded-[28px] border border-pricing-line bg-white p-6 sm:p-8 ${SHADOW_SOFT}`}
            style={{ background: '#ffffff' }}
            onSubmit={handleSubmit}
            noValidate
          >
            {requiresPayment ? (
              <section>
                <h2 className="mb-4 font-display text-[17px] font-extrabold text-pricing-ink">
                  Payment method
                </h2>
                <div
                  className="flex items-center justify-between rounded-[16px] border px-4 py-4"
                  style={{ background: '#F7F7FF', borderColor: '#ECE7FB' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-xl text-white"
                      style={{ background: 'linear-gradient(135deg, #7C4DFF, #9A6BFF)' }}
                    >
                      <CreditCard size={18} strokeWidth={2.25} />
                    </div>
                    <div>
                      <div className="text-[14.5px] font-bold text-pricing-ink">Visa Platinum</div>
                      <div className="text-[13px] text-pricing-muted">•••• 3046</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-[13.5px] font-bold text-[#7C4DFF] transition-opacity hover:opacity-80"
                  >
                    Change
                  </button>
                </div>
              </section>
            ) : (
              <div
                className="flex items-start gap-3 rounded-[16px] border px-4 py-4"
                style={{ background: '#F7F7FF', borderColor: '#ECE7FB' }}
              >
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#D1FAE5] text-[#059669]">
                  <Check size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-[14.5px] font-bold text-pricing-ink">No payment required</div>
                  <div className="text-[13px] leading-relaxed text-pricing-muted">
                    The Free plan doesn&apos;t need a card. Just confirm your billing region.
                  </div>
                </div>
              </div>
            )}

            <section>
              <h2 className="mb-4 font-display text-[17px] font-extrabold text-pricing-ink">
                Billing address
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <TextField label="Full name" value={fullName} onChange={setFullName} />
                </div>
                <div className="sm:col-span-2">
                  <TextField label="Address line 1" value={address1} onChange={setAddress1} />
                </div>
                <div className="sm:col-span-2">
                  <TextField
                    label="Address line 2"
                    value={address2}
                    onChange={setAddress2}
                    placeholder="Optional"
                  />
                </div>
                <TextField label="City" value={city} onChange={setCity} />
                <TextField label="Region" value={region} onChange={setRegion} />
                <TextField
                  label="Postal code"
                  value={postalCode}
                  onChange={(value) => {
                    setPostalCode(value)
                    if (postalError) setPostalError(undefined)
                  }}
                  error={postalError}
                />
                <SelectField
                  label="Country or region"
                  value={country}
                  onChange={setCountry}
                  options={[
                    'United States',
                    'United Kingdom',
                    'Canada',
                    'Saudi Arabia',
                    'United Arab Emirates',
                  ]}
                />
              </div>
            </section>

            {formError ? (
              <p className="rounded-[13px] border border-[#FF5C7A]/30 bg-[#FFF5F7] px-3.5 py-2.5 text-[13px] font-medium text-[#FF5C7A]">
                {formError}
              </p>
            ) : null}

            <button type="submit" className="pricing-tier-cta-primary hidden lg:flex">
              {planId !== 'free' && pricing.hasTrial ? <Zap size={15} fill="currentColor" /> : null}
              {ctaLabel}
            </button>
          </form>

          <aside className="lg:pt-0">
            <div
              className={`sticky top-28 overflow-hidden rounded-[28px] p-6 sm:p-7 ${SHADOW_SOFT} ${
                isPro ? 'pricing-tier-pro border-transparent text-white' : 'border-pricing-line bg-white'
              }`}
            >
              {isPro ? (
                <>
                  <div className="pricing-tier-pro__grid" aria-hidden />
                  <div className="pricing-tier-pro__shine" aria-hidden />
                </>
              ) : null}

              <div className="relative z-[1]">
                <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.12em]">
                  <span className={isPro ? 'text-white/55' : 'text-pricing-mutedSoft'}>
                    Your plan
                  </span>
                </div>
                <h2
                  className={`mb-5 font-display text-[26px] font-extrabold tracking-[-0.02em] ${
                    isPro ? 'text-white' : 'text-pricing-ink'
                  }`}
                >
                  {plan.name}
                </h2>

                <div className="mb-5">
                  <div
                    className={`mb-3 text-[12px] font-bold uppercase tracking-[0.1em] ${
                      isPro ? 'text-white/55' : 'text-pricing-mutedSoft'
                    }`}
                  >
                    What&apos;s included
                  </div>
                  <ul className="m-0 space-y-2.5 p-0">
                    {plan.checkoutFeatures.map((feature) => (
                      <li
                        key={feature.text}
                        className={`flex items-start gap-2.5 text-[14px] leading-snug ${
                          isPro ? 'text-white/90' : 'text-pricing-ink2'
                        }`}
                      >
                        <Check
                          size={16}
                          strokeWidth={2.5}
                          className={`mt-0.5 shrink-0 ${isPro ? 'text-white' : 'text-pricing-good'}`}
                        />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`space-y-2.5 border-t pt-4 ${isPro ? 'border-white/15' : 'border-[#ECE7FB]'}`}
                >
                  <PriceRow
                    label={pricing.periodLabel}
                    value={`$${pricing.subscription.toFixed(2)}`}
                    featured={isPro}
                  />
                  {pricing.hasTrial && plan.promotionLabel ? (
                    <PriceRow
                      label={plan.promotionLabel}
                      value={`-$${pricing.promotion.toFixed(2)}`}
                      accent
                      featured={isPro}
                    />
                  ) : null}
                  <PriceRow label="VAT (0%)" value="$0.00" featured={isPro} />
                  <PriceRow
                    label="Due today"
                    value={`$${pricing.dueToday.toFixed(2)}`}
                    bold
                    featured={isPro}
                  />
                  <div
                    className={`mt-3 rounded-[13px] border px-3.5 py-2.5 text-[13px] leading-snug ${
                      isPro
                        ? 'border-white/20 bg-white/10 text-white/90'
                        : 'border-[#ECE7FB] bg-[#F7F7FF] text-pricing-muted'
                    }`}
                    style={isPro ? undefined : { background: '#F7F7FF', borderColor: '#ECE7FB' }}
                  >
                    Complete checkout to earn{' '}
                    <strong className={isPro ? 'text-white' : 'text-pricing-ink'}>
                      +{creditReward} credits
                    </strong>
                    .
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubscribe}
                  className={
                    isPro
                      ? 'mt-5 flex w-full items-center justify-center gap-2 rounded-[13px] bg-white py-3.5 text-[14.5px] font-bold text-[#7C4DFF] shadow-[0_14px_28px_-10px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5'
                      : 'pricing-tier-cta-primary mt-5'
                  }
                >
                  {planId !== 'free' && pricing.hasTrial ? (
                    <Zap size={15} fill={isPro ? '#7C4DFF' : 'currentColor'} />
                  ) : null}
                  {ctaLabel}
                </button>

                <p
                  className={`mt-4 text-[12px] leading-relaxed ${
                    isPro ? 'text-white/75' : 'text-pricing-muted'
                  }`}
                >
                  By continuing, you agree to our{' '}
                  <a href="#" className={`font-semibold underline underline-offset-2 ${isPro ? 'text-white' : 'text-[#7C4DFF]'}`}>
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="#" className={`font-semibold underline underline-offset-2 ${isPro ? 'text-white' : 'text-[#7C4DFF]'}`}>
                    Privacy Policy
                  </a>
                  . Cancel anytime.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <UpgradeCelebration
        open={celebration !== null}
        planId={planId}
        fromCredits={celebration?.fromCredits ?? 0}
        toCredits={celebration?.toCredits ?? 0}
        reward={celebration?.reward ?? PLAN_CREDIT_REWARDS[planId]}
        onContinue={() => {
          setCelebration(null)
          navigate('/')
        }}
      />
    </LumiPageLayout>
  )
}
