import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Button, Card, Spinner } from '@/components/ui';

export default function Login() {
  const { profile, enterDemo } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { push } = useToast();
  const hintRole = params.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      navigate(profile.role === 'teacher' ? '/teacher' : '/student', { replace: true });
    }
  }, [profile, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in both fields.'); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    push('Welcome back!', 'success');
    setTimeout(() => navigate('/'), 300);
  }

  return (
    <AuthShell title="Log in to ExamEase" subtitle={hintRole ? `Logging in as ${hintRole}` : 'Welcome back'}>
      <form onSubmit={submit} className="space-y-4">
        {error && <ErrorBox message={error} />}
        <Field icon={<Mail size={16} />} label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-white placeholder-slate-500" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field icon={<Lock size={16} />} label="Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-white placeholder-slate-500" placeholder="••••••••" autoComplete="current-password" />
        </Field>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : <>Log in <ArrowRight size={16} /></>}
        </Button>
      </form>
      <div className="mt-6 pt-5 border-t border-slate-800">
        <p className="text-xs text-center text-slate-400 mb-3 font-semibold uppercase tracking-wider">Instant 1-Click Evaluation Demo</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { enterDemo('student'); navigate('/student'); }}
          >
            Student Demo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { enterDemo('teacher'); navigate('/teacher'); }}
          >
            Teacher Demo
          </Button>
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-slate-400">
        No account? <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300">Create one</Link>
      </p>
      <p className="mt-2 text-center text-sm text-slate-400">
        <Link to="/get-started?demo=1" className="font-medium text-slate-300 hover:text-white">Try the demo instead</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 bg-blueprint-grid text-slate-100 flex flex-col justify-between">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap size={20} />
          </div>
          <span className="text-lg font-bold text-white">ExamEase</span>
        </Link>
        <Link to="/get-started"><Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">Get Started</Button></Link>
      </header>
      <div className="mx-auto w-full max-w-md px-6 py-10">
        <Card className="p-8 border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
          <h1 className="text-2xl font-black tracking-tight text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
      </div>
      <footer className="py-6 text-center text-xs text-slate-600">
        Micro Project 15 — Online Exam System & DSA Lab
      </footer>
    </div>
  );
}

export function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2.5 text-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
        <span className="text-slate-400">{icon}</span>
        {children}
      </div>
    </label>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-300 ring-1 ring-red-500/30">
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-400" />
      <span>{message}</span>
    </div>
  );
}
