'use client'

interface Props {
  step?: number      // 1-based current step
  totalSteps?: number
  onBack?: () => void
  title?: string
}

const STEP_LABELS = ['Start', 'Topic', 'Pre-Quiz', 'Lesson', 'Post-Quiz', 'Results', 'Board']

export default function PageHeader({ step, totalSteps = 7, onBack, title }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* Back button */}
      <div className="w-8">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#fff9ec] border border-[#ffe599] text-[#e8870a] text-sm font-bold"
          >
            ←
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Center: title or step dots */}
      <div className="flex flex-col items-center gap-1">
        {title && <p className="text-xs font-bold text-[#1a1a2e]">{title}</p>}
        {step && (
          <div className="flex items-center gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all ${
                  i + 1 === step
                    ? 'w-4 h-1.5 bg-[#f5a623]'
                    : i + 1 < step
                    ? 'w-1.5 h-1.5 bg-[#f5a623] opacity-40'
                    : 'w-1.5 h-1.5 bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}
        {step && (
          <p className="text-[9px] text-gray-400 font-semibold tracking-wide">
            {STEP_LABELS[step - 1]} · {step}/{totalSteps}
          </p>
        )}
      </div>

      {/* Right spacer to keep title centered */}
      <div className="w-8" />
    </div>
  )
}
