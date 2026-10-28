import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Flag, Eraser, Send, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { supabase, type Exam, type StartExamQuestion, type Attempt } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useDemo } from '@/hooks/useDemo';
import { useToast } from '@/context/ToastContext';
import { Button, Card, Spinner, Badge } from '@/components/ui';
import { demoExams, demoQuestions, demoExamQuestions } from '@/demo/data';

type AnswerMap = Record<string, number | null>; // questionId -> display index

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const { isDemo } = useDemo();
  const { profile } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<StartExamQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  // DSA CO1: LIFO Stack for question navigation history
  const [navStack, setNavStack] = useState<number[]>([]);
  const [stackActionNotice, setStackActionNotice] = useState<string>('Stack initialized');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [secsLeft, setSecsLeft] = useState(0);
  const autoedRef = useRef(false);

  // load or start
  useEffect(() => {
    if (!id) return;
    if (isDemo) {
      const ex = demoExams.find((e) => e.id === id);
      if (!ex) { setError('Exam not found'); setLoading(false); return; }
      setExam(ex);
      const qids = demoExamQuestions[ex.id] || [];
      const qs: StartExamQuestion[] = qids.map((qid) => {
        const q = demoQuestions.find((x) => x.id === qid)!;
        return { id: q.id, text: q.question_text, choices: q.choices, display_order: q.choices.map((_, i) => i), type: q.type, marks: q.marks, topic: q.topic, difficulty: q.difficulty };
      });
      setQuestions(qs);
      setAttempt({ id: 'demo-attempt-' + ex.id, exam_id: ex.id, user_id: profile?.id || '', status: 'in_progress', score: 0, total_marks: ex.total_marks, started_at: new Date().toISOString(), submitted_at: null, time_taken_sec: null });
      setLoading(false);
      return;
    }
    (async () => {
      // find existing in-progress attempt
      const { data: ex } = await supabase.from('exams').select('*').eq('id', id).maybeSingle();
      if (!ex) { setError('Exam not found'); setLoading(false); return; }
      setExam(ex as Exam);
      const { data: existing } = await supabase.from('attempts').select('*').eq('exam_id', id).eq('status', 'in_progress').maybeSingle();
      if (existing) {
        // resume: need questions. We can't re-call start_exam (max attempts).
        // Fetch questions via exam_questions join is restricted to teachers.
        // Workaround: call start_exam only if no in-progress attempt; here we
        // cannot get the questions back without re-running start_exam. To keep
        // things simple and secure, we treat resume as: if there is an
        // in-progress attempt, start a fresh start_exam only when attempts < max.
        // For robustness in this version, we error and ask user to submit.
        setError('You have an in-progress attempt. Please submit it (refreshing the exam tab is not supported in this version).');
        setLoading(false);
        return;
      }
      const { data, error: rpcErr } = await supabase.rpc('start_exam', { p_exam_id: id });
      if (rpcErr) { setError(rpcErr.message); setLoading(false); return; }
      const r = (Array.isArray(data) ? (data[0] as { attempt_id: string; questions: StartExamQuestion[] }) : (data as { attempt_id: string; questions: StartExamQuestion[] }));
      setAttempt({ id: r.attempt_id, exam_id: id, user_id: profile?.id || '', status: 'in_progress', score: 0, total_marks: (ex as Exam).total_marks, started_at: new Date().toISOString(), submitted_at: null, time_taken_sec: null });
      setQuestions(r.questions);
      setLoading(false);
    })();
  }, [id, isDemo, profile]);

  // timer
  useEffect(() => {
    if (!exam || !attempt || loading) return;
    const endMs = new Date(attempt.started_at).getTime() + exam.duration_min * 60 * 1000;
    const tick = () => {
      const left = Math.max(0, Math.floor((endMs - Date.now()) / 1000));
      setSecsLeft(left);
      if (left <= 0 && !autoedRef.current) {
        autoedRef.current = true;
        submit(true);
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam, attempt, loading]);

  const submit = useCallback(async (auto: boolean) => {
    if (!attempt || !exam) return;
    setSubmitting(true);
    if (isDemo) {
      // local grading for demo
      let score = 0;
      questions.forEach((q) => {
        const sel = answers[q.id];
        if (sel == null) return;
        const actual = q.display_order[sel];
        const demoQ = demoQuestions.find((d) => d.id === q.id);
        if (!demoQ) return;
        if (actual === demoQ.correct_index) score += q.marks;
        else score -= exam.negative_marking * q.marks;
      });
      if (score < 0) score = 0;
      setSubmitting(false);
      navigate(`/student/results/${attempt.id}`, { state: { demoScore: score, demoTotal: exam.total_marks, demoExamId: exam.id, demoAnswers: answers, demoQuestions: questions } });
      return;
    }
    const payload = questions.map((q) => ({ question_id: q.id, selected_index: answers[q.id] == null ? '' : String(answers[q.id]) }));
    const { error: rpcErr } = await supabase.rpc('submit_exam', { p_attempt_id: attempt.id, p_answers: payload, p_auto: auto });
    setSubmitting(false);
    if (rpcErr) { push(rpcErr.message, 'error'); return; }
    navigate(`/student/results/${attempt.id}`);
  }, [attempt, exam, isDemo, answers, questions, navigate, push]);

  const answeredCount = useMemo(() => questions.filter((q) => answers[q.id] != null).length, [questions, answers]);
  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const low = secsLeft <= 60;

  if (loading) return <div className="flex items-center gap-2 text-slate-500"><Spinner /> Loading exam…</div>;
  if (error) return (
    <Card className="p-6">
      <div className="flex items-start gap-2 text-red-700"><AlertCircle size={18} className="mt-0.5" /><p>{error}</p></div>
      <Link to="/student/exams" className="mt-4 inline-block"><Button variant="outline" size="sm">Back to exams</Button></Link>
    </Card>
  );
  if (!exam || questions.length === 0) return <Card className="p-6"><p>This exam has no questions yet.</p></Card>;

  const q = questions[current];

  return (
    <div className="mx-auto max-w-5xl">
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md px-5 py-3.5 shadow-xl">
        <div>
          <p className="font-bold text-white text-base">{exam.title}</p>
          <p className="text-xs text-indigo-400 font-medium">{exam.subject} · {exam.total_marks} marks · negative {exam.negative_marking} · CO1 LIFO Stack Active</p>
        </div>
        <div className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono font-bold text-sm ${low ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/40 animate-pulse' : 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30'}`}>
          <Clock size={16} /> {mm}:{ss}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        {/* question card */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Question {current + 1} of {questions.length}</span>
            <div className="flex gap-2">
              <Badge color="blue">{q.topic}</Badge>
              <Badge color={q.difficulty === 'easy' ? 'green' : q.difficulty === 'medium' ? 'amber' : 'red'}>{q.difficulty}</Badge>
              <Badge color="slate">{q.marks}m</Badge>
            </div>
          </div>
          <p className="mt-4 text-lg font-medium">{q.text}</p>
          <div className="mt-5 space-y-2">
            {q.choices.map((c, i) => {
              const sel = answers[q.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${sel ? 'border-indigo-500 bg-indigo-950/50 text-white ring-2 ring-indigo-500/30 shadow-md' : 'border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80 hover:border-slate-700'}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${sel ? 'border-indigo-400 bg-indigo-600 text-white shadow-sm' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>{String.fromCharCode(65 + i)}</span>
                  {c}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (navStack.length > 0) {
                    const top = navStack[navStack.length - 1];
                    setNavStack((s) => s.slice(0, -1));
                    setStackActionNotice(`POP() → Back to Q${top + 1} (LIFO)`);
                    setCurrent(top);
                  } else if (current > 0) {
                    setCurrent((c) => c - 1);
                    setStackActionNotice(`Stack empty → Step back to Q${current}`);
                  }
                }}
                disabled={current === 0 && navStack.length === 0}
              >
                <ChevronLeft size={15} /> Prev (Pop Stack)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (current < questions.length - 1) {
                    setNavStack((s) => [...s, current]);
                    setStackActionNotice(`PUSH(Q${current + 1}) → moved to Q${current + 2}`);
                    setCurrent((c) => c + 1);
                  }
                }}
                disabled={current === questions.length - 1}
              >
                Next (Push Stack) <ChevronRight size={15} />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMarked((m) => ({ ...m, [q.id]: !m[q.id] }))}><Flag size={15} /> {marked[q.id] ? 'Unmark' : 'Mark for review'}</Button>
              <Button variant="ghost" size="sm" onClick={() => setAnswers((a) => ({ ...a, [q.id]: null }))}><Eraser size={15} /> Clear</Button>
            </div>
          </div>
        </Card>

        {/* navigator */}
        <Card className="p-4 h-fit">
          <p className="text-sm font-semibold text-slate-700">Navigator</p>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {questions.map((qq, i) => {
              const ans = answers[qq.id] != null;
              const mk = marked[qq.id];
              return (
                <button
                  key={qq.id}
                  onClick={() => {
                    if (i !== current) {
                      setNavStack((s) => [...s, current]);
                      setStackActionNotice(`PUSH(Q${current + 1}) → jumped to Q${i + 1}`);
                      setCurrent(i);
                    }
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${i === current ? 'ring-2 ring-indigo-400 font-black shadow-md' : ''} ${ans ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-700/60' : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:bg-slate-700'} ${mk ? 'ring-2 ring-amber-400' : ''}`}
                >
                  {ans ? <CheckCircle2 size={14} /> : <Circle size={14} />}{i + 1}
                </button>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5 text-xs text-slate-600">
            <p className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-600" /> Answered: {answeredCount}/{questions.length}</p>
            <p className="flex items-center gap-1.5"><Flag size={13} className="text-amber-600" /> Marked: {Object.values(marked).filter(Boolean).length}</p>
          </div>
          <Button className="mt-4 w-full" onClick={() => setConfirmOpen(true)} disabled={submitting}><Send size={15} /> Submit</Button>

          {/* DSA Integration: CO 1 Navigation Stack */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                LIFO Navigation Stack
              </span>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800">
                CO 1
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 font-mono">
              Action: <span className="font-semibold text-blue-600">{stackActionNotice}</span>
            </p>

            <div className="mt-2 space-y-1">
              <div className="rounded border border-blue-400 bg-blue-50 px-2 py-1 text-center font-mono text-xs font-bold text-blue-900 shadow-xs">
                ▲ Current Top: Q{current + 1}
              </div>

              {navStack.slice().reverse().map((qIdx, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-center font-mono text-xs text-slate-600"
                >
                  Stack Frame [{navStack.length - sIdx}]: Q{qIdx + 1}
                </div>
              ))}

              {navStack.length === 0 && (
                <div className="text-center text-[10px] text-slate-400 italic py-1">
                  (Stack is empty - initial question)
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-bold">Submit examination?</h3>
            <p className="mt-2 text-sm text-slate-600">You've answered {answeredCount} of {questions.length} questions. {answeredCount < questions.length && 'Unanswered questions score 0.'}</p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button onClick={() => submit(false)} disabled={submitting}>{submitting ? <Spinner /> : 'Confirm submit'}</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
