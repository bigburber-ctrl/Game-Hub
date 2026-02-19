import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayerSetup } from "@/app/components/PlayerSetup";
import { TrappedRound } from "@/app/components/TrappedRound";
import { WordImpostor } from "@/app/components/WordImpostor";
import { CustomImpostor } from "@/app/components/CustomImpostor";
import { QuestionImpostor } from "@/app/components/QuestionImpostor";
import { DinerExtreme } from "@/app/components/DinerExtreme";
import { TrouveRegle } from "@/app/components/TrouveRegle";
import { RoueDeLaChance } from "@/app/components/RoueDeLaChance";
import { TeamCreator } from "@/app/components/TeamCreator";
import { SabotageSilencieux } from "./components/SabotageSilencieux";
import { RAW_DINER_TRI_POOL } from "./components/DinerMissionsTriPool";

import { GameSettings, GameConfig } from "@/app/components/GameSettings";
import { toast, Toaster } from "sonner";
import { Gamepad2, Users, ToggleLeft, ToggleRight } from "lucide-react";

type LastGameConfigs = Partial<Record<ConfigurableGameType, GameConfig>>;
const LAST_GAME_CONFIGS_STORAGE_KEY = "gamehub_last_game_configs";
const PHONE_VOTE_ENABLED_STORAGE_KEY = "gamehub_phone_vote_enabled";

export type Player = {
  id: string;
  name: string;
  score: number;
  excluded?: boolean;
};

type AcceptedMission = {
  id: string;
  text: string;
};

type MissionHistoryItem = {
  id: string;
  draft: string;
};

type GameState = "home" | "setup" | "settings" | "playing" | "custom-impostor" | "diner-extreme" | "mission-review" | "fortune-wheel" | "team-creator" | "sabotage-silencieux";
type GameType = "trapped-round" | "word-impostor" | "question-impostor" | "trouve-regle" | "diner-extreme" | "sabotage-silencieux";
type ConfigurableGameType = Exclude<GameType, "diner-extreme">;

const GAME_METADATA: Record<GameType, { minPlayers: number }> = {
  "trapped-round": { minPlayers: 3 },
  "word-impostor": { minPlayers: 3 },
  "question-impostor": { minPlayers: 3 },
  "trouve-regle": { minPlayers: 3 },
  "diner-extreme": { minPlayers: 1 },
  "sabotage-silencieux": { minPlayers: 3 },
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
  const [phoneVoteEnabled, setPhoneVoteEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(PHONE_VOTE_ENABLED_STORAGE_KEY);
    if (saved === null) return false;
    return saved === "true";
  });
  const [activeGame, setActiveGame] = useState<ConfigurableGameType | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [lastGameConfigs, setLastGameConfigs] = useState<LastGameConfigs>(() => {
    try {
      const saved = localStorage.getItem(LAST_GAME_CONFIGS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as LastGameConfigs) : {};
    } catch {
      return {};
    }
  });
  const [acceptedMissions, setAcceptedMissions] = useState<AcceptedMission[]>([]);
  const [missionDraft, setMissionDraft] = useState<string>("");
  const [missionGenerated, setMissionGenerated] = useState<string>("");
  const [missionReviewStep, setMissionReviewStep] = useState<"review" | "recap">("review");
  const [missionReviewCurrent, setMissionReviewCurrent] = useState<number>(0);
  const [missionReviewTotal, setMissionReviewTotal] = useState<number>(0);
  const missionDeckRef = React.useRef<string[]>([]);
  const fallbackPoolRef = React.useRef<string[] | null>(null);
  const missionHistoryRef = React.useRef<MissionHistoryItem[]>([]);
  const [missionHistoryIndex, setMissionHistoryIndex] = useState<number>(-1);
  
  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem("gamehub_players");
    if (saved) {
      const parsed = JSON.parse(saved) as Player[];
      return parsed.map((player) => ({
        ...player,
        excluded: Boolean(player.excluded),
      }));
    }
    return [
      { id: "1", name: "Joueur 1", score: 0, excluded: false },
      { id: "2", name: "Joueur 2", score: 0, excluded: false },
      { id: "3", name: "Joueur 3", score: 0, excluded: false },
    ];
  });

  const activePlayers = useMemo(() => players.filter((player) => !player.excluded), [players]);
  const activePlayersCount = activePlayers.length;

  useEffect(() => {
    localStorage.setItem("gamehub_players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(LAST_GAME_CONFIGS_STORAGE_KEY, JSON.stringify(lastGameConfigs));
    } catch {
      // ignore
    }
  }, [lastGameConfigs]);

  useEffect(() => {
    localStorage.setItem(PHONE_VOTE_ENABLED_STORAGE_KEY, String(phoneVoteEnabled));
  }, [phoneVoteEnabled]);

  const selectGame = (game: GameType) => {
    const minRequired = GAME_METADATA[game].minPlayers;
    if (activePlayersCount < minRequired) {
      toast.error(`Ce jeu nécessite au moins ${minRequired} joueurs !`);
      return;
    }
    
    // Jeux à lancement direct
    if (game === "diner-extreme") {
      setGameState("diner-extreme");
      return;
    }

    setActiveGame(game);
    setGameState("settings");
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    if (activeGame) {
      setLastGameConfigs((prev) => ({ ...prev, [activeGame]: config }));
    }
    setGameState("playing");
  };

  const resetToHome = () => {
    setGameState("home");
    setActiveGame(null);
    setGameConfig(null);
  };

  const normalizeMission = (value: string) => value.replace(/\s+/g, " ").trim();

  const persistCurrentDraftToHistory = (nextDraft: string) => {
    if (missionHistoryIndex < 0) return;
    const item = missionHistoryRef.current[missionHistoryIndex];
    if (!item) return;
    item.draft = nextDraft;
  };

  const getFallbackMissionsPool = () => {
    if (fallbackPoolRef.current) return fallbackPoolRef.current;
    const pool = RAW_DINER_TRI_POOL
      .map((mission) => mission.replace(/,\s*$/, "."))
      .map(normalizeMission)
      .filter(Boolean);
    fallbackPoolRef.current = pool;
    return pool;
  };

  const resetMissionDeck = () => {
    const pool = getFallbackMissionsPool();
    missionDeckRef.current = [...pool];
    setMissionReviewTotal(pool.length);
    setMissionReviewCurrent(0);
    missionHistoryRef.current = [];
    setMissionHistoryIndex(-1);
    setMissionGenerated("");
    setMissionDraft("");
  };

  const drawNextMissionFromPool = () => {
    // Toujours sauvegarder la version modifiée avant de changer de mission
    persistCurrentDraftToHistory(missionDraft);

    const pool = getFallbackMissionsPool();
    if (missionDeckRef.current.length === 0) {
      missionDeckRef.current = [...pool];
      setMissionReviewTotal(pool.length);
      setMissionReviewCurrent(0);
      missionHistoryRef.current = [];
      setMissionHistoryIndex(-1);
    }

    // Si on est revenu en arrière, avancer dans l'historique au lieu de "consommer" une nouvelle mission
    if (missionHistoryIndex < missionHistoryRef.current.length - 1) {
      const nextIndex = missionHistoryIndex + 1;
      setMissionHistoryIndex(nextIndex);
      setMissionReviewTotal(pool.length);
      setMissionReviewCurrent(nextIndex + 1);
      const nextFromHistory = missionHistoryRef.current[nextIndex]?.draft ?? "";
      setMissionGenerated(nextFromHistory);
      setMissionDraft(nextFromHistory);
      return;
    }

    const next = missionDeckRef.current.shift() ?? "";
    const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    missionHistoryRef.current.push({ id, draft: next });
    const nextIndex = missionHistoryRef.current.length - 1;
    setMissionHistoryIndex(nextIndex);
    setMissionReviewTotal(pool.length);
    setMissionReviewCurrent(nextIndex + 1);
    setMissionGenerated(next);
    setMissionDraft(next);
  };

  const goToPreviousMission = () => {
    persistCurrentDraftToHistory(missionDraft);
    const prevIndex = missionHistoryIndex - 1;
    if (prevIndex < 0) return;
    const prev = missionHistoryRef.current[prevIndex]?.draft ?? "";
    setMissionHistoryIndex(prevIndex);
    setMissionReviewCurrent(prevIndex + 1);
    setMissionGenerated(prev);
    setMissionDraft(prev);
  };

  const startMissionReview = () => {
    const pool = getFallbackMissionsPool();
    setMissionReviewTotal(pool.length);

    const hasExistingSession =
      acceptedMissions.length > 0 ||
      missionReviewCurrent > 0 ||
      missionGenerated.trim().length > 0 ||
      missionDeckRef.current.length > 0;

    if (!hasExistingSession) {
      setAcceptedMissions([]);
      setMissionReviewStep("review");
      resetMissionDeck();
      drawNextMissionFromPool();
      setGameState("mission-review");
      return;
    }

    // Reprendre là où on en était
    setGameState("mission-review");
    if (missionGenerated.trim().length === 0) {
      drawNextMissionFromPool();
    } else if (missionDraft.trim().length === 0) {
      setMissionDraft(missionGenerated);
    }
  };

  const acceptCurrentMission = () => {
    const trimmed = missionDraft.replace(/\s+/g, " ").trim();
    if (!trimmed) {
      toast.error("Mission vide");
      return;
    }
    persistCurrentDraftToHistory(trimmed);
    const currentHistoryId = missionHistoryRef.current[missionHistoryIndex]?.id;
    const stableId = currentHistoryId ?? `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;

    setAcceptedMissions((prev) => {
      const existingIndex = prev.findIndex((m) => m.id === stableId);
      if (existingIndex === -1) return [...prev, { id: stableId, text: trimmed }];
      return prev.map((m) => (m.id === stableId ? { ...m, text: trimmed } : m));
    });
    drawNextMissionFromPool();
  };

  const rejectCurrentMission = () => {
    drawNextMissionFromPool();
  };

  const finishMissionReview = () => {
    setMissionReviewStep("recap");
  };

  return (
    <div className="min-h-dvh bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Toaster position="top-center" expand={false} richColors />
      
      <div
        className={`mx-auto min-h-dvh flex flex-col p-4 relative ${
          gameState === "mission-review" ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <AnimatePresence mode="wait">
          {gameState === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-8 pt-12 relative"
            >
              <button
                onClick={() => setShowAppSettings((prev) => !prev)}
                className="absolute top-2 left-2 z-30 w-11 h-11 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-lg flex items-center justify-center hover:bg-slate-700 transition-all active:scale-95 shadow-lg"
                aria-label="Paramètres"
              >
                ⚙️
              </button>

              <button
                onClick={() => setShowMoreOptions((prev) => !prev)}
                className="absolute top-2 right-2 z-30 w-11 h-11 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200 text-lg flex items-center justify-center hover:bg-slate-700 transition-all active:scale-95 shadow-lg"
                aria-label="Plus"
              >
                <span className="text-purple-400">✚</span>
              </button>

              {showAppSettings && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowAppSettings(false)}
                >
                  <div
                    className="relative bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col gap-6 items-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowAppSettings(false)}
                      className="absolute top-3 left-3 p-2 rounded-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
                      aria-label="Retour"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    <div className="w-full text-center mt-1">
                      <span className="text-lg font-black text-white uppercase tracking-tight italic">Paramètres</span>
                    </div>

                    <div className="w-full p-4 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-slate-200">Vote sur téléphone</p>
                        <p className="text-[10px] text-slate-400">Actif sur tous les jeux</p>
                      </div>
                      <button onClick={() => setPhoneVoteEnabled((current) => !current)}>
                        {phoneVoteEnabled ? (
                          <ToggleRight size={32} className="text-fuchsia-500" />
                        ) : (
                          <ToggleLeft size={32} className="text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showMoreOptions && (
                <div
                  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                  onClick={() => setShowMoreOptions(false)}
                >
                  <div
                    className="relative bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col gap-6 items-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      onClick={() => setShowMoreOptions(false)}
                      className="absolute top-3 left-3 p-2 rounded-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
                      aria-label="Retour"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>

                    <div className="w-full text-center mt-1">
                      <span className="text-lg font-black text-white uppercase tracking-tight italic">Plus</span>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                      <button
                        onClick={() => {
                          if (activePlayersCount < 3) {
                            toast.error("Il faut au moins 3 joueurs !");
                            return;
                          }
                          setShowMoreOptions(false);
                          setTimeout(() => setGameState("custom-impostor"), 200);
                        }}
                        className={`w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all ${
                          activePlayersCount < 3
                            ? "bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed grayscale"
                            : "bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 active:scale-95 shadow"
                        }`}
                        disabled={activePlayersCount < 3}
                      >
                        🕵️ Jeu d'imposteur personnalisé
                      </button>

                      <button
                        onClick={() => {
                          setShowMoreOptions(false);
                          setTimeout(() => setGameState("fortune-wheel"), 200);
                        }}
                        className="w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all bg-purple-600/10 border-purple-500/20 text-purple-400 hover:bg-purple-600/20 active:scale-95 shadow"
                      >
                        🎡 Roue de la chance
                      </button>

                      <button
                        onClick={() => {
                          if (activePlayersCount < 3) {
                            toast.error("Il faut au moins 3 joueurs !");
                            return;
                          }
                          setShowMoreOptions(false);
                          setTimeout(() => setGameState("team-creator"), 200);
                        }}
                        className={`w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all ${
                          activePlayersCount < 3
                            ? "bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed grayscale"
                            : "bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 active:scale-95 shadow"
                        }`}
                        disabled={activePlayersCount < 3}
                      >
                        👥 Créateur d'équipe
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  onClick={() => setGameState("setup")}
                  className="w-full py-6 px-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
                >
                  <Users size={16} className="text-purple-400" />
                  Gérer les Joueurs ({activePlayersCount})
                </button>
              </div>

              {activePlayersCount < 3 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    ⚠️ Ajoutez au moins 3 joueurs pour débloquer les jeux
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                <button
                  onClick={() => selectGame("trapped-round")}
                  disabled={activePlayersCount < GAME_METADATA["trapped-round"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-purple-900/20 ${
                    activePlayersCount < GAME_METADATA["trapped-round"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic"><span className="not-italic mr-1">🎭</span>Mission Comportementale</h2>
                      <p className="text-purple-100/70 text-sm leading-tight max-w-[800px]">
                        Les imposteurs doivent accomplir des missions comportementales secrètes pendant que les innocents essaient de les identifier.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("trouve-regle")}
                  disabled={activePlayersCount < GAME_METADATA["trouve-regle"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-left transition-all shadow-lg shadow-blue-700/40 ${
                    activePlayersCount < GAME_METADATA["trouve-regle"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic"><span className="not-italic mr-1">🔍</span>TROUVE LA RÈGLE</h2>
                      <p className="text-blue-100/80 text-sm leading-tight max-w-[800px]">
                        Suivez une règle secrète… pendant que les enquêteurs essaient de la découvrir.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("word-impostor")}
                  disabled={activePlayersCount < GAME_METADATA["word-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-emerald-900/20 ${
                    activePlayersCount < GAME_METADATA["word-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic"><span className="not-italic mr-1">🕵️</span>Qui est l'Imposteur ?</h2>
                      <p className="text-emerald-100/70 text-sm leading-tight max-w-[800px]">
                        Trouvez qui n'a pas le même mot que les autres en écoutant les indices donnés par chaque joueur.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("question-impostor")}
                  disabled={activePlayersCount < GAME_METADATA["question-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-amber-900/20 ${
                    activePlayersCount < GAME_METADATA["question-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic"><span className="not-italic mr-1">❓</span>LA QUESTION DIFFÉRENTE</h2>
                      <p className="text-amber-100/70 text-sm leading-tight max-w-[800px]">
                        Tout le monde répond à une question, mais l'imposteur a une question légèrement différente...
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("diner-extreme")}
                  disabled={activePlayersCount < GAME_METADATA["diner-extreme"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-orange-900/20 ${
                    activePlayersCount < GAME_METADATA["diner-extreme"].minPlayers 
                      ? "opacity-50 grayscale" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">
                        <span className="not-italic mr-1">🍽️</span>DÎNER DE L'EXTRÊME
                        <span className="ml-2 text-[10px] font-black tracking-widest text-white/70 normal-case">multi-cell</span>
                      </h2>
                      <p className="text-orange-100/70 text-sm leading-tight max-w-[800px]">
                        Accomplissez des missions secrètes pendant le repas, mais attention à ne pas vous faire cramer !
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("sabotage-silencieux")}
                  disabled={activePlayersCount < GAME_METADATA["sabotage-silencieux"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-fuchsia-600 to-pink-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-fuchsia-900/20 ${
                    activePlayersCount < GAME_METADATA["sabotage-silencieux"].minPlayers
                      ? "opacity-50 grayscale"
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic"><span className="not-italic mr-1">🕶️</span>SABOTAGE SILENCIEUX</h2>
                      <p className="text-fuchsia-100/80 text-sm leading-tight max-w-[800px]">
                        Réussissez un défi collectif en 2 minutes pendant qu’un saboteur secret tente de faire échouer le groupe sans se faire repérer.
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

          {gameState === "mission-review" && (
            <motion.div
              key="mission-review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-8 pt-12"
            >
              {missionReviewStep === "review" ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
                      {missionReviewTotal > 0 ? `${missionReviewCurrent}/${missionReviewTotal}` : "0/0"}
                    </p>
                    <h2 className="text-2xl font-black">🎯 Mission générée</h2>
                    <p className="text-slate-300 text-sm">Modifie si besoin, puis Oui/Non. “Terminé” affiche le récap.</p>
                  </div>

                  {missionHistoryIndex > 0 && (
                    <button
                      onClick={goToPreviousMission}
                      className="w-full py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 font-bold hover:bg-slate-700/60 transition"
                    >
                      ⬅️ Retour à la mission d’avant
                    </button>
                  )}

                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-black mb-2">Proposition</p>
                    <p className="text-white font-bold">{missionGenerated}</p>

                    <div className="mt-4">
                      <p className="text-slate-400 text-xs uppercase tracking-widest font-black mb-2">Ta version (modifiable)</p>
                      <textarea
                        value={missionDraft}
                        onChange={(e) => {
                          const next = e.target.value;
                          setMissionDraft(next);
                          persistCurrentDraftToHistory(next);
                        }}
                        rows={4}
                        className="w-full rounded-xl bg-slate-900/60 border border-slate-700/60 p-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={acceptCurrentMission}
                      className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                    >
                      ✅ Oui
                    </button>
                    <button
                      onClick={rejectCurrentMission}
                      className="w-full py-4 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition"
                    >
                      ❌ Non
                    </button>
                  </div>

                  <button
                    onClick={finishMissionReview}
                    className="w-full py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-200 font-bold hover:bg-purple-600/30 transition"
                  >
                    Terminé (voir le récap) ✅
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black">Récapitulatif de tes missions</h2>
                    <p className="text-slate-300 text-sm">Voici les missions que tu as gardées, dans l’ordre.</p>
                  </div>

                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-black mb-2">Format code</p>
                    {acceptedMissions.length === 0 ? (
                      <p className="text-slate-400 text-sm">—</p>
                    ) : (
                      <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-tight">
                        {acceptedMissions
                          .map((m) => normalizeMission(m.text))
                          .filter(Boolean)
                          .map((m) => `"${m}",`)
                          .join("\n")}
                      </pre>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setMissionReviewStep("review");
                      if (missionGenerated.trim().length > 0 && missionDraft.trim().length === 0) {
                        setMissionDraft(missionGenerated);
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-200 font-bold hover:bg-slate-700/60 transition"
                  >
                    Continuer à générer des missions
                  </button>
                </div>
              )}

              <button
                onClick={resetToHome}
                className="w-full py-4 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-bold uppercase tracking-widest text-xs hover:bg-purple-600/30 transition"
              >
                Retour au Hub 🔙
              </button>
            </motion.div>
          )}

          {gameState === "diner-extreme" && (
            <DinerExtreme
              players={activePlayers}
              onBack={resetToHome}
            />
          )}

          {gameState === "settings" && activeGame !== null && (
            <GameSettings
              key={activeGame}
              gameType={activeGame}
              playersCount={activePlayersCount}
              onBack={resetToHome}
              onStart={startGame}
              initialConfig={lastGameConfigs[activeGame]}
            />
          )}

          {gameState === "playing" && activeGame === "trapped-round" && gameConfig && (
            <TrappedRound
              players={activePlayers}
              config={gameConfig}
              enablePhoneVote={phoneVoteEnabled}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "word-impostor" && gameConfig && (
            <WordImpostor
              players={activePlayers}
              config={gameConfig}
              enablePhoneVote={phoneVoteEnabled}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "question-impostor" && gameConfig && (
            <QuestionImpostor
              players={activePlayers}
              config={gameConfig}
              enablePhoneVote={phoneVoteEnabled}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "trouve-regle" && gameConfig && (
            <TrouveRegle
              players={activePlayers}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "custom-impostor" && (
            <CustomImpostor
              players={activePlayers}
              onBack={resetToHome}
            />
          )}

          {gameState === "fortune-wheel" && (
            <RoueDeLaChance onBack={resetToHome} />
          )}

          {gameState === "team-creator" && (
            <TeamCreator onBack={resetToHome} players={activePlayers} />
          )}

          {gameState === "playing" && activeGame === "sabotage-silencieux" && gameConfig && (
            <SabotageSilencieux players={activePlayers} config={gameConfig} enablePhoneVote={phoneVoteEnabled} onBack={resetToHome} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
