'use client'

import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'

const TITLES = [
  'Keep Exploring 📚',
  'Getting There 🌟',
  'Well Done 🎉',
  'Impressive ⚡',
  'Outstanding 🏆',
  'Myth Master 🔱',
]

export default function ResultsPage() {
  const router = useRouter()
  const { preScore, postScore, userName, category } = useQuizStore()

  const total = 5
  const prePct = Math.round((preScore / total) * 100)
  const postPct = Math.round((postScore / total) * 100)
  const title = TITLES[postScore] ?? TITLES[0]

  function shareOnWhatsApp() {
    const text = `I scored ${postScore}/${total} on ${category} Mythology on MythIQ! Can you beat me? 🏛️`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="text-center pt-2 mb-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] mx-auto flex flex-col items-center justify-center text-white shadow-lg shadow-amber-200 mb-3">
          <span className="text-3xl font-black">{postScore}/{total}</span>
          <span className="text-[9px] tracking-widest opacity-90">POST QUIZ</span>
        </div>
        <h2 className="text-xl font-black text-[#1a1a2e]">{title}</h2>
        {userName && <p className="text-sm text-gray-400 mt-1">Great job, {userName}!</p>}
      </div>

      <div className="bg-gradient-to-br from-[#fff9ec] to-[#fff3d0] rounded-2xl p-4 text-center border border-[#ffe599] mb-4">
        <p className="text-xs text-gray-400 mb-1">Your improvement</p>
        <p className="text-2xl font-black text-[#e8870a]">
          {prePct}% → {postPct}% {postScore > preScore ? '🔥' : ''}
        </p>
      </div>

      <button
        onClick={shareOnWhatsApp}
        className="w-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-2xl py-4 text-sm font-bold mb-2"
      >
        ⚔️ Challenge a Friend on WhatsApp
      </button>

      <button
        onClick={() => router.push('/leaderboard')}
        className="w-full border-2 border-[#f5a623] text-[#e8870a] rounded-2xl py-3.5 text-sm font-semibold mb-2"
      >
        See Leaderboard →
      </button>

      <button
        onClick={() => router.push('/categories')}
        className="w-full text-gray-400 text-sm py-2"
      >
        Try Another Mythology
      </button>
    </div>
  )
}
