'use client'

import { useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { LESSONS, CATEGORY_META } from '@/lib/questions'
import type { Category } from '@/types'

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const category = (params.category as Category) ?? 'greek'

  const lesson = LESSONS[category] ?? LESSONS.greek
  const meta = CATEGORY_META[category] ?? CATEGORY_META.greek

  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function toggleAudio() {
    if (playing) {
      clearInterval(timerRef.current!)
      setPlaying(false)
    } else {
      setPlaying(true)
      timerRef.current = setInterval(() => {
        setElapsed((s) => s + 1)
      }, 1000)
    }
  }

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="bg-gradient-to-br from-[#fff3d0] to-[#ffe599] rounded-2xl p-4 mb-3 text-center">
        <div className="text-4xl mb-1">{lesson.icon}</div>
        <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase mb-1">NOW LEARN</p>
        <p className="text-lg font-black text-[#1a1a2e]">{lesson.title}</p>
        <p className="text-xs text-gray-500 mt-1">{meta.label} Mythology</p>
      </div>

      <div className="text-sm text-gray-600 leading-7 mb-3 max-h-52 overflow-y-auto whitespace-pre-line">
        {lesson.body}
      </div>

      <button
        onClick={toggleAudio}
        className="w-full bg-[#fff9ec] border border-[#ffe599] rounded-xl p-3 flex items-center gap-3 mb-4"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] flex items-center justify-center text-white text-sm flex-shrink-0">
          {playing ? '⏸' : '▶'}
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-[#1a1a2e]">Listen to this lesson</p>
          <p className="text-xs text-gray-400">
            {playing ? `${formatTime(elapsed)} playing...` : '3 min · Auto-generated audio'}
          </p>
        </div>
      </button>

      <button
        onClick={() => router.push(`/quiz/${category}/post`)}
        className="w-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white rounded-2xl py-4 text-base font-bold"
      >
        Take Post-Quiz →
      </button>
    </div>
  )
}
