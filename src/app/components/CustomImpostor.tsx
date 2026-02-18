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


  import React, { useState } from "react";

  interface Player {
    id: string;
    name: string;
  }

  interface CustomImpostorProps {
    players: Player[];
    onBack: () => void;
  }

  // Copie fidèle de WordImpostor : paramétrage du nombre d'imposteurs, puis distribution des rôles (aucun mot, aucune catégorie)
  export default function CustomImpostor({ players, onBack }: CustomImpostorProps) {
    const [step, setStep] = useState<"setup" | "reveal">("setup");
    const [impostorCount, setImpostorCount] = useState(1);
    const [roles, setRoles] = useState<string[]>([]);
    const [current, setCurrent] = useState(0);
    const [showRole, setShowRole] = useState(false);

    // Génère les rôles et mélange
    const startGame = () => {
      const total = players.length;
      const impostors = Array(impostorCount).fill("Imposteur");
      const innocents = Array(total - impostorCount).fill("Innocent");
      const allRoles = [...impostors, ...innocents].sort(() => Math.random() - 0.5);
      setRoles(allRoles);
      setStep("reveal");
      setCurrent(0);
      setShowRole(false);
    };

    const nextReveal = () => {
      if (!showRole) {
        setShowRole(true);
      } else if (current < players.length - 1) {
        setCurrent(current + 1);
        setShowRole(false);
      } else {
        onBack();
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-dvh p-4">
        <div className="w-full max-w-md mx-auto bg-slate-900 border-2 border-emerald-700/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 items-center relative">
          <button
            onClick={onBack}
            className="absolute top-3 left-3 p-2 rounded-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
            aria-label="Retour"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="w-full text-center mb-2">
            <span className="text-lg font-black text-white uppercase tracking-tight italic">Jeu d'Imposteur Personnalisé</span>
          </div>
          {step === "setup" && (
            <>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-slate-300 font-bold text-sm">Nombre d'imposteurs</label>
                <select
                  className="w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  value={impostorCount}
                  onChange={e => setImpostorCount(Number(e.target.value))}
                >
                  {[...Array(Math.max(1, players.length - 1)).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={startGame}
                className="w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 active:scale-95 shadow mt-4"
              >
                Démarrer la distribution
              </button>
            </>
          )}
          {step === "reveal" && (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="text-center w-full">
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                  Carte pour : <span className="text-white">{players[current].name}</span>
                </p>
                <div className="flex flex-col items-center gap-4">
                  {!showRole ? (
                    <button
                      onClick={nextReveal}
                      className="w-full py-6 px-8 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-slate-200 font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
                    >
                      👁️ Voir la carte
                    </button>
                  ) : (
                    <div className={`rounded-2xl p-8 mt-2 mb-4 text-3xl font-black uppercase tracking-widest shadow-lg ${roles[current] === "Imposteur" ? "bg-rose-700/80 text-white" : "bg-emerald-700/80 text-white"}`}>
                      {roles[current]}
                    </div>
                  )}
                  {showRole && (
                    <button
                      onClick={nextReveal}
                      className="w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all bg-slate-800/60 border-slate-700/30 text-slate-200 hover:bg-slate-700/60 active:scale-95 shadow"
                    >
                      {current < players.length - 1 ? "Carte suivante" : "Terminer"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
