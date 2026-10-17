import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ChevronDown, Code2,
  GraduationCap, Headphones, Menu, Mic, Search, ShieldCheck, Sparkles,
  Target, TrendingUp, X, Zap,
} from 'lucide-react'
import { askTutor, getCourses } from './api'
import type { Course, TutorMessage } from './types'

const categories = ['All', 'Programming', 'Career Path', 'Database', 'Web Development', 'Artificial Intelligence']

function App() {
  const [courses, setCourses] = useState<Course[]>([])
  const [source, setSource] = useState<'api' | 'demo'>('demo')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState<TutorMessage[]>([
    { role: 'assistant', text: 'Hi! I’m your OpenCampus study companion. Ask me about Java, web development, SQL, or how to begin learning.' },
  ])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    getCourses().then(result => {
      setCourses(result.courses)
      setSource(result.source)
    })
  }, [])

  const visibleCourses = useMemo(() => courses.filter(course => {
    const matchesCategory = category === 'All' || course.category === category
    const term = search.trim().toLowerCase()
    const matchesSearch = !term || `${course.title} ${course.description} ${course.category}`.toLowerCase().includes(term)
    return matchesCategory && matchesSearch
  }), [courses, category, search])

  async function sendQuestion(text = question) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setMessages(prev => [...prev, { role: 'user', text: trimmed }])
    setQuestion('')
    setBusy(true)
    try {
      const result = await askTutor(trimmed, 'English', 'Beginner')
      setMessages(prev => [...prev, { role: 'assistant', text: result.answer, mode: result.mode }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'The live tutor API is not reachable yet. Start the Java backend to use its demo tutor, or check your deployment configuration.' }])
    } finally {
      setBusy(false)
    }
  }

  function startVoice() {
    const browser = window as Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }
    const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition
    if (!Recognition) {
      setNotice('Voice recognition is not supported by this browser. You can type your question instead.')
      return
    }
    const recognition = new Recognition()
    recognition.lang = 'en-IN'
    recognition.onresult = (event: any) => setQuestion(event.results?.[0]?.[0]?.transcript || '')
    recognition.onerror = () => setNotice('Voice input did not work. Please try again or type your question.')
    recognition.start()
  }

  function speak(text: string) {
    if (!('speechSynthesis' in window)) {
      setNotice('Read-aloud is not supported in this browser.')
      return
    }
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <a href="#" className="brand" aria-label="OpenCampus AI home">
          <span className="brand-mark"><GraduationCap size={24} /></span>
          <span>OpenCampus<span className="brand-ai"> AI</span></span>
        </a>
        <nav className={mobileMenu ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
          <a href="#courses" onClick={() => setMobileMenu(false)}>Explore courses</a>
          <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#accessibility" onClick={() => setMobileMenu(false)}>Accessible learning</a>
        </nav>
        <div className="nav-actions">
          <button className="button button-quiet desktop-only" onClick={() => setTutorOpen(true)}>Ask AI tutor</button>
          <button className="button button-primary desktop-only" onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}>Start learning <ArrowRight size={16} /></button>
          <button className="icon-button mobile-menu" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> LEARNING, BUILT AROUND YOU</div>
            <h1>Your next skill starts with <span>one question.</span></h1>
            <p className="hero-subtitle">Learn at your pace with clear lessons, guided practice, and an AI study companion that helps you take the next step.</p>
            <div className="hero-actions">
              <button className="button button-primary button-large" onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}>Explore free courses <ArrowRight size={18} /></button>
              <button className="button button-outline button-large" onClick={() => setTutorOpen(true)}><BrainCircuit size={18} /> Meet your AI tutor</button>
            </div>
            <div className="trust-row">
              <span><CheckCircle2 size={16} /> Beginner friendly</span>
              <span><CheckCircle2 size={16} /> Learn across devices</span>
              <span><CheckCircle2 size={16} /> Start at your own pace</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Learning dashboard preview">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-glow" />
            <div className="learning-card main-learning-card">
              <div className="card-topline"><span className="status-dot" /> YOUR LEARNING SPACE <span className="dots">•••</span></div>
              <div className="mini-title">Your next chapter</div>
              <div className="lesson-name"><span className="lesson-icon"><Code2 size={22} /></span><span><b>Java Foundations</b><small>Lesson 04 · Loops and logic</small></span></div>
              <div className="progress-label"><span>Learning progress</span><b>68%</b></div>
              <div className="progress-track"><div style={{ width: '68%' }} /></div>
              <div className="continue-row"><span>12 of 18 activities complete</span><ArrowRight size={17} /></div>
            </div>
            <div className="learning-card insight-card">
              <div className="insight-icon"><BrainCircuit size={19} /></div>
              <div><b>Your AI study companion</b><p>Let’s practise one more example together.</p></div>
              <Sparkles size={18} className="insight-spark" />
            </div>
            <div className="floating-pill pill-top"><span className="pill-icon"><Target size={16} /></span> Learn your way</div>
            <div className="floating-pill pill-bottom"><span className="pill-icon"><Zap size={16} /></span> Small steps. Real progress.</div>
          </div>
        </section>

        <section className="stats-strip" aria-label="Platform principles">
          <div><span className="stat-icon"><BookOpen /></span><span><b>Learn</b><small>Clear, focused lessons</small></span></div>
          <div><span className="stat-icon"><Code2 /></span><span><b>Practise</b><small>Build practical skills</small></span></div>
          <div><span className="stat-icon"><BrainCircuit /></span><span><b>Understand</b><small>Ask questions freely</small></span></div>
          <div><span className="stat-icon"><TrendingUp /></span><span><b>Grow</b><small>Keep moving forward</small></span></div>
        </section>

        <section id="courses" className="section courses-section">
          <div className="section-heading">
            <div><div className="eyebrow">YOUR NEXT STEP</div><h2>Find a course to begin</h2><p>Start with a foundation, then grow into real-world skills.</p></div>
            <div className="course-count"><b>{visibleCourses.length.toString().padStart(2, '0')}</b><span>learning paths</span></div>
          </div>
          <div className="search-row">
            <label className="search-box"><Search size={19} /><input aria-label="Search courses" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Java, SQL, web development..." /><kbd>Search</kbd></label>
          </div>
          <div className="category-list" aria-label="Filter courses">
            {categories.map(item => <button key={item} className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          {source === 'demo' && <p className="inline-note">Showing starter course data. Connect the Java backend to load courses from PostgreSQL.</p>}
          <div className="course-grid">
            {visibleCourses.map((course, index) => <article className="course-card" key={course.slug}>
              <div className={`course-art art-${index % 5}`}>
                <span className="course-category">{course.category}</span>
                <span className="course-symbol">{course.category === 'Database' ? 'DB' : course.category === 'Career Path' ? 'FS' : course.category === 'Artificial Intelligence' ? 'AI' : course.category === 'Web Development' ? '</>' : 'J'}</span>
                {course.featured && <span className="featured-label"><Sparkles size={12} /> POPULAR PATH</span>}
              </div>
              <div className="course-body">
                <div className="course-meta"><span>{course.level}</span><span>{course.durationLabel}</span></div>
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <div className="course-footer"><span><BookOpen size={15} /> {course.lessonsCount} lessons</span><button className="text-button" onClick={() => { setNotice(`${course.title}: course detail and lesson enrollment are the next implementation milestone.`); setTutorOpen(false) }}>View path <ArrowRight size={15} /></button></div>
              </div>
            </article>)}
          </div>
          {visibleCourses.length === 0 && <div className="empty-state">No courses match that search. Try another keyword or category.</div>}
        </section>

        <section id="how-it-works" className="section method-section">
          <div className="section-heading centered"><div className="eyebrow">A BETTER WAY TO LEARN</div><h2>Learn, practise, understand, repeat.</h2><p>A supportive learning loop helps turn confusion into confidence.</p></div>
          <div className="method-grid">
            <article><span className="method-number">01</span><div className="method-icon mint"><BookOpen /></div><h3>Start with clarity</h3><p>Short lessons break complex topics into manageable steps and examples.</p></article>
            <article><span className="method-number">02</span><div className="method-icon lilac"><BrainCircuit /></div><h3>Ask without fear</h3><p>Use the AI tutor to ask follow-up questions and request simpler explanations.</p></article>
            <article><span className="method-number">03</span><div className="method-icon peach"><Code2 /></div><h3>Practise for real</h3><p>Use exercises and coding challenges to check what you can do independently.</p></article>
            <article><span className="method-number">04</span><div className="method-icon blue"><TrendingUp /></div><h3>Build momentum</h3><p>Track completed activities and choose a sensible next learning step.</p></article>
          </div>
        </section>

        <section id="accessibility" className="access-section">
          <div className="access-copy"><div className="eyebrow light-eyebrow">LEARNING SHOULD INCLUDE EVERYONE</div><h2>Your device. Your pace. Your way.</h2><p>Designed to adapt from a small phone to a large screen, with clear controls and options that support different learning needs.</p><div className="access-points"><span><CheckCircle2 /> Responsive on mobile, tablet, and desktop</span><span><CheckCircle2 /> Keyboard-friendly navigation</span><span><CheckCircle2 /> Optional voice input and read-aloud</span></div><button className="button button-white" onClick={() => setTutorOpen(true)}><Headphones size={17} /> Try the learning assistant</button></div>
          <div className="access-art"><div className="access-circle"><GraduationCap size={74} /></div><div className="access-mini access-mini-one"><Mic size={18} /><span>Voice, when supported</span></div><div className="access-mini access-mini-two"><ShieldCheck size={18} /><span>Learning at your pace</span></div></div>
        </section>

        <section className="final-cta"><div className="cta-mark"><GraduationCap size={27} /></div><h2>Every expert starts somewhere.</h2><p>Take the first step, ask the first question, and keep going.</p><button className="button button-primary button-large" onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}>Choose your first course <ArrowRight size={18} /></button><small>OpenCampus AI is an early-stage project. Features are being built progressively.</small></section>
      </main>

      <footer className="footer"><a href="#" className="brand footer-brand"><span className="brand-mark"><GraduationCap size={20} /></span><span>OpenCampus<span className="brand-ai"> AI</span></span></a><span>Learn with curiosity. Grow with confidence.</span><span>© {new Date().getFullYear()} OpenCampus AI · Portfolio project</span></footer>

      {notice && <div className="notice" role="status">{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></div>}

      {tutorOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setTutorOpen(false) }}>
        <section className="tutor-modal" role="dialog" aria-modal="true" aria-labelledby="tutor-title">
          <header className="tutor-header"><div className="tutor-brand-icon"><BrainCircuit /></div><div><h2 id="tutor-title">AI study companion</h2><p>Ask a question. Take one step forward.</p></div><button className="icon-button" aria-label="Close AI tutor" onClick={() => setTutorOpen(false)}><X /></button></header>
          <div className="suggested-prompts"><span>Try asking:</span><button onClick={() => sendQuestion('Explain Java variables simply')}>Java variables</button><button onClick={() => sendQuestion('What is a for loop?')}>For loops</button><button onClick={() => sendQuestion('How does React work?')}>React basics</button></div>
          <div className="chat-messages" aria-live="polite">{messages.map((message, i) => <div key={`${message.role}-${i}`} className={`chat-message ${message.role}`}><div className="message-avatar">{message.role === 'assistant' ? <Sparkles size={16} /> : 'Y'}</div><div className="message-content"><p>{message.text}</p>{message.role === 'assistant' && <button className="speak-button" onClick={() => speak(message.text)}><Headphones size={14} /> Read aloud</button>}</div></div>)}{busy && <div className="typing-indicator">Your tutor is thinking…</div>}</div>
          <form className="chat-form" onSubmit={e => { e.preventDefault(); void sendQuestion() }}><input value={question} onChange={e => setQuestion(e.target.value)} aria-label="Ask your tutor a question" placeholder="Ask anything you’re learning…" maxLength={6000} /><button type="button" className="icon-button voice-button" aria-label="Use voice input" onClick={startVoice}><Mic size={19} /></button><button className="send-button" type="submit" disabled={!question.trim() || busy} aria-label="Send question"><ArrowRight size={19} /></button></form>
          <p className="tutor-disclaimer">AI can make mistakes. Verify important information with trusted learning materials.</p>
        </section>
      </div>}
    </div>
  )
}

export default App
