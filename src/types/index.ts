export type Category = 'greek' | 'hindu' | 'norse' | 'egyptian'

export interface Question {
  id: number
  text: string
  options: string[]
  correctIndex: number
}

export interface Lesson {
  category: Category
  title: string
  icon: string
  body: string
  audioUrl?: string
}

export interface LeaderboardEntry {
  rank: number
  name: string
  initial: string
  category: string
  score: string
  points: number
  isMe?: boolean
}
