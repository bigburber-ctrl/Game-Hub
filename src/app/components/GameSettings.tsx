import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Play, Users, Brain, Info, ToggleLeft, ToggleRight, RotateCcw, NotebookTabs } from "lucide-react";

export type GameConfig = {
  impostorCount: number;
  category: string;
  impostorMode: "different-word" | "no-word";
  showHints: boolean;
  questionMode: "standard" | "numbers";
};

interface GameSettingsProps {
  gameType: "trapped-round" | "word-impostor" | "question-impostor";
  playersCount: number;
  onBack: () => void;
  onStart: (config: GameConfig) => void;
}

// Liste de catégories pour le mode "word-impostor"
const CATEGORIES = [
  "Objets du quotidien",
  "Lieux",
  "Animaux",
  "Nourriture",
  "Vêtements",
  "Films",
  "Jeux vidéo",
  "Cartes Clash Royale",
  "Mobs Minecraft"
];

// Système de couleurs par jeu (modifiable ici facilement)
const GAME_COLORS = {
  "trapped-round": {
    titleText: "text-purple-500",
    subtitleText: "text-purple-400",
    sliderAccent: "accent-purple-500",
    buttonGradientFrom: "from-purple-600",
    buttonGradientTo: "to-indigo-600",
    icon: "text-purple-400"
  },
  "word-impostor": {
    titleText: "text-emerald-500",
    subtitleText: "text-emerald-400",
    sliderAccent: "accent-emerald-500",
    buttonGradientFrom: "from-emerald-600",
    buttonGradientTo: "to-green-600",
    icon: "text-emerald-400"
  },
  "question-impostor": {
    titleText: "text-yellow-400",
    subtitleText: "text-yellow-400",
    sliderAccent: "accent-yellow-400",
    buttonGradientFrom: "from-yellow-400",
    buttonGradientTo: "to-yellow-600",
    icon: "text-yellow-400"
  }
};

export function GameSettings({ gameType, playersCount, onBack, onStart }: GameSettingsProps) {
  const [impostorCount, setImpostorCount] = useState(() => {
    if (playersCount >= 13) return 4;
    if (playersCount >= 10) return 3;
    if (playersCount >= 6) return 2;
    return 1;
  });
  const [category, setCategory] = useState("Objets du quotidien");
  const [impostorMode, setImpostorMode] = useState<"different-word" | "no-word">("different-word");
  const [questionMode, setQuestionMode] = useState<"standard" | "numbers">("standard");
  const [showHints, setShowHints] = useState(true);
  const [showRules, setShowRules] = useState(false);

  const colors = GAME_COLORS[gameType];

  const handleStart = () => {
    onStart({ impostorCount, category, impostorMode, showHints, questionMode });
  };

  const maxImpostors = () => {
    if (playersCount <= 4) return 1;
    if (playersCount <= 7) return 2;
    if (playersCount <= 10) return 3;
    if (playersCount <= 15) return 4;
    return Math.floor(playersCount / 4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1"
    >
      {/* ===== HEADER ===== */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">
            Paramètres <span className={colors.titleText}>Du Jeu</span>
          </h1>
        </div>
        <button 
          onClick={() => setShowRules(true)}
          className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl flex items-center gap-2 border border-slate-700/50 transition-all shadow-sm"
        >
          <Info size={18} className={colors.icon} />
          <span className="text-[10px] font-black uppercase tracking-widest">Règles</span>
        </button>
      </header>

      {/* ===== BODY ===== */}
      <div className="space-y-6 flex-1 overflow-y-auto pb-8 pr-1">
       {/* Impostor Count */}
<section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
  <div className={`flex items-center gap-3 ${colors.subtitleText} mb-2`}>
    <Users size={20} className={colors.icon} />
    <h3 className="font-bold uppercase text-xs tracking-widest">
      Nombre d'imposteurs
    </h3>
  </div>

  {/* ===== CAS QUESTION IMPOSTOR ===== */}
  {gameType === "question-impostor" ? (
    <div className="flex justify-center p-4 bg-slate-900 rounded-xl border border-slate-700">
      <span className="text-xl font-black text-white">1 imposteur</span>
    </div>
  ) : maxImpostors() === 1 ? (
    /* ===== SI MAX = 1 ===== */
    <div className="flex justify-center p-4 bg-slate-900 rounded-xl border border-slate-700">
      <span className="text-xl font-black text-white">1 imposteur</span>
    </div>
  ) : (
    /* ===== SLIDER NORMAL ===== */
<div className="relative flex items-center gap-4 w-full">

  <div className="relative flex-1">

    {/* Track slider */}
    <input
      type="range"
      min={1}
      max={maxImpostors()}
      step={1}
      value={impostorCount}
      onChange={(e) => setImpostorCount(parseInt(e.target.value))}
      className={`slider w-full ${colors.sliderAccent}`}
    />

    {/* Points snap */}
    {maxImpostors() >= 2 && (
      <div className="absolute left-0 right-0 top-1/2 -translate-y-[16%] pointer-events-none px-0.25 z-10
">
        <div className="flex justify-between w-full">
          {Array.from({ length: maxImpostors() }, (_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition ${
                impostorCount === i + 1
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    )}

  </div>

  <span className="text-2xl font-black text-white w-8 text-center">
    {impostorCount}
  </span>

</div>

  )}
</section>

        {/* Question Mode (question-impostor) */}
        {gameType === "question-impostor" && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className={`flex items-center gap-3 text-amber-400 mb-2`}>
              <Brain size={20} className="text-amber-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Type de Questions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setQuestionMode("standard")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                  questionMode === "standard"
                    ? "bg-amber-600/10 border-amber-500 shadow-lg shadow-amber-900/20"
                    : "bg-slate-900 border-slate-700 opacity-50 hover:opacity-100"
                }`}
              >
                <div className={`p-2 rounded-lg ${questionMode === "standard" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                  <NotebookTabs size={20} />
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-white">Standard</span>
              </button>
              
              <button
                onClick={() => setQuestionMode("numbers")}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                  questionMode === "numbers"
                    ? "bg-amber-600/10 border-amber-500 shadow-lg shadow-amber-900/20"
                    : "bg-slate-900 border-slate-700 opacity-50 hover:opacity-100"
                }`}
              >
                <div className={`p-2 rounded-lg ${questionMode === "numbers" ? "bg-amber-500 text-black" : "bg-slate-800 text-slate-400"}`}>
                  <span className="font-black text-lg leading-none">‎ # ‎‎  </span>
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-white">Mode Chiffres</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center px-4 leading-relaxed">
              {questionMode === "standard" 
                ? "L'imposteur a une question textuelle légèrement différente." 
                : "Les questions demandent un nombre. L'imposteur reçoit une fourchette (ex: entre 0 et 20)."}
            </p>
          </section>
        )}

        {/* Category selector (word-impostor) */}
        {gameType === "word-impostor" && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className={`flex items-center gap-3 ${colors.subtitleText} mb-2`}>
              <Brain size={20} className={colors.icon} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Catégorie de mots</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all ${
                    category === cat
                      ? `bg-${colors.sliderAccent.split('-')[1]}-600 text-white shadow-lg shadow-${colors.sliderAccent.split('-')[1]}-900/20`
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Impostor Mode (word-impostor) */}
        {gameType === "word-impostor" && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className={`flex items-center gap-3 text-amber-400 mb-2`}>
<NotebookTabs size={20} className="text-yellow-500 relative -top-[0.5px]" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Mode Imposteur</h3>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setImpostorMode("different-word")}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                  impostorMode === "different-word"
                    ? "bg-amber-600/10 border-amber-500"
                    : "bg-slate-900 border-slate-700 opacity-50"
                }`}
              >
                <p className="font-bold text-white uppercase italic">🔄 Mot alternatif pour l'imposteur</p>
                <p className="text-xs text-slate-400">L'imposteur a un mot différent des autres.</p>
              </button>
              <button
                onClick={() => setImpostorMode("no-word")}
                className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                  impostorMode === "no-word"
                    ? "bg-amber-600/10 border-amber-500"
                    : "bg-slate-900 border-slate-700 opacity-50"
                }`}
              >
                <p className="font-bold text-white uppercase italic">👁️ L'imposteur sait qu'il est imposteur</p>
                <p className="text-xs text-slate-400">L'imposteur n'a aucun mot.</p>
              </button>
              {impostorMode === "no-word" && (
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-700">
                  <p className="text-sm font-bold text-slate-300">Activer les indices</p>
                  <button onClick={() => setShowHints(!showHints)}>
                    {showHints ? <ToggleRight size={32} className="text-emerald-500" /> : <ToggleLeft size={32} className="text-slate-600" />}
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ===== START BUTTON ===== */}
      <div className="mt-6">
        <button
          onClick={handleStart}
          className={`w-full py-5 bg-gradient-to-r ${colors.buttonGradientFrom} ${colors.buttonGradientTo} rounded-2xl text-white font-black uppercase italic tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all`}
        >
          C'est parti ! <Play size={20} fill="currentColor" />
        </button>
      </div>

      {/* ===== MODAL RULES ===== */}
      <AnimatePresence>
        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-md p-6 rounded-3xl max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modal */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  {gameType === "trapped-round" && "🎭 Mission Comportementale"}
                  {gameType === "word-impostor" && "🕵️ Qui est l'imposteur ?"}
                  {gameType === "question-impostor" && "❓ LA QUESTION DIFFÉRENTE"}
                </h3>
                <button onClick={() => setShowRules(false)} className="p-2 text-slate-500 hover:text-white">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>

              {/* Contenu règles */}
              <div className="space-y-6 text-sm">
                    {/* ===================== JEU 1 ===================== */}
                    {gameType === "trapped-round" && (
                      <>
                        <section className="space-y-2">
                          <h4 className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            🎯 But du jeu
                          </h4>
                          <p className="text-slate-300">
                            Trouver qui est l’imposteur en observant son comportement.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            🧩 Comment ça marche
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            <li>• Tous les joueurs reçoivent le même sujet.</li>
                            <li>• Un imposteur a une mission secrète.</li>
                            <li>• Il répond normalement, sans saboter ouvertement.</li>
                          </ul>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">
                            🔄 Déroulement
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            <li>1. 1 à 3 imposteurs sont choisis.</li>
                            <li>2. 3 tours avec des sujets différents.</li>
                            <li>3. Vote final + révélation.</li>
                          </ul>
                        </section>
                      </>
                    )}

                    {/* ===================== JEU 2 ===================== */}
                    {gameType === "word-impostor" && (
                      <>
                        <section className="space-y-2">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                            🎯 But du jeu
                          </h4>
                          <p className="text-slate-300">
                            Trouver l’imposteur à partir des descriptions.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                            🧩 Comment ça marche
                          </h4>
                          <p className="text-slate-300">
                            Les innocents ont le même mot. L’imposteur a un mot différent ou aucun mot.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                            🔄 Déroulement
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            <li>1. Chacun donne UNE description.</li>
                            <li>2. 1 ou 2 tours max.</li>
                            <li>3. Vote final.</li>
                          </ul>
                        </section>
                      </>
                    )}

                    {/* ===================== JEU 3 ===================== */}
                    {gameType === "question-impostor" && (
                      <>
                        <section className="space-y-2">
                          <h4 className="text-orange-400 font-bold uppercase tracking-widest text-[10px]">
                            🎯 But du jeu
                          </h4>
                          <p className="text-slate-300">
                            Trouver l’imposteur en observant la réponse des autres.
                          </p>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-orange-400 font-bold uppercase tracking-widest text-[10px]">
                            🧩 Comment ça marche
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            <li>• Les innocents ont tous la même question.</li>
                            <li>• L’imposteur reçoit une question différente mais liée (il ne sait pas qu’il est l’imposteur).</li>
                          </ul>
                        </section>
                        <section className="space-y-2">
                          <h4 className="text-orange-400 font-bold uppercase tracking-widest text-[10px]">
                            🔄 Déroulement
                          </h4>
                          <ul className="space-y-1 text-slate-300">
                            <li>1. Chaque joueur écrit ou dit une réponse à sa question.</li>
                            <li>2. À la fin, le vrai sujet des innocents et les réponses de chacun sont révélés.</li>
                            <li>3. Discussion libre pour essayer de deviner l’imposteur.</li>
                            <li>4. Vote final : qui est l’imposteur ?</li>
                          </ul>
                        </section>
                      </>
                    )}
                  </div>

                 <button
  onClick={() => setShowRules(false)}
  className={`mt-auto w-full py-4 font-black uppercase rounded-2xl transition-all transform translate-y-3 ${
    colors.buttonGradientFrom.split('-')[1] === "purple"
      ? "bg-purple-600"
      : colors.buttonGradientFrom.split('-')[1] === "emerald"
      ? "bg-emerald-600"
      : "bg-yellow-500"
  } text-white`}
>
  J'AI COMPRIS
</button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}