'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { createClient } from '@/lib/supabase/client'

const TABS = ['Global', 'This Week'] as const

interface LeaderboardRow {
  name: string
  user_id: string
  category: string
  post_score: number
  points: number
  taken_at: string
}

export default function LeaderboardPage() {
  const router = useRouter()
  const { userName, postScore, category, userId } = useQuizStore()
  const [tab, setTab] = useState<typeof TABS[number]>('Global')
  const [entries, setEntries] = useState<LeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      const supabase = createClient()

      let query = supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false })
        .limit(10)

      if (tab === 'This Week') {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        query = query.gte('taken_at', weekAgo.toISOString())
      }

      const { data } = await query
      setEntries(data ?? [])
      setLoading(false)
    }

    fetchLeaderboard()
  }, [tab])

  function shareOnWhatsApp() {
    const text = `Join me on MythIQ and test your mythology knowledge! 🏛️`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const rankIcon = (i: number) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1)

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
        {loading ? (
          <p className="text-center text-sm text-gray-400 py-6">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">No scores yet. Be the first! 🏆</p>
        ) : (
          entries.map((entry, i) => {
            const isMe = entry.user_id === userId
            return (
              <div
                key={`${entry.user_id}-${i}`}
                className={`flex items-center gap-2.5 border-2 rounded-xl p-2.5 ${
                  isMe ? 'bg-[#fff9ec] border-[#f5a623]' : 'bg-white border-[#f0e8d8]'
                }`}
              >
                <span className="text-sm font-black text-[#b8860b] w-6 text-center">{rankIcon(i)}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                  {entry.name[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1a1a2e] truncate">
                    {entry.name}{isMe ? ' ⭐' : ''}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{entry.category} · {entry.post_score}/5</p>
                </div>
                <span className="text-sm font-black text-[#e8870a]">{entry.points}</span>
              </div>
            )
          })
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
