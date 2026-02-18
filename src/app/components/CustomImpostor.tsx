
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Eye, Users, Info } from "lucide-react";

interface CustomImpostorProps {
  players: Player[];
  onBack: () => void;
}



export function CustomImpostor({ players, onBack }: CustomImpostorProps) {
  const [showRules, setShowRules] = useState(false);
  const [impostorCount, setImpostorCount] = useState(1);
  const [step, setStep] = useState<"settings" | "reveal">("settings");
  const [impostorsIds, setImpostorsIds] = useState<string[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);

  const maxImpostors = players.length > 3 ? Math.floor(players.length / 2) : 1;

  const handleStart = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setImpostorsIds(shuffled.slice(0, impostorCount).map(p => p.id));
    setCurrentPlayerIdx(0);
    setShowRole(false);
    setStep("reveal");
  };

  const handleNextReveal = () => {
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
      setShowRole(false);
    } else {
      onBack();
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
      {step === "settings" && (
        <>
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-black uppercase italic tracking-tight">
                Paramètres <span className="text-emerald-500">Du Jeu</span>
              </h1>
            </div>
            <button
              onClick={() => setShowRules(true)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl flex items-center gap-2 border border-slate-700/50 transition-all shadow-sm"
            >
              <Info size={18} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Règles</span>
            </button>
          </header>

          <div className="flex flex-col flex-1">
            <div className="space-y-6 flex-1">
              <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <Users size={20} className="text-emerald-400" />
                  <h3 className="font-bold uppercase text-xs tracking-widest">
                    Nombre d'imposteurs
                  </h3>
                </div>
                {maxImpostors === 1 ? (
                  <div className="flex justify-center p-4 bg-slate-900 rounded-xl border border-slate-700">
                    <span className="text-xl font-black text-white">1 imposteur</span>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-4 w-full">
                    <div className="relative flex-1">
                      <input
                        type="range"
                        min={1}
                        max={maxImpostors}
                        step={1}
                        value={impostorCount}
                        onChange={(e) => setImpostorCount(parseInt(e.target.value))}
                        className="slider w-full accent-emerald-500"
                      />
                      {maxImpostors >= 2 && (
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-[16%] pointer-events-none px-0.25 z-10">
                          <div className="flex justify-between w-full">
                            {Array.from({ length: maxImpostors }, (_, i) => (
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
                    <span className="text-2xl font-black text-white w-8 text-center">{impostorCount}</span>
                  </div>
                )}
              </section>
            </div>
            <button
              onClick={handleStart}
              className="w-full mt-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
            >
              <span>C'est parti !</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Modal règles */}
          {showRules && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border-2 border-emerald-700 shadow-2xl relative">
                <button
                  onClick={() => setShowRules(false)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  aria-label="Fermer"
                >
                  ✕
                </button>
                <h2 className="text-xl font-black text-emerald-400 mb-4 uppercase tracking-widest">Règles</h2>
                <ul className="text-slate-200 text-sm space-y-2 list-disc pl-4">
                  <li>Choisissez le nombre d'imposteurs selon le nombre de joueurs.</li>
                  <li>Chaque joueur reçoit secrètement son rôle : "Innocent" ou "Imposteur".</li>
                  <li>À la fin de la distribution, le jeu revient au menu.</li>
                  <li>Le but est de jouer en présentiel : les imposteurs se reconnaissent entre eux, les innocents ne savent rien.</li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {step === "reveal" && (
        <motion.div key="reveal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex-1 flex flex-col justify-center gap-8 text-center">
          <div className="space-y-4">
            <p className="text-slate-400 italic">Passe l'appareil à</p>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{players[currentPlayerIdx]?.name}</h3>
          </div>
          <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden">
            {!showRole ? (
              <button onClick={() => setShowRole(true)} className="flex flex-col items-center gap-4 w-full py-4">
                <div className="p-6 bg-emerald-600/20 rounded-full text-emerald-400">
                  <Eye size={48} />
                </div>
                <p className="font-bold text-emerald-400 uppercase tracking-widest text-[10px]">Voir mon rôle</p>
              </button>
            ) : (
              <div className="space-y-8 animate-in zoom-in duration-300">
                <div className="space-y-2">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Ton rôle est</p>
                  {players[currentPlayerIdx] && impostorsIds.includes(players[currentPlayerIdx].id) ? (
                    <h4 className="text-4xl font-black text-red-500 uppercase italic tracking-tight">IMPOSTEUR</h4>
                  ) : (
                    <h4 className="text-4xl font-black text-emerald-500 uppercase italic tracking-tight">INNOCENT</h4>
                  )}
                </div>
                <button onClick={handleNextReveal} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all">
                  J'AI COMPRIS
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
