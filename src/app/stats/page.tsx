'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ScoreRow {
  id: string
  user_id: string
  category: string
  pre_score: number
  post_score: number
  taken_at: string
  users: {
    name: string
    phone: string
  }
}

interface Stats {
  totalUsers: number
  totalAttempts: number
  avgPostScore: number
  perfectScores: number
}

export default function StatsPage() {
  const [rows, setRows] = useState<ScoreRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient()

      const { data, error: dbError } = await supabase
        .from('quiz_scores')
        .select('*, users(name, phone)')
        .order('taken_at', { ascending: false })

      if (dbError) {
        setError(dbError.message)
        setLoading(false)
        return
      }

      const scored = data as ScoreRow[]
      setRows(scored)

      const uniqueUsers = new Set(scored.map((r) => r.user_id)).size
      const avg = scored.length
        ? scored.reduce((sum, r) => sum + r.post_score, 0) / scored.length
        : 0
      const perfect = scored.filter((r) => r.post_score === 5).length

      setStats({
        totalUsers: uniqueUsers,
        totalAttempts: scored.length,
        avgPostScore: Math.round(avg * 10) / 10,
        perfectScores: perfect,
      })

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

  const improvement = (pre: number, post: number) => {
    const diff = post - pre
    if (diff > 0) return <span className="text-green-600 font-bold">+{diff}</span>
    if (diff < 0) return <span className="text-red-500 font-bold">{diff}</span>
    return <span className="text-gray-400">—</span>
  }

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
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary cards */}
          {stats && (
            <div className="grid grid-cols-2 gap-2 mb-5">
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.totalUsers}</p>
                <p className="text-xs text-gray-400 mt-0.5">Users</p>
              </div>
              <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
                <p className="text-2xl font-black text-[#e8870a]">{stats.totalAttempts}</p>
                <p className="text-xs text-gray-400 mt-0.5">Attempts</p>
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

          {/* Table */}
          {rows.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No data yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#fff9ec] text-[#b8860b]">
                    <th className="text-left px-4 py-2.5 font-bold">Name</th>
                    <th className="text-left px-3 py-2.5 font-bold">Category</th>
                    <th className="text-center px-3 py-2.5 font-bold">Pre</th>
                    <th className="text-center px-3 py-2.5 font-bold">Post</th>
                    <th className="text-center px-3 py-2.5 font-bold">Δ</th>
                    <th className="text-left px-3 py-2.5 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-t border-[#f0e8d8] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-4 py-2.5">
                        <p className="font-bold text-[#1a1a2e] truncate max-w-[80px]">
                          {row.users?.name ?? '—'}
                        </p>
                        <p className="text-gray-400 text-[10px]">{row.users?.phone ?? ''}</p>
                      </td>
                      <td className="px-3 py-2.5 capitalize text-gray-600">{row.category}</td>
                      <td className="px-3 py-2.5 text-center text-gray-500">{row.pre_score}/5</td>
                      <td className="px-3 py-2.5 text-center font-bold text-[#1a1a2e]">{row.post_score}/5</td>
                      <td className="px-3 py-2.5 text-center">{improvement(row.pre_score, row.post_score)}</td>
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
