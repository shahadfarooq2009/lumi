import { Check } from 'lucide-react'

export type StepStatus = 'done' | 'active' | 'pending'

export interface GenerationStep {
  id: string
  title: string
  subtitle: string
}

export interface StepAnimState {
  greenThrough: number
  growingLineAfter: number | null
  activeIndex: number | null
  allDone: boolean
}

interface GenerationStepperProps {
  steps: GenerationStep[]
  anim: StepAnimState
}

type ConnectorMode = 'empty' | 'growing' | 'full'

function StepConnector({ mode }: { mode: ConnectorMode }) {
  return (
    <div className="lumi-stepper-line my-1 min-h-[36px] flex-1" aria-hidden>
      <div
        className={`lumi-stepper-line-fill ${
          mode === 'full' ? 'lumi-stepper-line-fill--full' : mode === 'growing' ? 'is-animating' : ''
        }`}
      />
    </div>
  )
}

function StepCircle({ id, status }: { id: string; status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#22C58B] text-white lumi-step-circle-done">
        <Check size={15} strokeWidth={3} />
      </div>
    )
  }

  if (status === 'active') {
    return (
      <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center">
        <span className="lumi-step-halo pointer-events-none absolute inset-0 rounded-full" aria-hidden />
        <div className="relative grid h-9 w-9 place-items-center rounded-full border-2 border-[#7C4DFF] bg-white font-display text-[11px] font-bold text-[#7C4DFF]">
          {id}
        </div>
      </div>
    )
  }

  return (
    <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] bg-white font-display text-[11px] font-semibold text-[#C4C0D4]">
      {id}
    </div>
  )
}

function getCircleStatus(index: number, anim: StepAnimState): StepStatus {
  if (anim.allDone || index <= anim.greenThrough) return 'done'
  if (anim.activeIndex === index) return 'active'
  return 'pending'
}

function getConnectorMode(index: number, anim: StepAnimState, total: number): ConnectorMode {
  if (index >= total - 1) return 'empty'
  if (anim.allDone || index < anim.greenThrough) return 'full'
  if (anim.growingLineAfter === index) return 'growing'
  return 'empty'
}

export function GenerationStepper({ steps, anim }: GenerationStepperProps) {
  return (
    <div>
      <ol className="m-0 list-none p-0">
        {steps.map((step, index) => {
          const status = getCircleStatus(index, anim)
          const isLast = index === steps.length - 1
          const connectorMode = getConnectorMode(index, anim, steps.length)

          return (
            <li key={step.id} className="flex gap-4">
              <div className="flex w-9 shrink-0 flex-col items-center">
                <StepCircle id={step.id} status={status} />
                {!isLast ? (
                  <StepConnector
                    key={`${step.id}-${anim.greenThrough}-${anim.growingLineAfter}`}
                    mode={connectorMode}
                  />
                ) : null}
              </div>

              <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-5'}`}>
                <p
                  className={`m-0 text-[14px] font-semibold leading-snug ${
                    status === 'pending' ? 'text-[#9B94B0]' : 'text-[#1B1530]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="m-0 mt-1 text-[13px] leading-relaxed text-[#9B94B0]">{step.subtitle}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
