import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Trash2, RotateCcw, CircleOff } from "lucide-react";
import { toast } from "sonner";

type WheelItem = {
  id: string;
  label: string;
  crossed: boolean;
};

interface RoueDeLaChanceProps {
  onBack: () => void;
}
const STORAGE_KEY = "gamehub_fortune_wheel_items";
const DEFAULT_ITEMS: WheelItem[] = [
  { id: "1", label: "Choix 1", crossed: false },
  { id: "2", label: "Choix 2", crossed: false },
  { id: "3", label: "Choix 3", crossed: false }
];

const WHEEL_SIZE = 256;
const WHEEL_CENTER = WHEEL_SIZE / 2;
const WHEEL_RADIUS = 124;

const normalizeDeg = (value: number) => ((value % 360) + 360) % 360;

const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const wedgePath = (startDeg: number, endDeg: number) => {
  const start = polar(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, startDeg);
  const end = polar(WHEEL_CENTER, WHEEL_CENTER, WHEEL_RADIUS, endDeg);
  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${WHEEL_CENTER} ${WHEEL_CENTER} L ${start.x} ${start.y} A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
};

const ringSegmentPath = (startDeg: number, endDeg: number, innerR: number, outerR: number) => {
  const outerStart = polar(WHEEL_CENTER, WHEEL_CENTER, outerR, startDeg);
  const outerEnd = polar(WHEEL_CENTER, WHEEL_CENTER, outerR, endDeg);
  const innerStart = polar(WHEEL_CENTER, WHEEL_CENTER, innerR, startDeg);
  const innerEnd = polar(WHEEL_CENTER, WHEEL_CENTER, innerR, endDeg);
  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

function readInitialItems(): WheelItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ITEMS;
    const parsed = JSON.parse(raw) as WheelItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ITEMS;
    return parsed.map((item, index) => ({
      id: item.id || `${Date.now().toString(36)}_${index}`,
      label: typeof item.label === "string" ? item.label : String(index + 1),
      crossed: Boolean(item.crossed),
    }));
  } catch {
    return DEFAULT_ITEMS;
  }
}

export function RoueDeLaChance({ onBack }: RoueDeLaChanceProps) {
  const [items, setItems] = useState<WheelItem[]>(() => readInitialItems());
  const [newLabel, setNewLabel] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [pendingChoiceId, setPendingChoiceId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const activeItems = useMemo(
    () => items.filter((item) => !item.crossed && item.label.trim().length > 0),
    [items]
  );

  const pendingChoice = pendingChoiceId
    ? items.find((item) => item.id === pendingChoiceId) ?? null
    : null;

  const persist = (nextItems: WheelItem[]) => {
    setItems(nextItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    } catch {
      // ignore
    }
  };

  const addItem = () => {
    const value = newLabel.trim();
    if (!value) return;
    const nextItems = [
      ...items,
      {
        id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`,
        label: value,
        crossed: false,
      },
    ];
    persist(nextItems);
    setNewLabel("");
  };

  const updateItem = (id: string, label: string) => {
    persist(items.map((item) => (item.id === id ? { ...item, label } : item)));
  };

  const removeItem = (id: string) => {
    persist(items.filter((item) => item.id !== id));
          <motion.div
            className="relative z-10 w-64 h-64 rounded-full shadow-xl"
            style={{ transform: `rotate(${rotationDeg}deg)` }}
          >
            <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
              {activeItems.length === 0 ? (
                <circle
                  cx={WHEEL_CENTER}
                  cy={WHEEL_CENTER}
                  r={WHEEL_RADIUS}
                  fill="#1e293b"
                />
              ) : (
                activeItems.map((item, index) => (
                  <g key={item.id}>
                    {/* ...wheel segment rendering here... */}
                  </g>
                ))
              )}
            </svg>
          </motion.div>
      animationFrameRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearSpinRuntime();
    };
  }, []);

  const spinWheel = async () => {
    if (isSpinning) return;
    if (activeItems.length === 0) {
      toast.error("Ajoute au moins 1 choix non barré");
      return;
    }

    await ensureAudioContext();
    clearSpinRuntime();

    const selectedIndex = Math.floor(Math.random() * activeItems.length);
    const selected = activeItems[selectedIndex];
    const segmentSize = 360 / activeItems.length;
    const currentNormalized = normalizeDeg(rotationDeg);
    const targetNormalized = normalizeDeg(-(selectedIndex + 0.5) * segmentSize);
    const deltaToTarget = normalizeDeg(targetNormalized - currentNormalized);
    const extraTurns = 4 + Math.floor(Math.random() * 2);
    const startRotation = rotationDeg;
    const totalRotationDelta = extraTurns * 360 + deltaToTarget;
    const endRotation = startRotation + totalRotationDelta;
    const spinDurationMs = 1800;
    const startAt = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    let lastDividerIndex = Math.floor(startRotation / segmentSize);

    setPendingChoiceId(null);
    setIsSpinning(true);

    const animateSpin = () => {
      const elapsed = performance.now() - startAt;
      const progress = Math.min(1, elapsed / spinDurationMs);
      const eased = easeOutCubic(progress);
      const currentRotation = startRotation + totalRotationDelta * eased;
      setRotationDeg(currentRotation);

      const currentDividerIndex = Math.floor(currentRotation / segmentSize);
      const crossed = currentDividerIndex - lastDividerIndex;
      if (crossed > 0) {
        for (let i = 0; i < crossed; i += 1) {
          playTickSound();
        }
        lastDividerIndex = currentDividerIndex;
      }

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animateSpin);
        return;
      }

      setRotationDeg(endRotation);
      playLandingSound();
      setIsSpinning(false);
      setPendingChoiceId(selected.id);
      animationFrameRef.current = null;
    };

    animationFrameRef.current = window.requestAnimationFrame(animateSpin);
  };

  const segmentColors = [
    "#7c3aed",
    "#4f46e5",
    "#2563eb",
    "#0891b2",
    "#db2777",
    "#ea580c",
    "#16a34a",
  ];

  const maxLabelChars = useMemo(() => {
    if (activeItems.length <= 4) return 16;
    if (activeItems.length <= 6) return 13;
    if (activeItems.length <= 8) return 10;
    return 8;
  }, [activeItems.length]);

  const labelFontSize = useMemo(() => {
    if (activeItems.length <= 4) return 11;
    if (activeItems.length <= 6) return 10;
    if (activeItems.length <= 8) return 9;
    return 8;
  }, [activeItems.length]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 h-full"
    >
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tight italic">
          Roue de la <span className="text-purple-500">Chance</span>
        </h1>
      </header>

      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-5">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ajouter un choix..."
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addItem()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          <button
            onClick={addItem}
            className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors active:scale-95"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 max-h-[36vh]">
        <div className="flex flex-col gap-3 w-full">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex items-center gap-2 sm:gap-3 bg-slate-800 p-2 pl-3 pr-2 sm:pl-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
            >
              <span className="text-slate-500 font-mono text-sm w-4 shrink-0">{index + 1}</span>
              <button
                onClick={() => setCrossed(item.id, !item.crossed)}
                className={`p-1 rounded-md shrink-0 transition-colors ${
                  item.crossed ? "text-emerald-400 hover:text-emerald-300" : "text-slate-500 hover:text-slate-300"
                }`}
                aria-label={item.crossed ? `Débarrer ${item.label}` : `Barrer ${item.label}`}
              >
                {item.crossed ? <RotateCcw size={16} /> : <CircleOff size={16} />}
              </button>
              <input
                type="text"
                value={item.label}
                onChange={(event) => updateItem(item.id, event.target.value)}
                className={`flex-1 min-w-0 bg-transparent border-none p-0 focus:ring-0 font-medium ${
                  item.crossed ? "text-slate-500 line-through" : "text-white"
                }`}
              />
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                aria-label={`Supprimer ${item.label}`}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="relative">
          <motion.div
            className="relative z-10 w-64 h-64 rounded-full shadow-xl"
            style={{ transform: `rotate(${rotationDeg}deg)` }}
          >
            <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
              <circle cx={WHEEL_CENTER} cy={WHEEL_CENTER} r={WHEEL_RADIUS} fill="#1e293b" />
            </svg>
          </motion.div>

          <div className="absolute inset-0 z-[15] pointer-events-none">
            <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
              <polygon
                points={`${WHEEL_CENTER - 10},2 ${WHEEL_CENTER + 10},2 ${WHEEL_CENTER},16`}
                fill="white"
              />
            </svg>
          </div>

          <div className="absolute inset-0 z-[20] pointer-events-none">
            <svg viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`} className="w-full h-full">
              <circle
                cx={WHEEL_CENTER}
                cy={WHEEL_CENTER}
                r={WHEEL_RADIUS}
                fill="none"
                stroke="#334155"
                strokeWidth={4}
              />
              <circle
                cx={WHEEL_CENTER}
                cy={WHEEL_CENTER}
                r={10}
                fill="#0f172a"
                stroke="#64748b"
                strokeWidth={3}
              />
            </svg>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning || activeItems.length === 0}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          {isSpinning ? "Ça tourne..." : "Lancer la roue"}
        </button>

      </div>

      {pendingChoice && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => setPendingChoiceId(null)}
        >
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-center text-slate-300 font-black uppercase tracking-widest text-xs">
              Résultat:
            </p>
            <p className="text-center text-white font-black text-4xl sm:text-5xl leading-tight break-words">
              {pendingChoice.label}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setCrossed(pendingChoice.id, true);
                  setPendingChoiceId(null);
                }}
                className="w-full py-3 rounded-xl bg-red-600/80 text-white font-bold hover:bg-red-600 transition"
              >
                Retirer
              </button>
              <button
                onClick={() => setPendingChoiceId(null)}
                className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition"
              >
                Fermer
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400">
              Retirer barre l’élément (il n’est pas effacé).
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
