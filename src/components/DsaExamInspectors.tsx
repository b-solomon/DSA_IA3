import { useState, useMemo } from 'react';
import { Search, Hash, Play } from 'lucide-react';
import { Card, Button } from '@/components/ui';

export interface StudentRecord {
  regNo: string;
  name: string;
  score: number;
  totalMarks: number;
  percentage: number;
  exam: string;
}

export const SAMPLE_STUDENTS: StudentRecord[] = [
  { regNo: 'URK25CS1162', name: 'Kothapalli Spoody Rex', score: 19, totalMarks: 20, percentage: 95, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1168', name: 'V Ganesh Reddy', score: 18, totalMarks: 20, percentage: 90, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1175', name: 'Dasanapu Murari', score: 20, totalMarks: 20, percentage: 100, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1191', name: 'B Solomon', score: 20, totalMarks: 20, percentage: 100, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1010', name: 'Aarav Patel', score: 14, totalMarks: 20, percentage: 70, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1025', name: 'Divya Sharma', score: 16, totalMarks: 20, percentage: 80, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1050', name: 'Karan Malhotra', score: 12, totalMarks: 20, percentage: 60, exam: 'DSA IA3 Mock' },
  { regNo: 'URK25CS1088', name: 'Sneha Roy', score: 17, totalMarks: 20, percentage: 85, exam: 'DSA IA3 Mock' },
];

/**
 * Hash Table Student Record & Score Directory (CO 4)
 */
export function StudentRecordHashDirectory() {
  const tableSize = 11;
  const [selectedAlgo, setSelectedAlgo] = useState<'chaining' | 'linear'>('linear');
  const [searchReg, setSearchReg] = useState('');
  const [searchResult, setSearchResult] = useState<{ record?: StudentRecord; slot: number; probes: number; found: boolean } | null>(null);

  // String to numeric hash
  function hashKey(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000003;
    }
    return hash;
  }

  // Build the Hash Table
  const table = useMemo(() => {
    if (selectedAlgo === 'chaining') {
      const buckets: StudentRecord[][] = Array.from({ length: tableSize }, () => []);
      SAMPLE_STUDENTS.forEach((student) => {
        const h = hashKey(student.regNo) % tableSize;
        buckets[h].push(student);
      });
      return buckets;
    } else {
      const slots: (StudentRecord | null)[] = Array.from({ length: tableSize }, () => null);
      SAMPLE_STUDENTS.forEach((student) => {
        const h = hashKey(student.regNo) % tableSize;
        for (let i = 0; i < tableSize; i++) {
          const slot = (h + i) % tableSize;
          if (slots[slot] === null) {
            slots[slot] = student;
            break;
          }
        }
      });
      return slots;
    }
  }, [selectedAlgo]);

  function handleLookup() {
    const q = searchReg.trim().toUpperCase();
    if (!q) return;

    const h = hashKey(q) % tableSize;
    if (selectedAlgo === 'chaining') {
      const bucket = (table as StudentRecord[][])[h] || [];
      const foundIdx = bucket.findIndex((s) => s.regNo.toUpperCase() === q);
      if (foundIdx !== -1) {
        setSearchResult({ record: bucket[foundIdx], slot: h, probes: foundIdx + 1, found: true });
      } else {
        setSearchResult({ slot: h, probes: bucket.length, found: false });
      }
    } else {
      const slots = table as (StudentRecord | null)[];
      let found = false;
      for (let i = 0; i < tableSize; i++) {
        const slot = (h + i) % tableSize;
        if (slots[slot]?.regNo.toUpperCase() === q) {
          setSearchResult({ record: slots[slot]!, slot, probes: i + 1, found: true });
          found = true;
          break;
        } else if (slots[slot] === null) {
          setSearchResult({ slot, probes: i + 1, found: false });
          found = true;
          break;
        }
      }
      if (!found) {
        setSearchResult({ slot: h, probes: tableSize, found: false });
      }
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600 text-white font-bold">
              <Hash size={16} />
            </span>
            <h3 className="text-lg font-bold text-white">
              Student Records & Scores Hash Table
            </h3>
            <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 ring-1 ring-purple-500/30">
              CO 4 Dynamic Tables
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Stores student records indexed by Registration Number. Hash Function: <code className="font-mono text-purple-300">h(regNo) mod {tableSize}</code>. Average lookup time: <strong className="text-white">O(1)</strong>.
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-800 p-1">
          <button
            onClick={() => { setSelectedAlgo('linear'); setSearchResult(null); }}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${selectedAlgo === 'linear' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            Linear Probing (Closed)
          </button>
          <button
            onClick={() => { setSelectedAlgo('chaining'); setSearchResult(null); }}
            className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${selectedAlgo === 'chaining' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            Separate Chaining (Open)
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={searchReg}
          onChange={(e) => setSearchReg(e.target.value)}
          placeholder="Enter Reg No (e.g. URK25CS1191)"
          className="w-64 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-mono text-white placeholder-slate-500 uppercase focus:border-purple-500 focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
        />
        <Button size="sm" onClick={handleLookup}>
          <Search size={14} /> Hash Lookup O(1)
        </Button>
        <div className="flex flex-wrap gap-1.5">
          {['URK25CS1191', 'URK25CS1175', 'URK25CS1162', 'URK25CS1168'].map((r) => (
            <button
              key={r}
              onClick={() => { setSearchReg(r); }}
              className="rounded-md bg-purple-500/20 px-2 py-1 text-xs font-mono font-bold text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 cursor-pointer"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Result feedback */}
      {searchResult && (
        <div className={`mt-3 rounded-xl p-3 text-xs border ${searchResult.found ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/60 border-rose-500/50 text-rose-200'}`}>
          {searchResult.found && searchResult.record ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-bold text-sm text-white">
                  ✓ {searchResult.record.name} ({searchResult.record.regNo})
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Exam: {searchResult.record.exam} • Score: <strong className="text-white">{searchResult.record.score}/{searchResult.record.totalMarks}</strong> ({searchResult.record.percentage}%)
                </p>
              </div>
              <div className="text-right">
                <span className="rounded bg-emerald-500/30 text-emerald-200 px-2 py-0.5 text-[11px] font-mono font-bold border border-emerald-500/40">
                  Slot #{searchResult.slot}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">Found in {searchResult.probes} probe(s)</p>
              </div>
            </div>
          ) : (
            <p className="font-bold">✕ Student record not found in Hash Table. Checked bucket/slot #{searchResult.slot}.</p>
          )}
        </div>
      )}

      {/* Visual Table */}
      <div className="mt-5 space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Hash Buckets (Table Size = {tableSize}):
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {selectedAlgo === 'chaining' ? (
            (table as StudentRecord[][]).map((chain, i) => (
              <div key={i} className={`rounded-lg border p-2.5 text-xs ${searchResult?.slot === i ? 'border-purple-500 bg-purple-950/50 ring-1 ring-purple-400' : 'border-slate-800 bg-slate-900/60'}`}>
                <span className="font-mono font-bold text-slate-400">Bucket [{i}]: </span>
                {chain.length === 0 ? (
                  <span className="text-slate-500 italic">empty</span>
                ) : (
                  <div className="mt-1 space-y-1">
                    {chain.map((c, ci) => (
                      <div key={ci} className="rounded bg-slate-800 p-1.5 border border-slate-700">
                        <span className="font-mono font-bold text-purple-300">{c.regNo}</span>
                        <span className="text-slate-300"> - {c.name} ({c.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            (table as (StudentRecord | null)[]).map((slot, i) => (
              <div key={i} className={`rounded-lg border p-2.5 text-xs ${searchResult?.slot === i ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-400' : 'border-slate-800 bg-slate-900/60'}`}>
                <span className="font-mono font-bold text-slate-400">Slot [{i}]: </span>
                {slot ? (
                  <div className="mt-1 rounded bg-slate-800 p-1.5 border border-slate-700">
                    <span className="font-mono font-bold text-sky-300">{slot.regNo}</span>
                    <p className="text-slate-300">{slot.name} • <strong className="text-white">{slot.score}/{slot.totalMarks}</strong> ({slot.percentage}%)</p>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">empty</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Binary Search Result Retrieval Engine (CO 3)
 */
export function BinarySearchResultFinder() {
  const [targetScore, setTargetScore] = useState<number>(90);
  const [searchHistory, setSearchHistory] = useState<{ step: number; lo: number; hi: number; mid: number; val: number; comp: string }[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  // Sorted list of students by percentage
  const sortedStudents = useMemo(() => {
    return [...SAMPLE_STUDENTS].sort((a, b) => a.percentage - b.percentage);
  }, []);

  function runBinarySearch() {
    const steps: { step: number; lo: number; hi: number; mid: number; val: number; comp: string }[] = [];
    let lo = 0;
    let hi = sortedStudents.length - 1;
    let found = -1;
    let stepCount = 0;

    while (lo <= hi) {
      stepCount++;
      const mid = Math.floor((lo + hi) / 2);
      const val = sortedStudents[mid].percentage;

      if (val === targetScore) {
        steps.push({ step: stepCount, lo, hi, mid, val, comp: `${val}% == ${targetScore}% (FOUND!)` });
        found = mid;
        break;
      } else if (val < targetScore) {
        steps.push({ step: stepCount, lo, hi, mid, val, comp: `${val}% < ${targetScore}% → Go Right (lo = mid + 1)` });
        lo = mid + 1;
      } else {
        steps.push({ step: stepCount, lo, hi, mid, val, comp: `${val}% > ${targetScore}% → Go Left (hi = mid - 1)` });
        hi = mid - 1;
      }
    }

    setSearchHistory(steps);
    setFoundIndex(found);
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white font-bold">
              <Search size={16} />
            </span>
            <h3 className="text-lg font-bold text-white">
              Binary Search Result Retrieval Engine
            </h3>
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 ring-1 ring-amber-500/30">
              CO 3 Logarithmic Search O(log n)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-300">
            Halves search space at each comparison. Efficiently finds student results and merit cutoffs in sorted score records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={targetScore}
            onChange={(e) => setTargetScore(Number(e.target.value))}
            className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-bold text-center text-white focus:border-amber-500 focus:outline-none"
            placeholder="%"
          />
          <Button size="sm" onClick={runBinarySearch}>
            <Play size={14} /> Run Binary Search
          </Button>
        </div>
      </div>

      {/* Array visualization */}
      <div className="mt-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Sorted Student Records Array (by Score Percentage):
        </p>
        <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {sortedStudents.map((s, idx) => {
            const isFound = foundIndex === idx;
            const lastStep = searchHistory[searchHistory.length - 1];
            const isMid = lastStep && lastStep.mid === idx;
            const inRange = lastStep && idx >= lastStep.lo && idx <= lastStep.hi;

            return (
              <div
                key={s.regNo}
                className={`rounded-xl border p-2 text-center transition-all ${
                  isFound
                    ? 'border-emerald-500 bg-emerald-950/80 ring-2 ring-emerald-400 font-bold'
                    : isMid
                    ? 'border-amber-500 bg-amber-950/80 ring-2 ring-amber-400'
                    : inRange
                    ? 'border-blue-500/60 bg-blue-950/40 text-blue-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block text-slate-400">
                  [{idx}]
                </span>
                <span className="text-base font-black text-white block my-1">
                  {s.percentage}%
                </span>
                <span className="text-[10px] font-mono text-slate-300 truncate block">
                  {s.regNo.replace('URK25CS', 'CS')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step trace */}
      {searchHistory.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
            Step-by-Step Search Trace (O(log n)):
          </h4>
          <div className="space-y-1.5 font-mono text-xs">
            {searchHistory.map((st) => (
              <div key={st.step} className="rounded-md bg-slate-900/80 p-2 border border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-200">
                  <strong className="text-amber-400">Step {st.step}:</strong> range [{st.lo} .. {st.hi}] → <strong>mid = {st.mid}</strong> (value = {st.val}%)
                </span>
                <span className={st.comp.includes('FOUND') ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                  {st.comp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
