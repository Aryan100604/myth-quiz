'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { createClient } from '@/lib/supabase/client'

export default function OnboardingPage() {
  const router = useRouter()
  const { setUser, setUserId } = useQuizStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleStart() {
    if (!name.trim() || !phone.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from('users')
      .upsert({ name: name.trim(), phone: phone.trim() }, { onConflict: 'phone' })
      .select('id')
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      setError('Could not save. Check your connection.')
      setLoading(false)
      return
    }

    setUser(name.trim(), phone.trim())
    setUserId(data.id)
    router.push('/categories')
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <div className="text-center text-6xl mt-2 mb-4">🏛️</div>

      <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase mb-1">WELCOME TO</p>
      <h1 className="text-3xl font-black text-[#1a1a2e] mb-2">MythIQ</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        Test your knowledge of world mythology. Learn. Compete. Challenge friends.
      </p>

      <label className="block text-xs font-semibold text-gray-400 mb-1 mt-2">Your Name</label>
      <input
        className="w-full bg-gray-50 border border-[#e8e0d0] rounded-xl px-3 py-3 text-sm text-[#1a1a2e] outline-none focus:border-[#f5a623]"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block text-xs font-semibold text-gray-400 mb-1 mt-3">Phone Number</label>
      <input
        className="w-full bg-gray-50 border border-[#e8e0d0] rounded-xl px-3 py-3 text-sm text-[#1a1a2e] outline-none focus:border-[#f5a623]"
        type="tel"
        placeholder="+91 98765 43210"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <button
        onClick={handleStart}
        disabled={!name.trim() || !phone.trim() || loading}
        className="mt-5 w-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white rounded-2xl py-4 text-base font-bold disabled:opacity-40"
      >
        {loading ? 'Saving...' : 'Get Started →'}
      </button>
    </div>
  )
}
