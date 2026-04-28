'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Flat shape from the unique_best_scores view (users join is already done in the view)
interface BestScoreRow {
  id: string
  user_id: string
  category: string
  pre_score: number
  post_score: number
  taken_at: string
  name: string
  phone: string
}

interface Stats {
  totalUsers: number
  totalAttempts: number
  avgPostScore: number
  perfectScores: number
}

export default function StatsPage() {
  const [tableRows, setTableRows] = useState<BestScoreRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient()

      // Run both queries in parallel
      const [uniqueRes, allRes] = await Promise.all([
        // Table: one row per user+category (best score) — from the DB view
        supabase
          .from('unique_best_scores')
          .select('*')
          .order('post_score', { ascending: false }),

        // Stats cards: raw count of all attempts
        supabase
          .from('quiz_scores')
          .select('post_score, user_id'),
      ])

      if (uniqueRes.error) {
        setError(uniqueRes.error.message)
        setLoading(false)
        return
      }

      const best = uniqueRes.data as BestScoreRow[]
      const all = (allRes.data ?? []) as { post_score: number; user_id: string }[]

      const uniqueUsers = new Set(all.map((r) => r.user_id)).size
      const avg = all.length
        ? all.reduce((sum, r) => sum + r.post_score, 0) / all.length
        : 0
      const perfect = all.filter((r) => r.post_score === 5).length

      setStats({
        totalUsers: uniqueUsers,
        totalAttempts: all.length,
        avgPostScore: Math.round(avg * 10) / 10,
        perfectScores: perfect,
      })

      setTableRows(best)
      setLoading(false)
    }

    fetchAll()
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const delta = (pre: number, post: number) => {
    const diff = post - pre
    if (diff > 0) return <span className="text-green-600 font-bold">+{diff}</span>
    if (diff < 0) return <span className="text-red-500 font-bold">{diff}</span>
    return <span className="text-gray-400">—</span>
  }

  const dupCount = stats ? stats.totalAttempts - tableRows.length : 0

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase">ADMIN</p>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Stats</h1>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-400 py-10">Loading data...</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-600 break-all">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {stats && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.totalUsers}</p>
                <p className="text-xs text-gray-400 mt-0.5">Users</p>
              </div>
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.totalAttempts}</p>
                <p className="text-xs text-gray-400 mt-0.5">Total Attempts</p>
              </div>
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.avgPostScore}/5</p>
                <p className="text-xs text-gray-400 mt-0.5">Avg Score</p>
              </div>
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.perfectScores}</p>
                <p className="text-xs text-gray-400 mt-0.5">Perfect 5/5</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#1a1a2e]">
              Best scores · {tableRows.length} unique
            </p>
            {dupCount > 0 && (
              <p className="text-[10px] text-gray-400">
                {dupCount} repeat attempt{dupCount > 1 ? 's' : ''} hidden
              </p>
            )}
          </div>

          {tableRows.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No data yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#fff9ec] text-[#b8860b]">
                    <th className="text-left px-4 py-2.5 font-bold">Name</th>
                    <th className="text-left px-3 py-2.5 font-bold">Category</th>
                    <th className="text-center px-3 py-2.5 font-bold">Pre</th>
                    <th className="text-center px-3 py-2.5 font-bold">Best</th>
                    <th className="text-center px-3 py-2.5 font-bold">Δ</th>
                    <th className="text-left px-3 py-2.5 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, i) => (
                    <tr
                      key={`${row.user_id}-${row.category}`}
                      className={`border-t border-[#f0e8d8] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-[#1a1a2e] truncate max-w-[80px]">{row.name}</p>
                        <p className="text-gray-400 text-[10px]">{row.phone}</p>
                      </td>
                      <td className="px-3 py-2.5 capitalize text-gray-600">{row.category}</td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{row.pre_score}/5</td>
                      <td className="px-3 py-2.5 text-center font-bold text-[#1a1a2e]">{row.post_score}/5</td>
                      <td className="px-3 py-2.5 text-center">{delta(row.pre_score, row.post_score)}</td>
                      <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">{formatDate(row.taken_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
