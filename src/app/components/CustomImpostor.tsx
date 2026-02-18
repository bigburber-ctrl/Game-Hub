
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Eye, Users, ShieldAlert, Award, RotateCcw } from "lucide-react";

interface CustomImpostorProps {
  players: Player[];
  onBack: () => void;
}

type Step = "reveal" | "describe" | "vote_instructions" | "reveal_result";

export function CustomImpostor({ players, onBack }: CustomImpostorProps) {
  const [step, setStep] = useState<Step>("reveal");
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [impostorsIds, setImpostorsIds] = useState<string[]>([]);
  const [impostorCount, setImpostorCount] = useState(() => Math.max(1, Math.floor(players.length / 3)));
  const [isSetup, setIsSetup] = useState(true);
  const [startingPlayerId, setStartingPlayerId] = useState("");

  useEffect(() => {
    if (!players || players.length === 0) return;
    setImpostorCount(Math.max(1, Math.floor(players.length / 3)));
  }, [players]);

  const startDistribution = () => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const selectedImpostors = shuffledPlayers.slice(0, impostorCount).map(p => p.id);
    setImpostorsIds(selectedImpostors);
    setIsSetup(false);
    setCurrentPlayerIdx(0);
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)].id);
    setStep("reveal");
  };

  const handleNextReveal = () => {
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      setStep("describe");
    }
  };

  const resetGame = () => {
    setIsSetup(true);
    setStep("reveal");
    setCurrentPlayerIdx(0);
    setImpostorsIds([]);
  };

  if (isSetup) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
        <header className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
          <div className="text-center">
            <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest italic">🕵️ Jeu d'Imposteur Personnalisé</h2>
            <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
              {impostorCount} {impostorCount > 1 ? "Imposteurs" : "Imposteur"} parmi vous
            </p>
          </div>
          <div className="w-10"></div>
        </header>

        <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto text-[40px] leading-none">🕵️</div>
            <h3 className="text-xl font-black text-white uppercase italic">Nombre d'Imposteurs</h3>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setImpostorCount(Math.max(1, impostorCount - 1))}
              className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold"
            >
              <span className="inline-block -translate-y-[2.5px]">-</span>
            </button>
            <span className="inline-block text-3xl font-black text-white -translate-y-[1px]">
              {impostorCount}
            </span>
            <button
              onClick={() => {
                const maxImpostors = Math.max(1, Math.floor(players.length / 2));
                setImpostorCount(Math.min(maxImpostors, impostorCount + 1));
              }}
              className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold"
            >
              <span className="inline-block -translate-y-[2.5px]">+</span>
            </button>
          </div>

          <button onClick={startDistribution} className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
            Lancer la partie
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
        <div className="text-center">
          <h2 className="text-xs font-bold text-emerald-500 uppercase tracking-widest italic">🕵️ Jeu d'Imposteur Personnalisé</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {impostorCount} {impostorCount > 1 ? "Imposteurs" : "Imposteur"} parmi vous
          </p>
        </div>
        <div className="w-10"></div>
      </header>

      <AnimatePresence mode="wait">
        {step === "reveal" && (
          <motion.div key="reveal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex-1 flex flex-col justify-center gap-8 text-center">
            <div className="space-y-4">
              <p className="text-slate-400 italic">Passe l'appareil à</p>
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{players[currentPlayerIdx]?.name}</h3>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden">
              <button onClick={handleNextReveal} className="flex flex-col items-center gap-4 w-full py-4">
                <div className="p-6 bg-emerald-600/20 rounded-full text-emerald-400">
                  <Eye size={48} />
                </div>
                <p className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Voir mon rôle</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === "describe" && (
          <motion.div key="describe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center gap-6 text-center">
            <div className="p-6 rounded-3xl bg-slate-800/50 border-2 border-slate-700 relative overflow-hidden">
              <Users size={40} className="mx-auto text-emerald-500 mb-4" />
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2 leading-none">Tour de table</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Suivez l'ordre circulaire. Une seule description par personne.
              </p>

              <div className="space-y-3 text-left">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest mb-1">Le joueur qui commence :</p>
                  <p className="text-lg font-black text-white uppercase italic">
                    {players.find(p => p.id === startingPlayerId)?.name}
                  </p>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Ordre de parole :</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const startIndex = players.findIndex(p => p.id === startingPlayerId);
                      const ordered = [...players.slice(startIndex), ...players.slice(0, startIndex)];
                      return ordered.map((p, i) => (
                        <div key={p.id} className="flex items-center gap-2">
                          <span className="text-white font-bold text-sm uppercase italic">{p.name}</span>
                          {i < ordered.length - 1 && <span className="text-slate-700 text-xs">→</span>}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <button onClick={() => setStep("vote_instructions")} className="py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
              Passer au Vote
            </button>
          </motion.div>
        )}

        {step === "vote_instructions" && (
          <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <ShieldAlert size={64} className="mx-auto text-emerald-500 mb-4 animate-pulse" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Votez !</h2>
              <p className="text-slate-400 max-w-[280px] mx-auto leading-relaxed">
                Discutez et désignez les <span className="text-white font-bold">{impostorsIds.length}</span> suspects à haute voix.
              </p>
            </div>

            <button onClick={() => setStep("reveal_result")} className="mt-8 py-5 bg-emerald-600 text-white font-black uppercase italic rounded-2xl active:scale-95 transition-all shadow-xl shadow-emerald-900/40">
              Découvrir les imposteurs
            </button>
          </motion.div>
        )}

        {step === "reveal_result" && (
          <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <Award size={80} className="mx-auto text-emerald-500 mb-4" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">La Vérité !</h2>

              <div className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700 space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rôles du jeu</p>
                    <div className="flex justify-center items-center gap-4">
                       <div className="flex-1 text-right">
                         <p className="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Innocents</p>
                         <p className="text-xl font-black text-emerald-400 italic uppercase">INNOCENT</p>
                       </div>
                       <div className="h-10 w-px bg-slate-700"></div>
                       <div className="flex-1 text-left">
                         <p className="text-xs text-slate-400 mb-1 uppercase tracking-tighter">Imposteurs</p>
                         <p className="text-xl font-black text-red-400 italic uppercase">IMPOSTEUR</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-700/50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Les coupables étaient</p>
                    <div className="flex flex-wrap justify-center gap-2">
                       {impostorsIds.map(id => (
                         <span key={id} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs font-black uppercase italic border border-red-500/20">
                           {players.find(p => p.id === id)?.name}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button onClick={resetGame} className="py-5 bg-emerald-600 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                <RotateCcw size={20} /> Rejouer
              </button>
              <button onClick={onBack} className="py-4 bg-slate-800 text-slate-300 font-bold uppercase rounded-2xl">
                Menu Principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
