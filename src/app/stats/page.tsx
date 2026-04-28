'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserRow {
  id: string
  name: string
  phone: string
  created_at: string
}

export default function StatsPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      const supabase = createClient()
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (dbError) { setError(dbError.message); setLoading(false); return }
      setUsers(data as UserRow[])
      setLoading(false)
    }

    fetchUsers()
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

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase">ADMIN</p>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Registered Users</h1>
        </div>
        <div className="bg-[#fff9ec] border border-[#ffe599] rounded-2xl px-4 py-2 text-center">
          <p className="text-2xl font-black text-[#e8870a]">{users.length}</p>
          <p className="text-[10px] text-gray-400">Total</p>
        </div>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 py-10">Loading...</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 break-all">
          {error}
        </div>
      )}

      {!loading && !error && (
        users.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-10">No users yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#fff9ec] text-[#b8860b]">
                  <th className="text-left px-4 py-2.5 font-bold">#</th>
                  <th className="text-left px-4 py-2.5 font-bold">Name</th>
                  <th className="text-left px-3 py-2.5 font-bold">Phone</th>
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
                    <td className="px-4 py-2.5 font-bold text-[#1a1a2e]">{user.name}</td>
                    <td className="px-3 py-2.5 text-gray-500">{user.phone}</td>
                    <td className="px-3 py-2.5 text-gray-400 whitespace-nowrap">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  )
}
