import { useState } from 'react';
import { Users, BookOpen, Layers, Hash, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface TeamMember {
  name: string;
  regNo: string;
  role: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'B Solomon', regNo: 'URK25CS1191', role: 'Full Stack & Stacks Integration' },
  { name: 'Dasanapu Murari', regNo: 'URK25CS1175', role: 'Hash Tables & Collision Algorithms' },
  { name: 'Kothapalli Spoody Rex', regNo: 'URK25CS1162', role: 'Binary Search & Result Retrieval' },
  { name: 'V Ganesh Reddy', regNo: 'URK25CS1168', role: 'UI/UX & Interactive Visualizers' },
];

export const COURSE_OUTCOMES = [
  {
    code: 'CO 1',
    title: 'Linear Data Structures',
    desc: 'Develop efficient solutions using relevant linear data structures.',
    application: 'LIFO Stack used for question navigation history, allowing instant undo, backtracking, and previous-question stack retrieval.',
    badge: 'Stack (LIFO)',
    color: 'from-blue-500 to-indigo-600',
    lightColor: 'bg-blue-50 border-blue-200 text-blue-900',
  },
  {
    code: 'CO 3',
    title: 'Searching & Sorting Algorithms',
    desc: 'Evaluate the performance of searching and sorting algorithms for solving engineering problems.',
    application: 'Binary Search applied to sorted student registration numbers and test scores for logarithmic O(log n) instantaneous result lookup.',
    badge: 'Binary Search O(log n)',
    color: 'from-amber-500 to-orange-600',
    lightColor: 'bg-amber-50 border-amber-200 text-amber-900',
  },
  {
    code: 'CO 4',
    title: 'Dynamic Data Structures & Tables',
    desc: 'Develop tree & dynamic table structures for efficient storage and retrieval in engineering problems.',
    application: 'Hash Tables with Separate Chaining, Linear Probing, Quadratic Probing & Double Hashing to store student records and exam scores with O(1) average lookup.',
    badge: 'Hash Tables O(1)',
    color: 'from-purple-500 to-pink-600',
    lightColor: 'bg-purple-50 border-purple-200 text-purple-900',
  },
];

export default function ProjectBanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <div className="relative z-30 border-b border-indigo-900/60 bg-blueprint-grid text-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/30 px-2.5 py-0.5 font-bold tracking-wide text-indigo-300 ring-1 ring-indigo-400/30">
              <Sparkles size={12} className="text-indigo-400" /> Micro Project 15
            </span>
            <span className="font-semibold text-slate-200">Online Exam System</span>
            <span className="hidden text-slate-400 sm:inline">•</span>
            <span className="hidden text-slate-300 md:inline">DSA Exam IA3</span>
            <span className="hidden text-slate-400 lg:inline">•</span>
            <span className="hidden text-indigo-300 lg:inline">CO1, CO3, CO4 Integrated</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/hashing-hub"
              className="flex items-center gap-1 rounded-lg bg-purple-600/40 px-2.5 py-1 font-semibold text-purple-200 transition-colors hover:bg-purple-600/70 hover:text-white"
            >
              <Hash size={12} /> Hashing & Formulas Hub
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Users size={12} /> Team & Project Details
            </button>
          </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl sm:p-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/30">
                  DSA Exam IA3 Micro Project
                </span>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400 ring-1 ring-purple-500/30">
                  Project No. 15
                </span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
                  EdTech Platform
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Online Examination System
              </h2>
              <p className="mt-1.5 text-sm text-slate-400">
                Industry Focus: <strong className="text-slate-200">Education & EdTech Platforms</strong> • Integrated Course Outcomes: <strong className="text-indigo-300">CO1, CO3, CO4</strong>
              </p>
            </div>

            {/* Team Members */}
            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                <Users size={16} className="text-indigo-400" /> Project Team Members
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {TEAM_MEMBERS.map((m, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-800/60 p-4 transition-all hover:border-indigo-500/50 hover:bg-slate-800/90"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30 font-mono font-bold text-indigo-300 ring-1 ring-indigo-500/40">
                      0{i + 1}
                    </div>
                    <p className="mt-3 font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {m.name}
                    </p>
                    <p className="font-mono text-xs font-semibold text-indigo-400">{m.regNo}</p>
                    <p className="mt-1 text-xs text-slate-400">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Outcomes & Scope */}
            <div className="mt-6">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                <BookOpen size={16} className="text-indigo-400" /> Integrated Course Outcomes & DSA Scope
              </h3>
              <div className="mt-3 space-y-3">
                {COURSE_OUTCOMES.map((co, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-800 bg-slate-800/40 p-4 transition-colors hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono text-xs font-bold text-indigo-300">
                          {co.code}
                        </span>
                        <h4 className="font-bold text-slate-200">{co.title}</h4>
                      </div>
                      <span className="rounded-full bg-slate-700/60 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                        {co.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{co.desc}</p>
                    <div className="mt-2.5 rounded-lg border border-slate-700/60 bg-slate-900/80 p-2.5 text-xs text-slate-300">
                      <span className="font-semibold text-indigo-400">Application in System: </span>
                      {co.application}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
              <div className="flex flex-wrap gap-2">
                <Link
                  to="/hashing-hub"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-purple-500 hover:to-indigo-500"
                >
                  <Hash size={14} /> Open Hashing & Formulas Hub
                </Link>
                <Link
                  to="/student/dsa-lab"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  <Layers size={14} /> Interactive DSA Lab
                </Link>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
