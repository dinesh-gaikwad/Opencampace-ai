export type Course = {
  id: number
  slug: string
  title: string
  category: string
  level: string
  description: string
  durationLabel: string
  lessonsCount: number
  featured: boolean
}
export type TutorMessage = { role: 'assistant' | 'user'; text: string; mode?: string }
