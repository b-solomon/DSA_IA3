import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, Play, RotateCcw, Search, CheckCircle2, 
  AlertCircle, ChevronRight, Sparkles, BookOpen, Layers, Zap 
} from 'lucide-react';
import { Button } from '@/components/ui';

type HashAlgorithm = 'chaining' | 'linear' | 'quadratic' | 'double';

interface ProbeStep {
  i: number;
  formula: string;
  slot: number;
  occupied: boolean;
  occupantKey?: number;
}

export default function HashingHub() {
  const [selectedAlgo, setSelectedAlgo] = useState<HashAlgorithm>('linear');
  const [tableSize, setTableSize] = useState<number>(7);
  const [primeR, setPrimeR] = useState<number>(5);
  const [inputKey, setInputKey] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  
  // Data stores
  // Separate chaining: array of arrays
  const [chainTable, setChainTable] = useState<number[][]>(() => Array.from({ length: 7 }, () => []));
  // Open addressing tables: array of numbers or null
  const [openTable, setOpenTable] = useState<(number | null)[]>(() => Array.from({ length: 7 }, () => null));

  // Logs and tracing
  const [traceLogs, setTraceLogs] = useState<string[]>([
    'Welcome to the Hashing & Formulas Hub. Select an algorithm and insert keys to see step-by-step mathematical probe resolutions.'
  ]);
  const [activeProbeSteps, setActiveProbeSteps] = useState<ProbeStep[]>([]);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<{ found: boolean; slot?: number; probes: number } | null>(null);

  // Resize handler
  const handleSizeChange = (newSize: number) => {
    setTableSize(newSize);
    setChainTable(Array.from({ length: newSize }, () => []));
    setOpenTable(Array.from({ length: newSize }, () => null));
    // Default R to highest prime < newSize
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23].filter(p => p < newSize);
    setPrimeR(primes[primes.length - 1] || 3);
    setTraceLogs([`Table size changed to ${newSize}. All slots cleared.`]);
    setActiveProbeSteps([]);
    setHighlightedSlot(null);
  };

  // Clear handler
  const clearTable = () => {
    setChainTable(Array.from({ length: tableSize }, () => []));
    setOpenTable(Array.from({ length: tableSize }, () => null));
    setActiveProbeSteps([]);
    setHighlightedSlot(null);
    setSearchResult(null);
    setTraceLogs([`Table cleared (Size = ${tableSize}).`]);
  };

  // Insert key handler
  const handleInsert = (keyToInsert?: number) => {
    const k = keyToInsert !== undefined ? keyToInsert : parseInt(inputKey, 10);
    if (isNaN(k)) return;

    const steps: ProbeStep[] = [];
    const newLogs: string[] = [];

    if (selectedAlgo === 'chaining') {
      const slot = ((k % tableSize) + tableSize) % tableSize;
      const formulaStr = `h(${k}) = ${k} mod ${tableSize} = ${slot}`;
      const isCollision = chainTable[slot].length > 0;

      const newChain = [...chainTable];
      newChain[slot] = [...newChain[slot], k];
      setChainTable(newChain);

      steps.push({
        i: 0,
        formula: formulaStr,
        slot,
        occupied: isCollision,
        occupantKey: isCollision ? chainTable[slot][chainTable[slot].length - 1] : undefined
      });

      newLogs.push(`Inserted Key ${k} at Bucket ${slot} using Open Hashing.`);
      if (isCollision) {
        newLogs.push(`[COLLISION] Bucket ${slot} already had [${chainTable[slot].join(', ')}]. Appended ${k} to chain (Length: ${newChain[slot].length}).`);
      } else {
        newLogs.push(`[CLEAN INSERT] Bucket ${slot} was empty. Linked list initiated with [${k}].`);
      }

      setActiveProbeSteps(steps);
      setHighlightedSlot(slot);
    } else {
      // Open Addressing (Linear, Quadratic, Double)
      let placed = false;
      const newOpen = [...openTable];

      // Primary hash
      const h1 = ((k % tableSize) + tableSize) % tableSize;
      
      // Secondary hash for double hashing
      // R - (k % R)
      const h2 = primeR - (((k % primeR) + primeR) % primeR);

      for (let i = 0; i < tableSize; i++) {
        let slot = 0;
        let formulaStr = '';

        if (selectedAlgo === 'linear') {
          slot = (h1 + i) % tableSize;
          formulaStr = `h_${i}(${k}) = (${h1} + ${i}) mod ${tableSize} = ${slot}`;
        } else if (selectedAlgo === 'quadratic') {
          slot = (h1 + (i * i)) % tableSize;
          formulaStr = `h_${i}(${k}) = (${h1} + ${i}^2) mod ${tableSize} = (${h1} + ${i * i}) mod ${tableSize} = ${slot}`;
        } else if (selectedAlgo === 'double') {
          slot = (h1 + (i * h2)) % tableSize;
          formulaStr = `h_${i}(${k}) = (${h1} + ${i}×${h2}) mod ${tableSize} = (${h1} + ${i * h2}) mod ${tableSize} = ${slot}`;
        }

        const isOccupied = newOpen[slot] !== null;

        steps.push({
          i,
          formula: formulaStr,
          slot,
          occupied: isOccupied,
          occupantKey: isOccupied ? newOpen[slot]! : undefined
        });

        if (!isOccupied) {
          newOpen[slot] = k;
          setOpenTable(newOpen);
          placed = true;
          setHighlightedSlot(slot);
          newLogs.push(`Inserted Key ${k} into Slot ${slot} at Probe i = ${i}.`);
          if (i > 0) {
            newLogs.push(`Resolved after ${i} collision probe(s) using ${selectedAlgo.toUpperCase()} PROBING.`);
          }
          break;
        } else {
          newLogs.push(`Probe i = ${i}: Slot ${slot} is OCCUPIED by ${newOpen[slot]}. Probing next...`);
        }
      }

      if (!placed) {
        newLogs.push(`[ERROR: TABLE FULL / CYCLE] Could not insert key ${k} within ${tableSize} probes.`);
        setHighlightedSlot(null);
      }

      setActiveProbeSteps(steps);
    }

    setTraceLogs(prev => [...newLogs, ...prev]);
    setInputKey('');
  };

  // Search handler
  const handleSearch = () => {
    const k = parseInt(searchKey, 10);
    if (isNaN(k)) return;

    if (selectedAlgo === 'chaining') {
      const slot = ((k % tableSize) + tableSize) % tableSize;
      const bucket = chainTable[slot];
      const idx = bucket.indexOf(k);
      if (idx !== -1) {
        setSearchResult({ found: true, slot, probes: idx + 1 });
        setHighlightedSlot(slot);
        setTraceLogs(prev => [`[SEARCH SUCCESS] Key ${k} found at Bucket ${slot}, node index ${idx} after ${idx + 1} comparisons.`, ...prev]);
      } else {
        setSearchResult({ found: false, slot, probes: bucket.length });
        setHighlightedSlot(slot);
        setTraceLogs(prev => [`[SEARCH FAILED] Key ${k} not found. Searched Bucket ${slot} (contained ${bucket.length} items).`, ...prev]);
      }
    } else {
      const h1 = ((k % tableSize) + tableSize) % tableSize;
      const h2 = primeR - (((k % primeR) + primeR) % primeR);
      let found = false;

      for (let i = 0; i < tableSize; i++) {
        let slot = 0;
        if (selectedAlgo === 'linear') slot = (h1 + i) % tableSize;
        else if (selectedAlgo === 'quadratic') slot = (h1 + (i * i)) % tableSize;
        else if (selectedAlgo === 'double') slot = (h1 + (i * h2)) % tableSize;

        if (openTable[slot] === k) {
          found = true;
          setSearchResult({ found: true, slot, probes: i + 1 });
          setHighlightedSlot(slot);
          setTraceLogs(prev => [`[SEARCH SUCCESS] Key ${k} found at Slot ${slot} on probe i = ${i} (Total probes: ${i + 1}).`, ...prev]);
          break;
        } else if (openTable[slot] === null) {
          // Reached empty slot; key does not exist
          setSearchResult({ found: false, slot, probes: i + 1 });
          setHighlightedSlot(slot);
          setTraceLogs(prev => [`[SEARCH TERMINATED] Reached empty Slot ${slot} on probe i = ${i}. Key ${k} is NOT in table.`, ...prev]);
          break;
        }
      }

      if (!found && !searchResult?.slot) {
        setSearchResult({ found: false, probes: tableSize });
        setTraceLogs(prev => [`[SEARCH FAILED] Key ${k} not found after probing entire table (${tableSize} slots checked).`, ...prev]);
      }
    }
  };

  // Presets
  const insertTeamRollNumbers = () => {
    clearTable();
    // 1191 (Solomon), 1175 (Murari), 1162 (Rex), 1168 (Ganesh)
    const rollNumbers = [1191, 1175, 1162, 1168, 25, 42];
    rollNumbers.forEach(roll => handleInsert(roll));
  };

  const insertCollidingKeys = () => {
    clearTable();
    // All congruent mod tableSize
    const colliding = [tableSize + 2, (tableSize * 2) + 2, (tableSize * 3) + 2, (tableSize * 4) + 2];
    colliding.forEach(c => handleInsert(c));
  };

  return (
    <div className="min-h-screen bg-engineering-grid text-slate-900 pb-16">
      {/* Header Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-800">Home</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-sm font-bold text-indigo-600">Hashing & Formulas Hub</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/student/dsa-lab">
              <Button size="sm" variant="outline">
                <Layers size={14} /> Open DSA Lab
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blueprint-grid text-white border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3.5 py-1 text-xs font-bold text-purple-300 ring-1 ring-purple-500/30">
              <Sparkles size={13} /> Micro Project 15 • Integrated CO 4
            </span>
            <span className="rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-bold text-indigo-300 ring-1 ring-indigo-500/30">
              Dynamic Data Structures & Tables
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Types of Hash Mapping & Mathematical Formulas
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            Master the mathematical foundations of hash tables. Explore the contrast between <strong className="text-white">Open Hashing (Separate Chaining)</strong> and <strong className="text-white">Closed Hashing (Open Addressing)</strong> with interactive linear, quadratic, and double hashing simulations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span><strong>Open Hashing:</strong> Separate Chaining</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
              <span><strong>Linear Probing:</strong> (hash(k) + i) % size</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
              <span><strong>Quadratic Probing:</strong> (hash(k) + i²) % size</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 border border-slate-700/80">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span><strong>Double Hashing:</strong> (h1(k) + i×h2(k)) % size</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

        {/* ----------------- STUDENT GUIDE: SYMBOL MEANINGS & WHY PRIME ----------------- */}
        <div className="mb-12 space-y-8">
          
          {/* Card: Why Table Size Must Be Prime */}
          <div className="rounded-3xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 p-6 shadow-sm lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20">
                  <Sparkles size={20} />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                    Why Must the Hash Table Size (m) Be a Prime Number?
                  </h2>
                  <p className="text-xs text-slate-600">Essential DSA viva & exam concept for CO 4</p>
                </div>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 font-mono text-xs font-bold text-indigo-800">
                gcd(key, size) = 1
              </span>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              
              {/* Reason 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 font-bold text-rose-700 text-xs mb-3">
                  01
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Prevents Factor Clustering</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  If table size <strong>m is composite</strong> (e.g. <code>m = 12</code>), any keys sharing factors with 12 (like multiples of 4: <code>4, 8, 12, 16, 20...</code>) only hash into slots <strong>0, 4, 8</strong>. 
                  75% of the table stays empty while 3 slots suffer catastrophic collisions!
                </p>
                <div className="mt-3 rounded-lg bg-rose-50 p-2 text-[11px] font-mono text-rose-900 border border-rose-100">
                  Composite m=12: 4%12=4, 8%12=8, 16%12=4 (only 3 slots used!)
                </div>
              </div>

              {/* Reason 2 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 text-xs mb-3">
                  02
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Even Distribution With Primes</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  A <strong>prime number m</strong> has no divisors other than 1 and itself. Because <code>gcd(k, m) = 1</code> for virtually all keys, the modulo operation wraps keys uniformly around <strong>every single slot</strong> from 0 to m-1.
                </p>
                <div className="mt-3 rounded-lg bg-emerald-50 p-2 text-[11px] font-mono text-emerald-900 border border-emerald-100">
                  Prime m=11: 4%11=4, 8%11=8, 12%11=1, 16%11=5, 20%11=9 (spreads evenly!)
                </div>
              </div>

              {/* Reason 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 font-bold text-purple-700 text-xs mb-3">
                  03
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Guarantees Complete Probing</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  In <strong>Double Hashing</strong>, the probe sequence traverses all table slots only if <code>gcd(h2(k), m) = 1</code>. 
                  Making <code>m</code> prime guarantees that any secondary step <code>1 ≤ h2(k) &lt; m</code> is coprime to <code>m</code>, preventing probe deadlocks!
                </p>
                <div className="mt-3 rounded-lg bg-purple-50 p-2 text-[11px] font-mono text-purple-900 border border-purple-100">
                  Double Hashing theorem: Coprime step covers 100% of slots!
                </div>
              </div>

            </div>
          </div>

          {/* Card: Student Symbol Glossary */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600" />
                Student Guide: Meanings of All Mathematical Symbols
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                A beginner-friendly breakdown of every variable and operator used in hash mapping.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-indigo-600">k (key)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Input</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">The Key / Value</h4>
                <p className="mt-1 text-xs text-slate-600">
                  The data item being stored or looked up (e.g. Student Registration Number <code>1191</code> or <code>25</code>).
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-purple-600">m / size / s</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Capacity</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Table Size</h4>
                <p className="mt-1 text-xs text-slate-600">
                  The total number of slots in the hash table (indices <code>0</code> to <code>m - 1</code>). Always chosen as prime.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-emerald-600">h(k) / h1(k)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Primary Hash Function</h4>
                <p className="mt-1 text-xs text-slate-600">
                  Calculates the initial home slot: <code>k mod size</code>. It maps any large number into <code>[0, size-1]</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-amber-600">i (probe)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Counter</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Collision Attempt Number</h4>
                <p className="mt-1 text-xs text-slate-600">
                  Probe counter: <code>i=0</code> (first try). If occupied, <code>i=1, 2, 3...</code> counts successive collision attempts.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-blue-600">h2(k)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step Size</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Secondary Hash Function</h4>
                <p className="mt-1 text-xs text-slate-600">
                  In Double Hashing, calculates the custom jump step size: <code>h2(k) = R - (k mod R)</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-pink-600">R</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prime &lt; m</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Secondary Prime Constant</h4>
                <p className="mt-1 text-xs text-slate-600">
                  A prime strictly smaller than table size <code>m</code>. Ensures <code>h2(k)</code> is never <code>0</code> (avoids freezing).
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-indigo-600">% (mod)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Operator</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Modulo Operator</h4>
                <p className="mt-1 text-xs text-slate-600">
                  Computes the division remainder. E.g. <code>25 % 7 = 4</code> because <code>25 = (3 × 7) + 4</code>.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-black text-cyan-600">α (alpha)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Load Factor</span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-800">Load Factor (n / m)</h4>
                <p className="mt-1 text-xs text-slate-600">
                  Measures fullness: <code>items / table size</code>. High load factor causes more collisions.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* ----------------- FORMULA CARDS GRID ----------------- */}
        <div className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Mathematical Formulas & Collision Schemes
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Formal definitions and probe sequences implemented in the Online Exam System.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <BookOpen size={14} /> Textbook Precision
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Separate Chaining */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  Open Hashing
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Type I</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Separate Chaining</h3>
              <p className="mt-1 text-xs text-slate-600">
                Closed addressing. Each table slot is the head of a linked list storing all colliding keys.
              </p>
              
              <div className="mt-4 rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-sm shadow-inner">
                <p className="text-xs text-emerald-400 font-semibold mb-1">Hash Function:</p>
                <div className="text-center font-bold text-emerald-300">
                  h(k) = k mod size
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p><strong>Collision Resolution:</strong> Linked List / Chain</p>
                <p><strong>Load Factor (α):</strong> Can exceed 1 (n / m)</p>
                <p><strong>Worst Case:</strong> O(n) when all keys collide</p>
              </div>
            </div>

            {/* Card 2: Linear Probing */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                  Closed Hashing
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Type II</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Linear Probing</h3>
              <p className="mt-1 text-xs text-slate-600">
                Open addressing with constant step size. Inspects sequential slots until an empty slot is reached.
              </p>
              
              <div className="mt-4 rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-sm shadow-inner">
                <p className="text-xs text-blue-400 font-semibold mb-1">Probe Formula:</p>
                <div className="text-center font-bold text-blue-300">
                  h_i(k) = (hash(k) + i) % size
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1">for i = 0, 1, 2, 3...</p>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p><strong>Step Size:</strong> Fixed step of 1</p>
                <p><strong>Drawback:</strong> Primary Clustering</p>
                <p><strong>Table Limit:</strong> Load factor α must be ≤ 1</p>
              </div>
            </div>

            {/* Card 3: Quadratic Probing */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-purple-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-800">
                  Closed Hashing
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Type III</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Quadratic Probing</h3>
              <p className="mt-1 text-xs text-slate-600">
                Probes slots quadratically to disperse clusters and prevent primary clustering blocks.
              </p>
              
              <div className="mt-4 rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-sm shadow-inner">
                <p className="text-xs text-purple-400 font-semibold mb-1">Probe Formula:</p>
                <div className="text-center font-bold text-purple-300">
                  h_i(k) = (hash(k) + i²) % size
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1">probes: +0, +1, +4, +9, +16...</p>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p><strong>Advantage:</strong> Eliminates primary clustering</p>
                <p><strong>Drawback:</strong> Secondary clustering</p>
                <p><strong>Guaranteed:</strong> When size is prime and α &lt; 0.5</p>
              </div>
            </div>

            {/* Card 4: Double Hashing */}
            <div className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                  Closed Hashing
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Type IV</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Double Hashing</h3>
              <p className="mt-1 text-xs text-slate-600">
                Uses a second hash function as the variable probe step size. Provides closest to uniform hashing.
              </p>
              
              <div className="mt-4 rounded-xl bg-slate-900 p-3 text-slate-100 font-mono text-xs shadow-inner space-y-1">
                <p className="text-amber-400 font-semibold">Primary: <span className="text-slate-100">h1(k) = k % size</span></p>
                <p className="text-amber-400 font-semibold">Secondary: <span className="text-slate-100">h2(k) = R - (k % R)</span></p>
                <div className="pt-1 text-center font-bold text-amber-300 border-t border-slate-800">
                  h_i(k) = (h1(k) + i × h2(k)) % size
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <p><strong>R Value:</strong> Prime strictly less than size</p>
                <p><strong>Property:</strong> h2(k) never evaluates to 0</p>
                <p><strong>Advantage:</strong> No primary or secondary clustering</p>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- INTERACTIVE HASHING SIMULATOR ----------------- */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
                  <Calculator size={18} />
                </span>
                <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                  Interactive Hash Table Simulator & Step Tracer
                </h2>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Choose an algorithm, enter keys or load sample student IDs, and watch the exact mathematical formulas resolve each collision.
              </p>
            </div>

            {/* Algorithm Selector Buttons */}
            <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5">
              <button
                onClick={() => { setSelectedAlgo('chaining'); setActiveProbeSteps([]); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedAlgo === 'chaining'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Separate Chaining
              </button>
              <button
                onClick={() => { setSelectedAlgo('linear'); setActiveProbeSteps([]); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedAlgo === 'linear'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Linear Probing
              </button>
              <button
                onClick={() => { setSelectedAlgo('quadratic'); setActiveProbeSteps([]); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedAlgo === 'quadratic'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quadratic Probing
              </button>
              <button
                onClick={() => { setSelectedAlgo('double'); setActiveProbeSteps([]); }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedAlgo === 'double'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Double Hashing
              </button>
            </div>
          </div>

          {/* Configuration & Controls */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            
            {/* Input & Parameters */}
            <div className="space-y-4 lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-6">
              
              {/* Parameters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Table Size (m):</label>
                  <select
                    value={tableSize}
                    onChange={(e) => handleSizeChange(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value={7}>7 (Prime)</option>
                    <option value={11}>11 (Prime)</option>
                    <option value={13}>13 (Prime)</option>
                    <option value={17}>17 (Prime)</option>
                  </select>
                </div>

                {selectedAlgo === 'double' ? (
                  <div>
                    <label className="text-xs font-bold text-slate-700">Prime R (R &lt; m):</label>
                    <select
                      value={primeR}
                      onChange={(e) => setPrimeR(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    >
                      {[2, 3, 5, 7, 11, 13].filter(p => p < tableSize).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-slate-400">Probe Mode:</label>
                    <div className="mt-1 flex items-center h-10 text-xs font-bold text-slate-600 px-3 rounded-lg bg-slate-100">
                      {selectedAlgo === 'chaining' ? 'Chained Buckets' : selectedAlgo === 'linear' ? 'Step = 1' : 'Step = i²'}
                    </div>
                  </div>
                )}
              </div>

              {/* Insert Key */}
              <div>
                <label className="text-xs font-bold text-slate-700">Insert Numeric Key:</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="e.g. 25, 1191, 1175"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  />
                  <Button size="sm" onClick={() => handleInsert()}>
                    <Play size={14} /> Insert
                  </Button>
                </div>
              </div>

              {/* Search Key */}
              <div>
                <label className="text-xs font-bold text-slate-700">Search Key:</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="number"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="Search key..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button size="sm" variant="outline" onClick={handleSearch}>
                    <Search size={14} /> Search
                  </Button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-500 mb-2">Quick Presets & Tests:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={insertTeamRollNumbers}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                  >
                    + Insert Team Roll Nos
                  </button>
                  <button
                    onClick={insertCollidingKeys}
                    className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200 hover:bg-purple-100"
                  >
                    + Force Collisions
                  </button>
                  <button
                    onClick={clearTable}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Clear
                  </button>
                </div>
              </div>

              {/* Search Result Feedback */}
              {searchResult && (
                <div className={`rounded-xl p-3 text-xs border ${
                  searchResult.found 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}>
                  <p className="font-bold flex items-center gap-1.5">
                    {searchResult.found ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-rose-600" />}
                    {searchResult.found ? `Found at Slot ${searchResult.slot}` : 'Key Not Found'}
                  </p>
                  <p className="mt-1">
                    Comparisons / Probes required: <strong>{searchResult.probes}</strong>
                  </p>
                </div>
              )}

            </div>

            {/* Visual Table Display */}
            <div className="lg:col-span-2 space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Layers size={16} className="text-indigo-600" /> 
                  Hash Table Visualizer (Size m = {tableSize})
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedAlgo === 'chaining' 
                    ? `Occupied Buckets: ${chainTable.filter(b => b.length > 0).length}/${tableSize}` 
                    : `Occupied Slots: ${openTable.filter(x => x !== null).length}/${tableSize}`}
                </span>
              </div>

              {/* Table rendering */}
              {selectedAlgo === 'chaining' ? (
                /* Separate Chaining Visualizer */
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  {chainTable.map((chain, idx) => {
                    const isHighlighted = highlightedSlot === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 rounded-lg border p-2 transition-all ${
                          isHighlighted 
                            ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-400' 
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex h-9 w-16 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                          Slot {idx}
                        </div>

                        <div className="flex flex-1 flex-wrap items-center gap-2">
                          {chain.length === 0 ? (
                            <span className="text-xs text-slate-400 italic">null (empty chain)</span>
                          ) : (
                            chain.map((val, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-1.5">
                                <span className="rounded-md bg-emerald-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-sm">
                                  {val}
                                </span>
                                {cIdx < chain.length - 1 && (
                                  <span className="text-emerald-500 font-bold">→</span>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Open Addressing Visualizer (Linear, Quadratic, Double) */
                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {openTable.map((val, idx) => {
                      const isHighlighted = highlightedSlot === idx;
                      const isProbeTarget = activeProbeSteps.some(s => s.slot === idx);
                      return (
                        <div
                          key={idx}
                          className={`relative flex flex-col items-center justify-center rounded-xl border p-3 min-h-[90px] transition-all ${
                            isHighlighted
                              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-400 shadow-sm'
                              : isProbeTarget
                              ? 'border-amber-400 bg-amber-50/60'
                              : val !== null
                              ? 'border-slate-300 bg-white'
                              : 'border-dashed border-slate-200 bg-white/70'
                          }`}
                        >
                          <span className="text-[10px] font-mono font-bold text-slate-400">
                            Index [{idx}]
                          </span>
                          
                          <div className="mt-1">
                            {val !== null ? (
                              <span className="font-mono text-base font-black text-slate-900">
                                {val}
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-slate-300">
                                Empty
                              </span>
                            )}
                          </div>

                          {isHighlighted && (
                            <span className="absolute bottom-1 text-[9px] font-bold text-indigo-600">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step-by-Step Probe Sequence Visualizer for Open Addressing */}
              {activeProbeSteps.length > 0 && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-2">
                    <Zap size={14} className="text-indigo-600" /> Probe Evaluation Sequence:
                  </h4>
                  <div className="space-y-1.5">
                    {activeProbeSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-wrap items-center justify-between gap-2 rounded-lg p-2 text-xs font-mono border ${
                          step.occupied
                            ? 'border-rose-200 bg-rose-50/70 text-rose-900'
                            : 'border-emerald-200 bg-emerald-50/70 text-emerald-900 font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold">
                            i = {step.i}
                          </span>
                          <span>{step.formula}</span>
                        </div>
                        <div>
                          {step.occupied ? (
                            <span className="text-rose-700">
                              Collision with {step.occupantKey} → Probe Next
                            </span>
                          ) : (
                            <span className="text-emerald-700">
                              Slot {step.slot} Empty → PLACED!
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Trace Logs Console */}
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Mathematical Trace Log & Audit Console
            </h4>
            <div className="max-h-40 overflow-y-auto rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-300 space-y-1 shadow-inner">
              {traceLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-500 select-none">[{traceLogs.length - i}]</span>
                  <span className={log.includes('COLLISION') ? 'text-amber-400' : log.includes('SUCCESS') || log.includes('CLEAN') ? 'text-emerald-400' : log.includes('ERROR') ? 'text-rose-400' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ----------------- COMPARISON TABLE: OPEN VS CLOSED HASHING ----------------- */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
            Open Hashing vs Closed Hashing: Deep Comparison
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Analysis required for Course Outcome 4 and theoretical engineering evaluation.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="py-3 px-4">Parameter</th>
                  <th className="py-3 px-4 text-emerald-800">Open Hashing (Separate Chaining)</th>
                  <th className="py-3 px-4 text-blue-800">Closed Hashing (Linear Probing)</th>
                  <th className="py-3 px-4 text-purple-800">Closed Hashing (Quadratic Probing)</th>
                  <th className="py-3 px-4 text-amber-800">Closed Hashing (Double Hashing)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-xs sm:text-sm">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Addressing Paradigm</td>
                  <td className="py-3 px-4 font-medium text-emerald-700">Closed Addressing (External lists)</td>
                  <td className="py-3 px-4 font-medium text-blue-700">Open Addressing (Internal slots)</td>
                  <td className="py-3 px-4 font-medium text-purple-700">Open Addressing (Internal slots)</td>
                  <td className="py-3 px-4 font-medium text-amber-700">Open Addressing (Internal slots)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Probe Formula</td>
                  <td className="py-3 px-4 font-mono font-semibold">h(k) = k mod m</td>
                  <td className="py-3 px-4 font-mono font-semibold">h_i(k) = (h(k) + i) % m</td>
                  <td className="py-3 px-4 font-mono font-semibold">h_i(k) = (h(k) + i²) % m</td>
                  <td className="py-3 px-4 font-mono font-semibold">h_i(k) = (h1(k) + i×h2(k)) % m</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Clustering Behavior</td>
                  <td className="py-3 px-4">No clustering between buckets</td>
                  <td className="py-3 px-4 text-rose-600 font-medium">Suffers from Primary Clustering</td>
                  <td className="py-3 px-4 text-amber-600 font-medium">Suffers from Secondary Clustering</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">Near-Zero Clustering (Optimal)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Load Factor (α = n/m)</td>
                  <td className="py-3 px-4">Can exceed 1 (table never gets full)</td>
                  <td className="py-3 px-4">Must be &lt; 1 (typically ≤ 0.7)</td>
                  <td className="py-3 px-4">Must be &lt; 0.5 with prime size</td>
                  <td className="py-3 px-4">Must be &lt; 1 (handles high load well)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Deletion Complexity</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">Simple linked list node deletion</td>
                  <td className="py-3 px-4 text-slate-600">Requires Tombstones / Rehashing</td>
                  <td className="py-3 px-4 text-slate-600">Requires Tombstones / Rehashing</td>
                  <td className="py-3 px-4 text-slate-600">Requires Tombstones / Rehashing</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-800">Cache Performance</td>
                  <td className="py-3 px-4 text-slate-500">Poor (Pointer chasing in memory)</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">Excellent (Sequential memory cache)</td>
                  <td className="py-3 px-4">Moderate cache locality</td>
                  <td className="py-3 px-4">Moderate cache locality</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
