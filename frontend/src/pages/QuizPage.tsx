import { useEffect, useState, useRef } from 'react';
import {
  HelpCircle, ChevronRight, ChevronLeft, Wand2, Clock,
  CheckCircle2, XCircle, RotateCcw, FileText, BookOpen,
  TrendingUp, TrendingDown, Minus, AlertCircle,
} from 'lucide-react';
import Button from '../components/Button';
import { API, getToken, fmtDate, diffBadge } from '../lib/utils';

type Stage = 'subject' | 'summary' | 'generating' | 'exam' | 'results';

interface Subject  { name: string; commandLevel?: number; }
interface SumMeta  { _id: string; summaryText: string; sourceType: string; fileName?: string; createdAt: string; }
interface Question { question: string; options: string[]; }
interface Quiz     { _id: string; subject: string; difficulty: string; questions: Question[]; sourceSummary?: SumMeta; }
interface Breakdown { questionIndex: number; selectedIndex: number; correctIndex: number; isCorrect: boolean; questionText: string; options: string[]; }
interface Result    { score: number; totalQuestions: number; scorePercent: number; breakdown: Breakdown[]; commandLevelUpdate: { previous: number; current: number; changed: boolean }; }

const EXAM_SECS = 10 * 60;

function useTimer(active: boolean, onExpire: () => void) {
  const [left, setLeft] = useState(EXAM_SECS);
  const ref = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    if (!active) return;
    setLeft(EXAM_SECS);
    ref.current = setInterval(() => setLeft(p => { if (p <= 1) { clearInterval(ref.current); onExpire(); return 0; } return p - 1; }), 1000);
    return () => clearInterval(ref.current);
  }, [active]);
  const mm  = String(Math.floor(left / 60)).padStart(2, '0');
  const ss  = String(left % 60).padStart(2, '0');
  return { fmt: `${mm}:${ss}`, pct: (left / EXAM_SECS) * 100, urgent: left < 60 };
}

export default function QuizPage() {
  const token = getToken();
  const [stage, setStage]       = useState<Stage>('subject');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subject, setSubject]   = useState('');
  const [sums, setSums]         = useState<SumMeta[]>([]);
  const [chosenSum, setChosenSum] = useState<SumMeta | null>(null);
  const [loadSums, setLoadSums] = useState(false);
  const [quiz, setQuiz]         = useState<Quiz | null>(null);
  const [answers, setAnswers]   = useState<number[]>([]);
  const [result, setResult]     = useState<Result | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [examActive, setExam]   = useState(false);
  const timer = useTimer(examActive, () => submit(true));

  useEffect(() => {
    fetch(`${API}/user/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setSubjects(d.subjects || [])).catch(() => {});
  }, []);

  const goPickSummary = async () => {
    if (!subject) return;
    setStage('summary'); setLoadSums(true); setSums([]); setChosenSum(null);
    try {
      const res  = await fetch(`${API}/quiz/summaries/${encodeURIComponent(subject)}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setSums(data.summaries || []);
    } catch {} finally { setLoadSums(false); }
  };

  const generate = async () => {
    setStage('generating');
    try {
      const body: any = { subject };
      if (chosenSum) body.summaryId = chosenSum._id;
      const res  = await fetch(`${API}/quiz/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Generation failed'); setStage('summary'); return; }
      setQuiz(data);
      setAnswers(new Array(data.questions.length).fill(-1));
      setCurrentQ(0);
      setStage('exam');
      setExam(true);
    } catch { alert('Failed to generate quiz'); setStage('summary'); }
  };

  const submit = async (auto = false) => {
    if (!quiz) return;
    setExam(false);
    const payload = answers.map((selectedIndex, questionIndex) => ({ questionIndex, selectedIndex }));
    try {
      const res  = await fetch(`${API}/quiz/attempt`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ quizId: quiz._id, answers: payload }) });
      const data = await res.json();
      setResult(data);
      setStage('results');
    } catch { alert('Failed to submit'); }
  };

  const reset = () => {
    setStage('subject'); setSubject(''); setSums([]); setChosenSum(null);
    setQuiz(null); setAnswers([]); setResult(null); setExam(false); setCurrentQ(0);
  };

  const answered = answers.filter(a => a !== -1).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">AI Quiz</h1>
          <p className="page-sub">Questions generated from your own summaries — difficulty adapts to your level</p>
        </div>
        {stage !== 'subject' && stage !== 'generating' && (
          <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="w-3.5 h-3.5" /> New Quiz</Button>
        )}
      </div>

      {/* ── Stage 1: Pick Subject ── */}
      {stage === 'subject' && (
        <div className="max-w-md">
          <div className="card p-6">
            <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--text)' }}>Select Subject</h2>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Questions will be based on your saved summaries for this subject.</p>
            {!subjects.length ? (
              <div className="empty-state">
                <BookOpen className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>No subjects yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="label">Subject</label>
                  <select className="select" value={subject} onChange={e => setSubject(e.target.value)}>
                    <option value="">— Choose a subject —</option>
                    {subjects.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <Button onClick={goPickSummary} disabled={!subject} fullWidth>
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Stage 2: Pick Summary ── */}
      {stage === 'summary' && (
        <div className="max-w-2xl">
          <button onClick={() => setStage('subject')} className="flex items-center gap-1 text-sm mb-4 transition-colors" style={{ color: 'var(--muted)' }} onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="card p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Choose a Summary</h2>
              <span className="badge badge-blue">{subject}</span>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>The AI generates questions based on the summary you pick.</p>
            {loadSums ? (
              <div className="flex items-center justify-center py-10 gap-3">
                <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>Loading summaries…</span>
              </div>
            ) : !sums.length ? (
              <div className="empty-state">
                <FileText className="w-8 h-8" style={{ color: 'var(--border-2)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>No summaries for this subject</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Go to Summarizer and create one first</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                  {sums.map(s => {
                    const active = chosenSum?._id === s._id;
                    return (
                      <button key={s._id} onClick={() => setChosenSum(s)} className="w-full text-left p-4 rounded-xl transition-all" style={{ border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`, background: active ? 'var(--primary-light)' : 'var(--surface)' }}>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`badge ${s.sourceType === 'file' ? 'badge-gray' : 'badge-blue'}`}>{s.sourceType === 'file' ? `📄 ${s.fileName || 'File'}` : '✏️ Text'}</span>
                            <span className="text-xs" style={{ color: 'var(--muted)' }}>{fmtDate(s.createdAt)}</span>
                          </div>
                          {active && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />}
                        </div>
                        <p className="text-sm line-clamp-2" style={{ color: active ? 'var(--primary)' : 'var(--text-2)' }}>{s.summaryText}</p>
                      </button>
                    );
                  })}
                </div>
                {!chosenSum && (
                  <p className="flex items-center gap-1.5 text-xs mb-3" style={{ color: 'var(--warning)' }}>
                    <AlertCircle className="w-3.5 h-3.5" /> No selection — will use most recent summary
                  </p>
                )}
                <Button onClick={generate} fullWidth>
                  <Wand2 className="w-4 h-4" /> Generate Quiz {chosenSum ? '(selected)' : '(latest)'}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Stage 3: Generating ── */}
      {stage === 'generating' && (
        <div className="max-w-md">
          <div className="card p-10 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'var(--primary-light)' }}>
              <div className="w-7 h-7 rounded-full border-[3px] animate-spin" style={{ borderColor: 'var(--primary-border)', borderTopColor: 'var(--primary)' }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Crafting your quiz…</h2>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>AI is reading your <strong>{subject}</strong> summary and writing questions adapted to your level.</p>
          </div>
        </div>
      )}

      {/* ── Stage 4: Exam ── */}
      {stage === 'exam' && quiz && (
        <div className="max-w-2xl">
          {/* Exam bar */}
          <div className="card p-4 mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{quiz.subject}</span>
              <span className={diffBadge(quiz.difficulty)}>{quiz.difficulty}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs" style={{ color: 'var(--muted)' }}>{answered}/{quiz.questions.length} answered</span>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-sm font-semibold" style={{ background: timer.urgent ? 'var(--error-light)' : 'var(--surface-2)', color: timer.urgent ? 'var(--error)' : 'var(--text-2)', border: `1px solid ${timer.urgent ? 'var(--error-border)' : 'var(--border)'}` }}>
                <Clock className="w-3.5 h-3.5" /> {timer.fmt}
              </div>
            </div>
          </div>

          {/* Timer bar */}
          <div className="progress-track mb-4">
            <div className={`progress-fill ${timer.urgent ? 'progress-red' : ''}`} style={{ width: `${timer.pct}%`, transition: 'width 1s linear' }} />
          </div>

          {/* Question dots */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {quiz.questions.map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)} className="w-8 h-8 rounded-lg text-xs font-semibold transition-all" style={{ background: i === currentQ ? 'var(--primary)' : answers[i] !== -1 ? 'var(--primary-light)' : 'var(--surface-2)', color: i === currentQ ? '#fff' : answers[i] !== -1 ? 'var(--primary)' : 'var(--muted)', border: `1.5px solid ${i === currentQ ? 'var(--primary)' : answers[i] !== -1 ? 'var(--primary-border)' : 'var(--border)'}` }}>
                {i + 1}
              </button>
            ))}
          </div>

          {/* Question */}
          <div className="card p-6 mb-4">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Question {currentQ + 1} of {quiz.questions.length}</p>
            <p className="text-base font-semibold mb-5 leading-relaxed" style={{ color: 'var(--text)' }}>{quiz.questions[currentQ].question}</p>
            <div className="space-y-2.5">
              {quiz.questions[currentQ].options.map((opt, oi) => {
                const sel = answers[currentQ] === oi;
                return (
                  <label key={oi} className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all" style={{ border: `2px solid ${sel ? 'var(--primary)' : 'var(--border)'}`, background: sel ? 'var(--primary-light)' : 'var(--surface)' }}>
                    <input type="radio" className="s-radio" name={`q${currentQ}`} checked={sel} onChange={() => { const a = [...answers]; a[currentQ] = oi; setAnswers(a); }} />
                    <span className="text-sm font-medium" style={{ color: sel ? 'var(--primary)' : 'var(--text-2)' }}>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" disabled={currentQ === 0} onClick={() => setCurrentQ(q => q - 1)}>
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            {currentQ < quiz.questions.length - 1 ? (
              <Button size="sm" onClick={() => setCurrentQ(q => q + 1)}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={() => submit(false)} disabled={answered < quiz.questions.length} style={{ background: 'var(--success)' }}>
                Submit Exam
              </Button>
            )}
          </div>
          {currentQ === quiz.questions.length - 1 && answered < quiz.questions.length && (
            <p className="text-xs text-center mt-3" style={{ color: 'var(--muted)' }}>Answer all {quiz.questions.length} questions to submit</p>
          )}
        </div>
      )}

      {/* ── Stage 5: Results ── */}
      {stage === 'results' && result && (
        <div className="max-w-2xl">
          {/* Score card */}
          <div className="card p-6 mb-5" style={{ borderColor: result.scorePercent >= 70 ? 'var(--success-border)' : 'var(--error-border)', borderWidth: 2 }}>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: result.scorePercent >= 70 ? 'var(--success-light)' : 'var(--error-light)' }}>
                <span className="text-2xl font-black" style={{ color: result.scorePercent >= 70 ? 'var(--success)' : 'var(--error)' }}>{result.scorePercent}%</span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-0.5" style={{ color: 'var(--text)' }}>
                  {result.scorePercent >= 80 ? '🎉 Excellent!' : result.scorePercent >= 60 ? '👍 Good effort' : '📚 Keep studying'}
                </h2>
                <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>{result.score} / {result.totalQuestions} correct · {quiz?.subject}</p>
                <div className="progress-track">
                  <div className={`progress-fill ${result.scorePercent >= 70 ? 'progress-green' : 'progress-red'}`} style={{ width: `${result.scorePercent}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* commandLevel update banner */}
          {result.commandLevelUpdate?.changed && (
            <div className="flex items-center gap-3 p-4 rounded-xl mb-5" style={{ background: result.commandLevelUpdate.current > result.commandLevelUpdate.previous ? 'var(--success-light)' : 'var(--warning-light)', border: `1px solid ${result.commandLevelUpdate.current > result.commandLevelUpdate.previous ? 'var(--success-border)' : 'var(--warning-border)'}` }}>
              {result.commandLevelUpdate.current > result.commandLevelUpdate.previous
                ? <TrendingUp className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--success)' }} />
                : <TrendingDown className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--warning)' }} />}
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {result.commandLevelUpdate.current > result.commandLevelUpdate.previous ? 'Level Up! 🎯' : 'Level Adjusted'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-2)' }}>
                  {quiz?.subject} command level: {result.commandLevelUpdate.previous} → <strong>{result.commandLevelUpdate.current}</strong>.
                  {' '}{result.commandLevelUpdate.current > result.commandLevelUpdate.previous ? 'Next quiz will be harder.' : 'Next quiz will be easier.'}
                </p>
              </div>
            </div>
          )}

          {!result.commandLevelUpdate?.changed && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <Minus className="w-4 h-4" style={{ color: 'var(--muted)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Command level unchanged (score between 40–80%).</p>
            </div>
          )}

          {/* Answer review */}
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>Answer Review</h3>
          <div className="space-y-4 mb-6">
            {result.breakdown.map((item, i) => (
              <div key={i} className="card p-5" style={{ borderLeft: `4px solid ${item.isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
                <div className="flex items-start gap-2 mb-3">
                  {item.isCorrect ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--success)' }} /> : <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--error)' }} />}
                  <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text)' }}>Q{i+1}. {item.questionText}</p>
                </div>
                <div className="space-y-1.5 ml-6">
                  {item.options.map((opt, oi) => {
                    const isCorrect  = oi === item.correctIndex;
                    const isSelected = oi === item.selectedIndex;
                    const isWrong    = isSelected && !isCorrect;
                    let bg = 'transparent', color = 'var(--muted)', border = 'transparent';
                    if (isCorrect) { bg = 'var(--success-light)'; color = 'var(--success)'; border = 'var(--success-border)'; }
                    else if (isWrong) { bg = 'var(--error-light)'; color = 'var(--error)'; border = 'var(--error-border)'; }
                    return (
                      <div key={oi} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: bg, color, border: `1px solid ${border}` }}>
                        {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                        {isWrong   && <XCircle      className="w-3.5 h-3.5 flex-shrink-0" />}
                        {!isCorrect && !isWrong && <span className="w-3.5" />}
                        <span className="font-medium flex-1">{opt}</span>
                        {isCorrect && <span className="text-xs font-semibold">Correct</span>}
                        {isWrong   && <span className="text-xs font-semibold">Your answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={reset}><RotateCcw className="w-4 h-4" /> Take another quiz</Button>
        </div>
      )}
    </div>
  );
}
