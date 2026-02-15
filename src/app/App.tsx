import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerSetup } from "@/app/components/PlayerSetup";
import { TrappedRound } from "@/app/components/TrappedRound";
import { WordImpostor } from "@/app/components/WordImpostor";
import { CustomImpostor } from "@/app/components/CustomImpostor";
import { QuestionImpostor } from "@/app/components/QuestionImpostor";
import { GameSettings, GameConfig } from "@/app/components/GameSettings";
import { toast, Toaster } from "sonner";
import { Gamepad2, Users, Utensils } from "lucide-react";

export type Player = {
  id: string;
  name: string;
  score: number;
};

type GameState = "home" | "setup" | "settings" | "playing" | "custom-impostor";
type GameType = "trapped-round" | "word-impostor" | "question-impostor";

const GAME_METADATA: Record<GameType, { minPlayers: number }> = {
  "trapped-round": { minPlayers: 3 },
  "word-impostor": { minPlayers: 3 },
  "question-impostor": { minPlayers: 3 },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem("gamehub_players");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Joueur 1", score: 0 },
      { id: "2", name: "Joueur 2", score: 0 },
      { id: "3", name: "Joueur 3", score: 0 },
    ];
  });

  useEffect(() => {
    localStorage.setItem("gamehub_players", JSON.stringify(players));
  }, [players]);

  const selectGame = (game: GameType) => {
    const minRequired = GAME_METADATA[game].minPlayers;
    if (players.length < minRequired) {
      toast.error(`Ce jeu nécessite au moins ${minRequired} joueurs !`);
      return;
    }
    setActiveGame(game);
    setGameState("settings");
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    setGameState("playing");
  };

  const resetToHome = () => {
    setGameState("home");
    setActiveGame(null);
    setGameConfig(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Toaster position="top-center" expand={false} richColors />
      
      <div className="max-w-md mx-auto min-h-screen flex flex-col p-4 relative">
        <AnimatePresence mode="wait">
          {gameState === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-8 pt-12"
            >
              <div className="text-center space-y-2">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex p-4 rounded-3xl bg-purple-600/20 text-purple-400 mb-4"
                >
                  <Gamepad2 size={48} />
                </motion.div>
                <h1 className="text-4xl font-black tracking-tight text-white uppercase italic">
                  Game <span className="text-purple-500">Hub</span>
                </h1>
                <p className="text-slate-400 text-sm">Le multijoueur local ultime</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (players.length < 3) {
                      toast.error("Il faut au moins 3 joueurs !");
                      return;
                    }
                    setGameState("custom-impostor");
                  }}
                  className={`w-full py-4 border font-black text-[10px] uppercase tracking-[0.3em] rounded-xl transition-all ${
                    players.length < 3 
                      ? "bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed grayscale" 
                      : "bg-purple-600/10 border-purple-500/20 text-purple-400 hover:bg-purple-600/20 active:scale-95"
                  }`}
                  disabled={players.length < 3}
                >
                  🕵️ Jeu D'IMPOSTEUR PERSONNALISÉ
                </button>
                <button
                  onClick={() => setGameState("setup")}
                  className="w-full py-6 px-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
                >
                  <Users size={16} className="text-purple-400" />
                  Gérer les Joueurs ({players.length})
                </button>
              </div>

              {players.length < 3 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    ⚠️ Ajoutez au moins 3 joueurs pour débloquer les jeux
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                <button
                  onClick={() => selectGame("trapped-round")}
                  disabled={players.length < GAME_METADATA["trapped-round"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-purple-900/20 ${
                    players.length < GAME_METADATA["trapped-round"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">🎭 Mission Comportementale</h2>
                      <p className="text-purple-100/70 text-sm leading-tight max-w-[800px]">
                        Les imposteurs doivent accomplir des missions comportementales secrètes pendant que les innocents essaient de les identifier.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("word-impostor")}
                  disabled={players.length < GAME_METADATA["word-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-emerald-900/20 ${
                    players.length < GAME_METADATA["word-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">🕵️ Qui est l'Imposteur ?</h2>
                      <p className="text-emerald-100/70 text-sm leading-tight max-w-[800px]">
                        Trouvez qui n'a pas le même mot que les autres en écoutant les indices donnés par chaque joueur.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("question-impostor")}
                  disabled={players.length < GAME_METADATA["question-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-amber-900/20 ${
                    players.length < GAME_METADATA["question-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">❓ LA QUESTION DIFFÉRENTE</h2>
                      <p className="text-amber-100/70 text-sm leading-tight max-w-[800px]">
                        Tout le monde répond à une question, mais l'imposteur a une question légèrement différente...
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {gameState === "setup" && (
            <PlayerSetup
              players={players}
              setPlayers={setPlayers}
              onBack={resetToHome}
            />
          )}

          {gameState === "settings" && activeGame && (
            <GameSettings
              gameType={activeGame}
              playersCount={players.length}
              onBack={resetToHome}
              onStart={startGame}
            />
          )}

          {gameState === "playing" && activeGame === "trapped-round" && gameConfig && (
            <TrappedRound
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "word-impostor" && gameConfig && (
            <WordImpostor
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "question-impostor" && gameConfig && (
            <QuestionImpostor
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "custom-impostor" && (
            <CustomImpostor
              players={players}
              onBack={resetToHome}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
