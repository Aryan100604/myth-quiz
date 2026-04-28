'use client'

import { create } from 'zustand'
import type { Category } from '@/types'

interface QuizStore {
  userName: string
  phone: string
  userId: string | null
  category: Category
  preScore: number
  postScore: number
  setUser: (name: string, phone: string) => void
  setUserId: (id: string) => void
  setCategory: (cat: Category) => void
  setPreScore: (score: number) => void
  setPostScore: (score: number) => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  userName: '',
  phone: '',
  userId: null,
  category: 'greek',
  preScore: 0,
  postScore: 0,
  setUser: (name, phone) => set({ userName: name, phone }),
  setUserId: (id) => set({ userId: id }),
  setCategory: (cat) => set({ category: cat }),
  setPreScore: (score) => set({ preScore: score }),
  setPostScore: (score) => set({ postScore: score }),
}))
