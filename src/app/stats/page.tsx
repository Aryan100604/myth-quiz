'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserRow {
  id: string
  name: string
  phone: string
  created_at: string
}

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

type ActiveTab = 'users' | 'scores'

export default function StatsPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [scoreRows, setScoreRows] = useState<BestScoreRow[]>([])
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [tab, setTab] = useState<ActiveTab>('users')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAll() {
      const supabase = createClient()

      const [usersRes, scoresRes, allAttemptsRes] = await Promise.all([
        supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false }),

        supabase
          .from('unique_best_scores')
          .select('*')
          .order('post_score', { ascending: false }),

        supabase
          .from('quiz_scores')
          .select('id', { count: 'exact', head: true }),
      ])

      if (usersRes.error) { setError(usersRes.error.message); setLoading(false); return }

      setUsers(usersRes.data as UserRow[])
      setScoreRows((scoresRes.data ?? []) as BestScoreRow[])
      setTotalAttempts(allAttemptsRes.count ?? 0)
      setLoading(false)
    }

    fetchAll()
  }, [])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
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

  // Users who have at least one score
  const activeUserIds = new Set(scoreRows.map((r) => r.user_id))

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase">ADMIN</p>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Stats</h1>
        </div>
        <span className="text-2xl">📊</span>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 py-10">Loading...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-600 break-all">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-[#e8870a]">{users.length}</p>
              <p className="text-xs text-gray-400 mt-0.5">Registered</p>
            </div>
            <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-[#e8870a]">{activeUserIds.size}</p>
              <p className="text-xs text-gray-400 mt-0.5">Played</p>
            </div>
            <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-[#e8870a]">{totalAttempts}</p>
              <p className="text-xs text-gray-400 mt-0.5">Attempts</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#fff9ec] rounded-xl p-1 gap-1 mb-4">
            <button
              onClick={() => setTab('users')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'users'
                  ? 'bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white'
                  : 'text-gray-400'
              }`}
            >
              Users ({users.length})
            </button>
            <button
              onClick={() => setTab('scores')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                tab === 'scores'
                  ? 'bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white'
                  : 'text-gray-400'
              }`}
            >
              Best Scores ({scoreRows.length})
            </button>
          </div>

          {/* Users tab */}
          {tab === 'users' && (
            users.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No users yet.</p>
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#fff9ec] text-[#b8860b]">
                      <th className="text-left px-4 py-2.5 font-bold">#</th>
                      <th className="text-left px-3 py-2.5 font-bold">Name</th>
                      <th className="text-left px-3 py-2.5 font-bold">Phone</th>
                      <th className="text-center px-3 py-2.5 font-bold">Played</th>
                      <th className="text-left px-3 py-2.5 font-bold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user.id}
                        className={`border-t border-[#f0e8d8] ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-4 py-2.5 text-gray-400">{i + 1}</td>
                        <td className="px-3 py-2.5 font-bold text-[#1a1a2e] truncate max-w-[80px]">
                          {user.name}
                        </td>
                        <td className="px-3 py-2.5 text-gray-500">{user.phone}</td>
                        <td className="px-3 py-2.5 text-center">
                          {activeUserIds.has(user.id) ? (
                            <span className="text-green-600 font-bold">✓</span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* Best Scores tab */}
          {tab === 'scores' && (
            scoreRows.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">No scores yet.</p>
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
                    {scoreRows.map((row, i) => (
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
            )
          )}
        </>
      )}
    </div>
  )
}
