import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { GraduationCap, User, Presentation, Play, ArrowRight, Sparkles, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button, Card } from '@/components/ui';

export default function GetStarted() {
  const { profile, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    if (profile) navigate(profile.role === 'teacher' ? '/teacher' : '/student', { replace: true });
  }, [profile, navigate]);

  function startDemo(role: 'student' | 'teacher') {
    enterDemo(role);
    navigate(role === 'teacher' ? '/teacher' : '/student');
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-blueprint-grid text-slate-100 flex flex-col justify-between">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap size={20} />
          </div>
          <span className="text-lg font-bold text-white">ExamEase</span>
        </Link>
        <Link to="/login"><Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Login</Button></Link>
      </header>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 ring-1 ring-indigo-500/30">
            <Sparkles size={13} /> Get Started
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Choose how you'd like to begin</h1>
          <p className="mt-3 text-slate-400">Log in as a student or teacher, or try a fully functional demo with sample data.</p>
        </div>

        {params.get('demo') === '1' && (
          <div className="mx-auto mb-8 flex max-w-2xl items-start gap-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-3 text-sm text-indigo-200">
            <Info size={18} className="mt-0.5 shrink-0 text-indigo-400" />
            <p>Demo mode lets you explore sample exams, dashboards and analytics with read-only sample data. Create an account to save real progress.</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <ChoiceCard
            icon={<User size={22} />}
            title="Student Login"
            desc="Take exams, practice in the DSA Lab, track your progress and climb leaderboards."
            cta="Login as Student"
            onClick={() => navigate('/login?role=student')}
            accent="blue"
          />
          <ChoiceCard
            icon={<Presentation size={22} />}
            title="Teacher Login"
            desc="Create exams, manage a question bank, view participation and analytics."
            cta="Login as Teacher"
            onClick={() => navigate('/login?role=teacher')}
            accent="emerald"
          />
          <ChoiceCard
            icon={<Play size={22} />}
            title="Try Demo"
            desc="Explore sample data for both student and teacher views — no account needed."
            cta="Start Student Demo"
            secondaryCta="Start Teacher Demo"
            onClick={() => startDemo('student')}
            onSecondary={() => startDemo('teacher')}
            accent="amber"
            demo
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
              Create an account <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-slate-600">
        Micro Project 15 — Online Exam System & DSA Lab
      </footer>
    </div>
  );
}

function ChoiceCard({
  icon, title, desc, cta, secondaryCta, onClick, onSecondary, accent, demo,
}: {
  icon: React.ReactNode; title: string; desc: string; cta: string; secondaryCta?: string;
  onClick: () => void; onSecondary?: () => void; accent: 'blue' | 'emerald' | 'amber'; demo?: boolean;
}) {
  const accents = {
    blue: 'from-indigo-500 to-indigo-600 shadow-indigo-500/30',
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/30',
    amber: 'from-amber-500 to-amber-600 shadow-amber-500/30',
  };
  return (
    <Card className={`flex flex-col p-6 border-slate-800 bg-slate-900/80 backdrop-blur-xl text-white ${demo ? 'ring-2 ring-indigo-500/50' : ''}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accents[accent]} text-white shadow-md`}>{icon}</div>
      <h2 className="mt-4 text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 flex-1 text-sm text-slate-400">{desc}</p>
      <div className="mt-5 flex flex-col gap-2">
        <Button onClick={onClick}>{cta}</Button>
        {secondaryCta && onSecondary && <Button variant="outline" onClick={onSecondary}>{secondaryCta}</Button>}
      </div>
    </Card>
  );
}
