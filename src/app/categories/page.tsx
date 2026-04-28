'use client'

import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/quiz'
import { CATEGORY_META } from '@/lib/questions'
import type { Category } from '@/types'

const CATEGORIES: Category[] = ['greek', 'hindu', 'norse', 'egyptian']

export default function CategoriesPage() {
  const router = useRouter()
  const { category, setCategory, userName } = useQuizStore()

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden min-h-[580px] p-5">
      <p className="text-xs font-bold text-[#b8860b] tracking-widest uppercase mb-1 mt-2">
        HEY {userName || 'THERE'}, CHOOSE YOUR
      </p>
      <h1 className="text-3xl font-black text-[#1a1a2e] mb-1">Mythology</h1>
      <p className="text-sm text-gray-500 mb-4">Pick a world to explore today.</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {CATEGORIES.map((cat) => {
          const meta = CATEGORY_META[cat]
          const selected = category === cat
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`${meta.color} border-2 ${selected ? 'border-[#f5a623] scale-105' : meta.borderColor} rounded-2xl py-4 px-2 text-center transition-transform`}
            >
              <div className="text-3xl mb-1">{meta.icon}</div>
              <div className="text-sm font-bold text-[#1a1a2e]">{meta.label}</div>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => router.push(`/quiz/${category}/pre`)}
        className="w-full bg-gradient-to-br from-[#f5a623] to-[#e8870a] text-white rounded-2xl py-4 text-base font-bold"
      >
        Start Pre-Quiz →
      </button>
    </div>
  )
}
