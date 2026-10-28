import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';

export type NavItem = { to: string; label: string; icon: ReactNode };

export function DashboardShell({ items, accent }: { items: NavItem[]; accent: 'blue' | 'emerald' }) {
  const { profile, signOut, isDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const accents = {
    blue: { 
      bar: 'bg-indigo-600 shadow-indigo-500/20', 
      soft: 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30', 
      ring: 'ring-indigo-500/30' 
    },
    emerald: { 
      bar: 'bg-emerald-600 shadow-emerald-500/20', 
      soft: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30', 
      ring: 'ring-emerald-500/30' 
    },
  };
  const a = accents[accent];

  async function logout() {
    await signOut();
    navigate('/');
  }

  const Sidebar = (
    <div className="flex h-full flex-col bg-slate-950 border-r border-slate-800/80 text-slate-200">
      <Link to="/" className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60 bg-slate-900/40">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${a.bar} text-white shadow-md`}><GraduationCap size={20} /></div>
        <div>
          <span className="text-base font-black tracking-tight text-white block">ExamEase</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Micro-Project #15</span>
        </div>
      </Link>
      {isDemo && (
        <div className={`mx-3 my-2.5 rounded-lg ${a.soft} px-3 py-2 text-xs font-semibold ring-1 ${a.ring} flex items-center gap-1.5`}>
          <Sparkles size={13} className="text-indigo-400" /> Demo mode — sample data
        </div>
      )}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((it) => {
          const activeLink = location.pathname === it.to || location.pathname.startsWith(it.to + '/');
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${activeLink ? `${a.soft}` : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'}`}
            >
              <span className={activeLink ? 'text-indigo-400' : 'text-slate-500'}>{it.icon}</span>
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800/80 p-3 bg-slate-900/50">
        <div className="mb-2 truncate px-2 text-sm">
          <p className="font-semibold text-white">{profile?.full_name}</p>
          <p className="text-xs text-indigo-400 capitalize">{profile?.role}</p>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-slate-400 hover:text-white" onClick={logout}>
          <LogOut size={16} /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 bg-engineering-grid text-slate-100">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-800/80 bg-slate-950 lg:block">{Sidebar}</aside>

      {/* mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-slate-950 border-r border-slate-800">{Sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* mobile top bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"><Menu size={20} /></button>
          <span className="font-bold text-white">ExamEase</span>
          <button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"><LogOut size={18} /></button>
        </div>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
