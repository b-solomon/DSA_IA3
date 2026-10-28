import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, BarChart3, Trophy, Clock, ArrowRight,
  Brain, Hash, Layers, Search, Code,
  Calculator, Cpu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';
import { TEAM_MEMBERS, COURSE_OUTCOMES } from '@/components/ProjectBanner';

export default function Landing() {
  const { profile } = useAuth();
  const ctaTo = profile ? (profile.role === 'teacher' ? '/teacher' : '/student') : '/get-started';

  return (
    <div className="min-h-screen bg-engineering-grid text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Collegiate Academic Sub-header */}
      <div className="border-b border-slate-200/60 bg-white/70 px-6 py-1.5 text-center text-[11px] font-semibold tracking-wider text-slate-500 uppercase backdrop-blur-xs">
        <span>Department of Computer Science & Engineering</span>
        <span className="mx-2">•</span>
        <span>Data Structures & Algorithms Laboratory</span>
        <span className="mx-2">•</span>
        <span className="text-indigo-600 font-bold">Continuous Assessment IA3</span>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-800 text-white shadow-md shadow-indigo-600/20">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-mono">ExamEase</span>
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                  Batch 2025-26
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Lab Micro-Project #15</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <Link to="/hashing-hub" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 px-3 py-1 rounded-lg border border-indigo-100 transition-colors">
              <Hash size={15} /> Hashing & Formulas Hub
            </Link>
            <a href="#dsa-scope" className="hover:text-slate-900 transition-colors">Course Outcomes</a>
            <a href="#team" className="hover:text-slate-900 transition-colors">Team Members</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to={ctaTo}><Button size="sm">Get Started <ArrowRight size={15} /></Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Algorithmic Topology Canvas */}
      <section className="relative overflow-hidden bg-algo-topology text-white pt-16 pb-24 border-b border-slate-800">
        
        {/* Decorative Grid Overlay & Ambient CS Nodes */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute left-10 top-12 h-64 w-64 rounded-full border border-indigo-400/30" />
          <div className="absolute left-24 top-24 h-36 w-36 rounded-full border border-dashed border-indigo-300/40" />
          <div className="absolute right-16 top-16 h-72 w-72 rounded-full border border-purple-400/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 ring-1 ring-indigo-400/30 backdrop-blur-xs">
                  <Cpu size={13} className="text-indigo-400" /> Micro Project 15 — Online Exam System
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                  Integrated CO1, CO3, CO4
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Online Examination &amp; <br />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Algorithm Analysis Lab
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base text-slate-300 sm:text-lg leading-relaxed">
                Designed for the EdTech and Academic domain. Solves core engineering problems using <strong>LIFO Stacks</strong> for exam navigation, <strong>Hash Tables</strong> with collision handling for student records, and <strong>Binary Search</strong> for logarithmic score retrieval.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={ctaTo}>
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 font-bold">
                    Launch Exam System <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/hashing-hub">
                  <Button size="lg" variant="outline" className="border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-700 hover:text-white font-semibold">
                    <Calculator size={18} className="text-indigo-400" /> Hashing Formulas &amp; Theory
                  </Button>
                </Link>
              </div>

              {/* Badges showing algorithmic primitives */}
              <div className="mt-10 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/80 shadow-xs">
                  <Layers size={15} className="text-sky-400" /> CO1: Navigation Stack (LIFO)
                </span>
                <span className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/80 shadow-xs">
                  <Hash size={15} className="text-purple-400" /> CO4: Hash Directory O(1)
                </span>
                <span className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 border border-slate-700/80 shadow-xs">
                  <Search size={15} className="text-amber-400" /> CO3: Binary Search O(log n)
                </span>
              </div>
            </div>

            {/* Micro Project 15 Laboratory Sheet Card */}
            <div className="lg:col-span-5">
              <div className="card-laboratory rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                
                {/* Laboratory header stamp */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-mono font-bold text-white text-sm">
                      15
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Micro Project Specifications</h3>
                      <p className="text-[11px] text-slate-400">Industry: Education &amp; EdTech Platforms</p>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                    DSA IA3
                  </span>
                </div>

                {/* Team Members List */}
                <div className="mt-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Project Team Members:</span>
                    <span className="text-[10px] text-indigo-400 font-mono">4 Contribs</span>
                  </p>
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {TEAM_MEMBERS.map((m, i) => (
                      <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 transition-colors hover:border-slate-700">
                        <p className="font-bold text-xs text-white">{m.name}</p>
                        <p className="font-mono text-[11px] font-semibold text-indigo-400">{m.regNo}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Algorithmic Pillars */}
                <div className="mt-5 space-y-2 border-t border-slate-800 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Core Course Outcomes Implemented:
                  </p>
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2 text-xs flex items-center justify-between">
                    <span className="text-slate-300"><strong className="text-sky-400">CO1 (Linear):</strong> Question Backtracking Stack</span>
                    <span className="font-mono text-[11px] text-sky-400 font-bold">LIFO</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2 text-xs flex items-center justify-between">
                    <span className="text-slate-300"><strong className="text-purple-400">CO4 (Dynamic):</strong> Student Record Hash Table</span>
                    <span className="font-mono text-[11px] text-purple-400 font-bold">O(1)</span>
                  </div>
                  <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2 text-xs flex items-center justify-between">
                    <span className="text-slate-300"><strong className="text-amber-400">CO3 (Search):</strong> Binary Search Result Finder</span>
                    <span className="font-mono text-[11px] text-amber-400 font-bold">O(log n)</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Link to="/hashing-hub" className="flex-1">
                    <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold text-xs">
                      <Calculator size={13} /> Open Formulas Hub
                    </Button>
                  </Link>
                  <Link to="/get-started?demo=1" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-200 text-xs">
                      Try Demo Exam
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Course Outcomes & DSA Scope Section with Engineering Grid */}
      <section id="dsa-scope" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            Curriculum Alignment
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Integrated Course Outcomes (COs)
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Detailed engineering rationale showing how abstract data structure concepts power real exam workflows.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {COURSE_OUTCOMES.map((co, i) => (
            <div
              key={i}
              className="card-academic rounded-2xl p-6 transition-all hover:border-indigo-500/60 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-500/20 px-2.5 py-1 font-mono text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/30">
                  {co.code}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 border border-slate-700">
                  {co.badge}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{co.title}</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">{co.desc}</p>
              
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300">
                <strong className="text-indigo-400 block mb-1">Application in Online Exam Platform:</strong>
                <p className="text-slate-400 leading-relaxed">{co.application}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Types of Hash Mapping Teaser with Blueprint Background */}
      <section className="bg-blueprint-grid text-white py-20 border-y border-slate-800 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                Mathematical Formulations
              </span>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Open Hashing vs Closed Hashing
              </h2>
              <p className="mt-2 max-w-2xl text-slate-300 text-sm">
                Theoretical comparisons and mathematical formulas for Separate Chaining, Linear Probing, Quadratic Probing, and Double Hashing.
              </p>
            </div>
            <Link to="/hashing-hub">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-md shadow-cyan-600/30">
                <Hash size={18} /> Open Formulas Hub
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-400">Open Hashing</span>
              <h4 className="mt-2 font-bold text-white">Separate Chaining</h4>
              <p className="mt-1 font-mono text-xs text-emerald-300">h(k) = k mod size</p>
              <p className="mt-2 text-xs text-slate-400">Linked lists per bucket. Never overflows; handles high load factors.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">Closed Hashing</span>
              <h4 className="mt-2 font-bold text-white">Linear Probing</h4>
              <p className="mt-1 font-mono text-xs text-blue-300">(hash(k) + i) % size</p>
              <p className="mt-2 text-xs text-slate-400">Sequential step i = 1, 2, 3... Prone to primary clustering.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
              <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs font-bold text-purple-400">Closed Hashing</span>
              <h4 className="mt-2 font-bold text-white">Quadratic Probing</h4>
              <p className="mt-1 font-mono text-xs text-purple-300">(hash(k) + i²) % size</p>
              <p className="mt-2 text-xs text-slate-400">Step i² = 1, 4, 9... Disperses items to prevent primary clustering.</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-inner">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">Closed Hashing</span>
              <h4 className="mt-2 font-bold text-white">Double Hashing</h4>
              <p className="mt-1 font-mono text-xs text-amber-300">(h1(k) + i×h2(k)) % size</p>
              <p className="mt-2 text-xs text-slate-400">Secondary hash step h2(k) = R - (k % R). Uniform probe distribution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section id="team" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            Micro Project Contributors
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Project Engineering Team
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Developed for Data Structures and Algorithms Continuous Assessment (IA3).
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((m, i) => (
            <div
              key={i}
              className="card-academic rounded-2xl p-6 transition-all hover:border-indigo-400 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-700 to-purple-800 text-white font-mono font-bold text-lg shadow-sm">
                0{i + 1}
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{m.name}</h3>
              <p className="font-mono text-xs font-bold text-indigo-400">{m.regNo}</p>
              <p className="mt-2 text-xs text-slate-400">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid with Dot Matrix background */}
      <section id="features" className="bg-dot-matrix bg-slate-950 py-20 border-t border-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-black tracking-tight text-white">
              Complete Online Examination Platform Modules
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Full-featured platform connecting students, proctors, and teacher administration.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Feature icon={<Clock />} title="Distraction-free exams" text="Countdown timer, question grid, mark-for-review, auto-submit on timeout, and server-side scoring." />
            <Feature icon={<Brain />} title="Smart Learning Intelligence" text="Adaptive practice engine, explain-my-mistakes, personal improvement tracker, and difficulty analytics." />
            <Feature icon={<Trophy />} title="Leaderboards & gamification" text="Official exam rankings, practice streaks, and achievement badges awarded from real activity." />
            <Feature icon={<BarChart3 />} title="Teacher analytics" text="Class averages, score distributions, topic-wise performance, and participation analytics." />
            <Feature icon={<BookOpen />} title="Question bank" text="Reusable, topic-tagged questions with difficulty levels, explanations, and MCQ or True/False support." />
            <Feature icon={<Code />} title="DSA Practice Lab" text="Hands-on interactive visualizers for stacks, sorting, binary search, and hash collision algorithms." />
          </div>
        </div>
      </section>

      {/* Collegiate Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-center text-xs text-slate-400">
        <p className="font-bold text-white text-sm">Micro Project 15 — Online Exam System | DSA Exam IA3</p>
        <p className="mt-1 text-slate-400">
          Department of Computer Science &amp; Engineering • Academic Year 2025-2026
        </p>
        <p className="mt-2 font-mono text-[11px] text-indigo-400">
          Team: B Solomon (URK25CS1191) • Dasanapu Murari (URK25CS1175) • Kothapalli Spoody Rex (URK25CS1162) • V Ganesh Reddy (URK25CS1168)
        </p>
      </footer>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card-academic rounded-2xl p-6 transition-all hover:border-indigo-400 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30">{icon}</div>
      <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
      <p className="mt-2 text-xs text-slate-400 leading-relaxed">{text}</p>
    </div>
  );
}
