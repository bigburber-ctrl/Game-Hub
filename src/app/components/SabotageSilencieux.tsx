import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Eye, RefreshCcw, ShieldAlert, Target, CheckCircle2 } from "lucide-react";
import { Player } from "@/app/App";
import { GameConfig } from "@/app/components/GameSettings";

interface SabotageSilencieuxProps {
  players: Player[];
  config: GameConfig;
  enablePhoneVote: boolean;
  onBack: () => void;
}

type Challenge = {
  objective: string;
};

type Step = "reveal" | "play" | "vote_oral" | "vote" | "results";

const CHALLENGES: Challenge[] = [
  {
    objective: "Tout le groupe doit rester parfaitement silencieux pendant 45 secondes tout en se déplaçant librement dans la pièce.",
  },
  {
    objective: "En moins de 90 secondes, les joueurs doivent se placer spontanément en ligne du plus petit au plus grand sans parler.",
  },
  {
    objective: "Tous les joueurs doivent faire exactement le même geste simple en même temps pendant 5 répétitions.",
  },
  {
    objective: "Le groupe doit réussir à changer de position assis/debout tous ensemble 6 fois avec un rythme identique.",
  },
  {
    objective: "En 2 minutes max, chacun doit reproduire un mini mouvement montré par le leader du tour, dans le même ordre.",
  },
  {
    objective: "Tous les joueurs doivent se regarder et lever la main exactement en même temps, 4 fois de suite, sans signal vocal.",
  },
  {
    objective: "Le groupe doit former un cercle parfait puis le reformer 3 fois rapidement sans parler.",
  },
  {
    objective: "Chaque joueur doit pointer une personne différente en même temps, et le groupe doit réussir 3 tours sans doublon.",
  },
  {
    objective: "En moins de 2 minutes, le groupe doit créer une vague corporelle qui fait le tour des joueurs 5 fois sans rupture.",
  },
  {
    objective: "Tous les joueurs doivent se retourner dos au centre puis revenir face au centre en parfaite synchronisation, 6 fois.",
  },
  {
    objective: "Le groupe doit garder une distance égale entre chacun pendant 60 secondes en se déplaçant lentement.",
  },
  {
    objective: "En silence, le groupe doit choisir un leader implicite et suivre ses déplacements pendant 1 minute sans hésitation visible.",
  },
  {
    objective: "Tous les joueurs doivent alterner entre deux postures simples au même rythme pendant 75 secondes.",
  },
  {
    objective: "Le groupe doit réaliser 10 changements de direction collectifs (gauche/droite) sans parole et sans arrêt.",
  },
  {
    objective: "En 90 secondes, les joueurs doivent réussir 4 séquences où chacun mime une émotion identique en même temps.",
  },
  {
    objective: "Le groupe doit taper discrètement un rythme avec les mains sur les cuisses pendant 1 minute en restant parfaitement coordonné.",
  },
  {
    objective: "Tous les joueurs doivent fixer un point commun puis changer de point en même temps 8 fois sans signal verbal.",
  },
  {
    objective: "En moins de 2 minutes, le groupe doit effectuer 5 transitions fluides entre position assise et debout avec un tempo constant.",
  },
];

export function SabotageSilencieux({ players, config, enablePhoneVote, onBack }: SabotageSilencieuxProps) {
  const [step, setStep] = useState<Step>("reveal");
  const [challengeIndex, setChallengeIndex] = useState(() => Math.floor(Math.random() * CHALLENGES.length));
  const [saboteurIds, setSaboteurIds] = useState<string[]>([]);
  const [revealStep, setRevealStep] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [groupSucceeded, setGroupSucceeded] = useState<boolean | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [votesByPlayer, setVotesByPlayer] = useState<Record<string, string[]>>({});
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);
  const [selectedVoteIds, setSelectedVoteIds] = useState<string[]>([]);

  const requiredSelections = Math.min(Math.max(1, config.impostorCount ?? 1), players.length);

  const currentChallenge = CHALLENGES[challengeIndex];

  const numberedChallenges = useMemo(
    () => CHALLENGES.map((challenge, index) => ({ ...challenge, index: index + 1 })),
    []
  );

  const setupRound = () => {
    if (players.length === 0) return;
    const randomChallenge = Math.floor(Math.random() * CHALLENGES.length);
    const saboteursCount = Math.min(Math.max(1, config.impostorCount ?? 1), players.length);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const chosenSaboteurs = shuffled.slice(0, saboteursCount).map((player) => player.id);
    setChallengeIndex(randomChallenge);
    setSaboteurIds(chosenSaboteurs);
    setRevealStep(0);
    setShowRole(false);
    setGroupSucceeded(null);
    const configuredMinutes = typeof config.timeLimitMinutes === "number" ? config.timeLimitMinutes : 3;
    const clampedMinutes = Math.min(Math.max(1, configuredMinutes), 4);
    setSecondsLeft(clampedMinutes * 60);
    setVotesByPlayer({});
    setCurrentVoterIdx(0);
    setSelectedVoteIds([]);
    setStep("reveal");
  };

  const currentPlayer = players[revealStep];
  const isCurrentPlayerSaboteur = Boolean(currentPlayer && saboteurIds.includes(currentPlayer.id));

  const restart = () => {
    setStep("reveal");
    setRevealStep(0);
    setShowRole(false);
    setGroupSucceeded(null);
    setupRound();
  };

  const saboteurNames = players
    .filter((player) => saboteurIds.includes(player.id))
    .map((player) => player.name)
    .join(" • ");

  const currentVoter = players[currentVoterIdx];
  const voteGridColsClass = useMemo(() => {
    if (players.length <= 7) return "grid-cols-1";
    if (players.length <= 12) return "grid-cols-2";
    return "grid-cols-3";
  }, [players.length]);

  const voteResults = useMemo(() => {
    const counts = Object.values(votesByPlayer).flat().reduce<Record<string, number>>((acc, votedId) => {
      acc[votedId] = (acc[votedId] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([id, votes]) => ({ id, votes, name: players.find((player) => player.id === id)?.name ?? "Inconnu" }))
      .sort((a, b) => {
        const voteDiff = b.votes - a.votes;
        if (voteDiff !== 0) return voteDiff;
        const aIsSaboteur = saboteurIds.includes(a.id) ? 1 : 0;
        const bIsSaboteur = saboteurIds.includes(b.id) ? 1 : 0;
        return bIsSaboteur - aIsSaboteur;
      });
  }, [votesByPlayer, players, saboteurIds]);

  React.useEffect(() => {
    setupRound();
  }, [players, config.impostorCount]);

  React.useEffect(() => {
    if (step !== "play") return;
    if (secondsLeft <= 0) {
      setGroupSucceeded(false);
      setStep(enablePhoneVote ? "vote" : "vote_oral");
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, secondsLeft, enablePhoneVote]);

  const minutesDisplay = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secondsDisplay = String(secondsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1"
    >
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
          <h2 className="text-xs font-black text-fuchsia-400 uppercase italic tracking-widest">🕶️ Sabotage Silencieux</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {requiredSelections} {requiredSelections > 1 ? "Saboteurs" : "Saboteur"} parmi vous
          </p>
        </div>
        <button
          onClick={restart}
          className="p-2 text-slate-400 hover:bg-slate-800 rounded-full"
          aria-label="Recommencer"
        >
          <RefreshCcw size={18} />
        </button>
      </header>

      <AnimatePresence mode="wait">
        {step === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center gap-8 text-center"
          >
            <div className="space-y-4">
              <p className="text-slate-400 uppercase font-black text-[10px] tracking-widest">C'est au tour de</p>
              <h3 className="text-3xl font-black text-white italic uppercase break-words">{currentPlayer?.name}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase italic tracking-widest">Consulte ton rôle secrètement</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border-2 border-slate-700 space-y-4">
              {!showRole ? (
                <button onClick={() => setShowRole(true)} className="flex flex-col items-center gap-4 w-full py-6">
                  <div className="p-6 bg-fuchsia-500/20 rounded-full text-fuchsia-400">
                    <Eye size={48} />
                  </div>
                  <p className="font-bold text-fuchsia-400 uppercase tracking-widest text-[10px]">Voir mon rôle</p>
                </button>
              ) : (
                <div className="space-y-4 animate-in zoom-in duration-300">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Ton rôle</p>
                  <div className={`p-4 rounded-2xl border-2 ${isCurrentPlayerSaboteur ? "bg-red-500/10 border-red-500/40" : "bg-emerald-500/10 border-emerald-500/40"}`}>
                    <p className={`text-xl font-black italic uppercase ${isCurrentPlayerSaboteur ? "text-red-400" : "text-emerald-400"}`}>
                      {isCurrentPlayerSaboteur ? "SABOTEUR" : "ÉQUIPIER"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowRole(false);
                      if (revealStep < players.length - 1) {
                        setRevealStep((current) => current + 1);
                      } else {
                        setStep("play");
                      }
                    }}
                    className="w-full py-4 bg-white text-black font-black uppercase italic rounded-2xl"
                  >
                    {revealStep < players.length - 1 ? "Joueur suivant" : "Lancer le défi"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === "play" && (
          <motion.div
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col gap-6 pt-4"
          >
            <div className="text-center space-y-2">
              <ShieldAlert size={44} className="mx-auto text-fuchsia-500" />
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Manche en cours</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Timer de mission en cours</p>
            </div>

            <div className="bg-slate-800 p-5 rounded-2xl border-2 border-fuchsia-500/30">
              <p className="text-center text-4xl font-black text-fuchsia-300 mb-3">{minutesDisplay}:{secondsDisplay}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Objectif collectif</p>
              <p className="text-white font-bold text-center italic">{currentChallenge.objective}</p>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => {
                  setGroupSucceeded(true);
                  setStep(enablePhoneVote ? "vote" : "vote_oral");
                }}
                className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase italic flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Mission Réussie !
              </button>
            </div>
          </motion.div>
        )}

        {step === "vote_oral" && (
          <motion.div
            key="vote-oral"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-center text-center gap-8"
          >
            <div className="space-y-6">
              <div className="inline-flex p-8 bg-fuchsia-600/20 rounded-full text-fuchsia-400 mb-4 animate-pulse">
                <Target size={64} />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Moment du Vote !</h2>
              <p className="text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Discutez ensemble et désignez <span className="text-white font-bold">{saboteurIds.length}</span> suspect{saboteurIds.length > 1 ? "s" : ""} dans la vraie vie.
              </p>
            </div>

            <button onClick={() => setStep("results")} className="mt-8 py-5 bg-fuchsia-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
              Découvrir la vérité
            </button>
          </motion.div>
        )}

        {step === "vote" && (
          <motion.div
            key="vote"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col gap-4 pt-2"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Vote</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                {groupSucceeded ? "Mission réussie" : "Mission échouée"} • Qui est le saboteur ?
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                C'est au tour de voter : {currentVoter?.name}
              </p>
              <p className="text-[10px] font-black text-fuchsia-300 uppercase tracking-widest text-center">
                Sélectionne {requiredSelections} personne{requiredSelections > 1 ? "s" : ""}
              </p>
              <div className={`grid ${voteGridColsClass} gap-1.5 max-h-[34vh] overflow-y-auto pr-1`}>
                {players.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => {
                      setSelectedVoteIds((current) => {
                        if (current.includes(player.id)) {
                          return current.filter((id) => id !== player.id);
                        }
                        if (requiredSelections === 1) {
                          return [player.id];
                        }
                        if (current.length >= requiredSelections) {
                          return current;
                        }
                        return [...current, player.id];
                      });
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedVoteIds.includes(player.id)
                        ? "bg-fuchsia-500/10 border-fuchsia-500/50 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase text-slate-500">{player.name}</span>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase italic shrink-0 ${selectedVoteIds.includes(player.id) ? "bg-fuchsia-500 text-black" : "bg-slate-900 text-slate-400"}`}>
                        {selectedVoteIds.includes(player.id) ? "Sélect." : "Voter"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

            </div>

            <button
              onClick={() => {
                setSelectedVoteIds([]);
                setVotesByPlayer({});
                setStep("results");
              }}
              className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-lg border border-slate-700 hover:border-slate-600 transition"
            >
              Skipper le vote
            </button>

            <button
              onClick={() => {
                if (!currentVoter || selectedVoteIds.length !== requiredSelections) return;
                setVotesByPlayer((prev) => ({ ...prev, [currentVoter.id]: selectedVoteIds }));
                setSelectedVoteIds([]);
                if (currentVoterIdx < players.length - 1) {
                  setCurrentVoterIdx((current) => current + 1);
                } else {
                  setStep("results");
                }
              }}
              disabled={selectedVoteIds.length !== requiredSelections}
              className="mt-auto w-full py-3.5 bg-fuchsia-600 text-white font-black uppercase italic rounded-2xl disabled:opacity-50"
            >
              Valider le vote
            </button>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col gap-4 pt-2"
          >
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Résultat</h3>
              <p className={`text-xs font-black uppercase tracking-widest ${groupSucceeded ? "text-emerald-400" : "text-red-400"}`}>
                {groupSucceeded ? "Le groupe a réussi" : "Le groupe a échoué"}
              </p>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border-2 border-fuchsia-500/30 space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                {saboteurIds.length > 1 ? "Saboteurs révélés" : "Saboteur révélé"}
              </p>
              <p className="text-center text-xl font-black text-red-400 italic uppercase break-words">
                {saboteurNames || "Inconnu"}
              </p>
            </div>

            {enablePhoneVote && voteResults.length > 0 && (
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Résultats des votes</p>
                <div className="space-y-1">
                  {voteResults.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between ${
                        saboteurIds.includes(entry.id)
                          ? "bg-red-500/10 border-red-500/50"
                          : "bg-slate-800 border-slate-700"
                      }`}
                    >
                      <span className={`text-xs font-black uppercase italic ${saboteurIds.includes(entry.id) ? "text-red-400" : "text-white"}`}>
                        {entry.name}
                      </span>
                      <span className="text-[10px] font-black bg-slate-900 text-slate-300 px-2 py-1 rounded uppercase italic shrink-0">
                        {entry.votes} vote{entry.votes > 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={setupRound}
                className="w-full py-4 bg-fuchsia-600 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-2"
              >
                <RefreshCcw size={18} /> Rejouer
              </button>
              <button onClick={onBack} className="w-full py-4 bg-slate-800 text-slate-300 font-black uppercase italic rounded-2xl">
                Menu Principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
