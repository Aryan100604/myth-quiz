'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'

const MOCK_ENTRIES = [
  { rank: 1, name: 'Rahul', initial: 'R', category: 'Greek', score: '5/5', points: 500 },
  { rank: 2, name: 'Priya', initial: 'P', category: 'Hindu', score: '4/5', points: 400 },
  { rank: 3, name: 'Arjun', initial: 'A', category: 'Norse', score: '4/5', points: 380 },
  { rank: 4, name: 'Sneha', initial: 'S', category: 'Egyptian', score: '3/5', points: 300 },
]

const TABS = ['Friends', 'Global', 'This Week'] as const

export default function LeaderboardPage() {
  const router = useRouter()
  const { userName, postScore, category } = useQuizStore()
  const [tab, setTab] = useState<typeof TABS[number]>('Global')

  const myPoints = postScore * 100
  const myEntry = {
    rank: 3,
    name: `${userName || 'You'} ⭐`,
    initial: (userName?.[0] ?? 'Y').toUpperCase(),
    category: category.charAt(0).toUpperCase() + category.slice(1),
    score: `${postScore}/5`,
    points: myPoints,
    isMe: true,
  }

  function shareOnWhatsApp() {
    const text = `Join me on MythIQ and test your mythology knowledge! 🏛️`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase mb-1">HALL OF FAME</p>
      <h1 className="text-2xl font-black text-[#1a1a2e] mb-3">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex bg-[#fff9ec] rounded-xl p-1 gap-1 mb-3">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              tab === t
                ? 'bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white'
                : 'text-gray-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Invite strip */}
      <button
        onClick={shareOnWhatsApp}
        className="w-full bg-gradient-to-br from-[#fff9ec] to-[#fff3d0] border-2 border-dashed border-[#f5a623] rounded-xl p-3 text-center mb-3"
      >
        <div className="text-xl mb-1">👥</div>
        <p className="text-xs text-gray-400 mb-1">Invite friends to see where you rank</p>
        <span className="bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-lg px-3 py-1.5 text-xs font-bold">
          + Invite via WhatsApp
        </span>
      </button>

      {/* Rankings */}
      <div className="space-y-2">
        {MOCK_ENTRIES.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-2.5 bg-white border-2 border-[#f0e8d8] rounded-xl p-2.5"
          >
            <span className="text-sm font-black text-[#b8860b] w-6 text-center">
              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
              {entry.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a2e] truncate">{entry.name}</p>
              <p className="text-xs text-gray-400">{entry.category} · {entry.score}</p>
            </div>
            <span className="text-sm font-black text-[#e8870a]">{entry.points}</span>
          </div>
        ))}

        {/* My row */}
        {userName && (
          <div className="flex items-center gap-2.5 bg-[#fff9ec] border-2 border-[#f5a623] rounded-xl p-2.5">
            <span className="text-sm font-black text-[#b8860b] w-6 text-center">You</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#cd7f32] to-[#a0522d] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
              {myEntry.initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1a1a2e] truncate">{myEntry.name}</p>
              <p className="text-xs text-gray-400">{myEntry.category} · {myEntry.score}</p>
            </div>
            <span className="text-sm font-black text-[#e8870a]">{myEntry.points}</span>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around pt-4 mt-4 border-t border-[#f0e8d0]">
        <button onClick={() => router.push('/categories')} className="text-center px-3">
          <div className="text-lg">🏠</div>
          <div className="text-[9px] font-semibold text-gray-300">Home</div>
        </button>
        <button className="text-center px-3">
          <div className="text-lg">🏆</div>
          <div className="text-[9px] font-semibold text-[#e8870a]">Leaderboard</div>
        </button>
        <button onClick={() => router.push('/lesson/' + category)} className="text-center px-3">
          <div className="text-lg">📖</div>
          <div className="text-[9px] font-semibold text-gray-300">Lessons</div>
        </button>
        <button className="text-center px-3">
          <div className="text-lg">👤</div>
          <div className="text-[9px] font-semibold text-gray-300">Profile</div>
        </button>
      </div>
    </div>
  )
}
