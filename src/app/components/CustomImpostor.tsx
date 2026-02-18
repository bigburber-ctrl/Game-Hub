import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Eye, RotateCcw, UserCircle } from "lucide-react";

interface CustomImpostorProps {
  if (isSetup) {
    // On ne propose plus aucun choix de catégorie ou mode, juste le nombre d'imposteurs
    return (
      <div className="flex flex-col gap-8 pt-8">
        <header className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
          <h2 className="text-sm font-black text-white uppercase italic tracking-widest">Nombre d'Imposteurs</h2>
          <div className="w-10"></div>
        </header>

        <div className="bg-slate-800 p-6 rounded-3xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto text-[40px] leading-none">
              🕵️
            </div>
            <h3 className="text-xl font-black text-white uppercase italic">Choisissez le nombre d'imposteurs</h3>
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

          <button onClick={startDistribution} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all">
            Lancer la partie
          </button>
        </div>
      </div>
    );
  }
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


          <button onClick={startDistribution} className="w-full py-4 bg-purple-600 text-white font-black uppercase italic rounded-2xl">
            Lancer la partie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-12 text-center">
      <div className="space-y-4">
        <p className="text-slate-400 italic">Passe l'appareil à</p>
        <h3 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">{players[currentPlayerIdx]?.name}</h3>
      </div>

      <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden flex flex-col justify-center min-h-[220px]">
        {!showRole ? (
          <button onClick={() => setShowRole(true)} className="flex flex-col items-center gap-4 w-full py-4">
            <div className="p-6 bg-purple-600/20 rounded-full text-purple-400 animate-pulse">
              <Eye size={48} />
            </div>
            <p className="font-bold uppercase italic text-purple-400">Voir mon rôle</p>
          </button>
        ) : (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ton Identité</p>
              {players[currentPlayerIdx] && impostorsIds.includes(players[currentPlayerIdx].id) ? (
                <h4 className="text-4xl font-black text-red-500 uppercase italic tracking-tighter">IMPOSTEUR</h4>
              ) : (
                <h4 className="text-4xl font-black text-emerald-500 uppercase italic tracking-tighter">INNOCENT</h4>
              )}
            </div>
            <button onClick={handleNext} className="w-full py-4 bg-emerald-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all">
              J'AI COMPRIS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
