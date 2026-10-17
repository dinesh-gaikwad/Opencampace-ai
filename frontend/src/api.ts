import type { Course } from './types'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

const fallbackCourses: Course[] = [
  { id: 1, slug: 'java-foundations', title: 'Java Foundations', category: 'Programming', level: 'Beginner', description: 'Learn variables, types, operators, conditions, loops, methods, and object-oriented programming through short lessons and practice.', durationLabel: '4 weeks', lessonsCount: 28, featured: true },
  { id: 2, slug: 'full-stack-java', title: 'Full Stack Java Developer', category: 'Career Path', level: 'Beginner to Intermediate', description: 'Build web applications with Java, Spring Boot, REST APIs, PostgreSQL, React, testing, and deployment.', durationLabel: '12 weeks', lessonsCount: 64, featured: true },
  { id: 3, slug: 'sql-essentials', title: 'SQL Essentials', category: 'Database', level: 'Beginner', description: 'Learn relational data, SELECT, filtering, joins, grouping, constraints, and practical database design.', durationLabel: '2 weeks', lessonsCount: 18, featured: true },
  { id: 4, slug: 'web-basics', title: 'Web Development Basics', category: 'Web Development', level: 'Beginner', description: 'Understand HTML, CSS, JavaScript, responsive design, accessibility, and how the web works.', durationLabel: '3 weeks', lessonsCount: 22, featured: false },
  { id: 5, slug: 'ai-for-learners', title: 'AI Study Skills', category: 'Artificial Intelligence', level: 'Beginner', description: 'Learn how to ask better questions, verify AI output, practise with AI, and study responsibly.', durationLabel: '1 week', lessonsCount: 10, featured: false },
]

export async function getCourses(): Promise<{ courses: Course[]; source: 'api' | 'demo' }> {
  try {
    const response = await fetch(`${API_BASE}/courses`, { signal: AbortSignal.timeout(3500) })
    if (!response.ok) throw new Error('API unavailable')
    return { courses: await response.json() as Course[], source: 'api' }
  } catch {
    return { courses: fallbackCourses, source: 'demo' }
  }
}

export async function askTutor(question: string, language: string, level: string) {
  const response = await fetch(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language, level }),
  })
  if (!response.ok) throw new Error('Tutor service unavailable')
  return response.json() as Promise<{ answer: string; mode: string; safetyNote: string }>
}
