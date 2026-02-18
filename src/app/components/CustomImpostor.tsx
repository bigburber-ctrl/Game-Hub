import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Eye, RotateCcw, UserCircle } from "lucide-react";

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
                const maxImpostors =
                  players.length % 2 === 0
                    ? players.length / 2
                    : Math.floor(players.length / 2);
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
      <div className="space-y-4 text-center">
        <p className="text-slate-400 italic">Passe l'appareil à</p>
        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{players[currentPlayerIdx]?.name}</h3>
      </div>

      <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden min-h-[220px] flex flex-col justify-center">
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
            <button onClick={handleNext} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all">
              {currentPlayerIdx === players.length - 1 ? "J'ai compris" : "J'ai compris"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
