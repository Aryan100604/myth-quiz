'use client'

import { create } from 'zustand'
import type { Category } from '@/types'

interface QuizStore {
  userName: string
  phone: string
  category: Category
  preScore: number
  postScore: number
  setUser: (name: string, phone: string) => void
  setCategory: (cat: Category) => void
  setPreScore: (score: number) => void
  setPostScore: (score: number) => void
}

export const useQuizStore = create<QuizStore>((set) => ({
  userName: '',
  phone: '',
  category: 'greek',
  preScore: 0,
  postScore: 0,
  setUser: (name, phone) => set({ userName: name, phone }),
  setCategory: (cat) => set({ category: cat }),
  setPreScore: (score) => set({ preScore: score }),
  setPostScore: (score) => set({ postScore: score }),
}))
