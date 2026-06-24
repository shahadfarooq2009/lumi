import type { ReactNode } from 'react'

interface FlashcardContainerProps {
  children: ReactNode
  contentKey?: string
  fadeClass?: string
  variant?: 'generating' | 'default'
}

export function FlashcardContainer({
  children,
  contentKey,
  fadeClass = '',
  variant = 'default',
}: FlashcardContainerProps) {
  return (
    <div className="fc-card-wrap">
      <div className="fc-card-area">
        <div className="fc-card-motion">
          <div className="fc-card fc-card--state">
            <div className="fc-card__face">
              <div
                className={[
                  'fc-card__face-inner fc-card__face-inner--state',
                  variant === 'generating'
                    ? 'fc-card__face-inner--generating fc-card__face-inner--generating-panel'
                    : '',
                ].filter(Boolean).join(' ')}
              >
                <div
                  key={contentKey}
                  className={['fc-card-state__content', fadeClass].filter(Boolean).join(' ')}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
