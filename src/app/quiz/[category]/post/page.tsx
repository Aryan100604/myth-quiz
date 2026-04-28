'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { QUESTIONS, CATEGORY_META } from '@/lib/questions'
import { createClient } from '@/lib/supabase/client'
import PageHeader from '@/components/PageHeader'
import type { Category } from '@/types'

export default function PostQuizPage() {
  const router = useRouter()
  const params = useParams()
  const category = (params.category as Category) ?? 'greek'
  const { setPostScore, preScore, userId } = useQuizStore()

  const questions = QUESTIONS[category] ?? QUESTIONS.greek
  const meta = CATEGORY_META[category] ?? CATEGORY_META.greek

  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) router.replace('/')
  }, [userId, router])

  function handleBack() {
    if (current === 0) {
      router.push(`/lesson/${category}`)
      return
    }
    const leave = window.confirm('Leave the quiz? Your progress will be lost.')
    if (leave) router.push(`/lesson/${category}`)
  }

  function handleAnswer(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === questions[current].correctIndex) setScore((s) => s + 1)
  }

  async function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
      return
    }

    setSaving(true)
    setPostScore(score)

    const supabase = createClient()
    const { error } = await supabase.from('quiz_scores').insert({
      user_id: userId,
      category,
      pre_score: preScore,
      post_score: score,
    })

    if (error) console.error('Failed to save score:', error)

    router.push('/results')
  }

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <PageHeader step={5} onBack={handleBack} title="Post-Quiz" />

      <div className="bg-[#f0e8d0] rounded-full h-1.5 mb-1">
        <div
          className="bg-gradient-to-r from-[#f5a623] to-[#e8870a] h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right mb-3">
        {current + 1} / {questions.length}
      </p>

      <div className="bg-gradient-to-br from-[#fff9ec] to-[#fff3d0] rounded-2xl p-4 mb-3 border border-[#ffe599]">
        <p className="text-xs font-bold text-[#b8860b] mb-1">{meta.icon} {meta.label} Mythology</p>
        <p className="text-sm font-bold text-[#1a1a2e] leading-snug">{q.text}</p>
      </div>

      <div className="space-y-2 mb-4">
        {q.options.map((opt, idx) => {
          let style = 'bg-white border-[#e8e0d0] text-gray-700'
          if (answered) {
            if (idx === q.correctIndex) style = 'bg-green-50 border-green-400 font-bold text-green-800'
            else if (idx === selected) style = 'bg-red-50 border-red-400 text-red-700'
          } else if (idx === selected) {
            style = 'bg-[#fff9e6] border-[#f5a623]'
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm text-left transition-all ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white rounded-2xl py-4 text-base font-bold disabled:opacity-60"
        >
          {saving ? 'Saving...' : current < questions.length - 1 ? 'Next Question →' : 'See My Results →'}
        </button>
      )}
    </div>
  )
}
