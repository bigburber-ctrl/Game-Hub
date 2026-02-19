import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Eye, Users } from "lucide-react";

interface CustomImpostorProps {
  players: Player[];
  onBack: () => void;
}

export function CustomImpostor({ players, onBack }: CustomImpostorProps) {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [impostorCount, setImpostorCount] = useState(1);
  const [isSetup, setIsSetup] = useState(true);
  const [impostorsIds, setImpostorsIds] = useState<string[]>([]);

  const maxImpostors = (() => {
    if (players.length <= 1) return 1;
    return players.length % 2 === 0
      ? players.length / 2
      : Math.floor(players.length / 2);
  })();

  useEffect(() => {
    setImpostorCount((current) => Math.min(Math.max(1, current), maxImpostors));
  }, [maxImpostors]);

  const startDistribution = () => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    setImpostorsIds(shuffled.slice(0, impostorCount).map(p => p.id));
    setIsSetup(false);
    setCurrentPlayerIdx(0);
    setShowRole(false);
  };

  const handleNext = () => {
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
      setShowRole(false);
    } else {
      onBack();
    }
  };

  if (isSetup) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col flex-1"
      >
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-black uppercase italic tracking-tight">
              Paramètres <span className="text-emerald-500">du jeu</span>
            </h1>
          </div>
          <div className="w-10" />
        </header>

        <div className="space-y-6 flex-1 overflow-y-auto pb-8 pr-1">
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400 mb-2">
              <Users size={20} className="text-emerald-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Nombre d'imposteurs</h3>
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
                    onChange={(e) => setImpostorCount(parseInt(e.target.value, 10))}
                    className="slider w-full accent-emerald-500"
                  />

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
                </div>

                <span className="text-2xl font-black text-white w-8 text-center">
                  {impostorCount}
                </span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 italic text-center px-2 leading-relaxed">
              Les autres joueurs seront des innocents.
            </p>
          </section>
        </div>

        <button
          onClick={startDistribution}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
        >
          Lancer la partie
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 pt-12"
    >
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <p className="text-slate-400 uppercase font-bold tracking-widest text-xs">Passe l'appareil à</p>
          <h3 className="text-4xl font-black text-white italic uppercase break-words">{players[currentPlayerIdx]?.name}</h3>
        </div>

        <div className="bg-slate-800/60 p-8 rounded-3xl border-2 border-slate-700 shadow-2xl relative min-h-[220px] flex flex-col justify-center">
          {!showRole ? (
            <button onClick={() => setShowRole(true)} className="flex flex-col items-center gap-4">
              <div className="p-6 bg-emerald-500/10 rounded-full text-emerald-400 animate-pulse">
                <Eye size={48} />
              </div>
              <p className="font-black uppercase italic text-emerald-400">Voir mon rôle</p>
            </button>
          ) : (
            <div className="space-y-6 animate-in zoom-in duration-300">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ton rôle est</p>
                {players[currentPlayerIdx] && impostorsIds.includes(players[currentPlayerIdx].id) ? (
                  <h4 className="text-4xl font-black text-red-500 uppercase italic tracking-tighter">IMPOSTEUR</h4>
                ) : (
                  <h4 className="text-4xl font-black text-emerald-500 uppercase italic tracking-tighter">INNOCENT</h4>
                )}
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-slate-100 to-white text-black font-black uppercase italic hover:shadow-lg active:scale-95 transition-all"
              >
                J'ai compris
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
