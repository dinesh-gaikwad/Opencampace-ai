import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('OpenCampus landing page', () => {
  it('shows the product heading and course catalogue', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /your next skill starts with/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /find a course to begin/i })).toBeInTheDocument()
  })
})
