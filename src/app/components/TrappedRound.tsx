import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { GameConfig } from "@/app/components/GameSettings";
import { ChevronLeft, Eye, Check, RotateCcw, Award, Info, Users, ShieldAlert, Brain } from "lucide-react";
import { toast } from "sonner";

interface TrappedRoundProps {
  players: Player[];
  config: GameConfig;
  enablePhoneVote: boolean;
  onBack: () => void;
}

const CONSTRAINTS = [
  // 🟢 Choix simples
  "Tu préfères te lever tôt ou te coucher tard ?",
  "Tu préfères parler ou écouter ?",
  "Tu préfères être seul ou entouré ?",
  "Tu préfères planifier ou improviser ?",
  "Tu préfères faire vite ou faire bien ?",
  "Tu préfères suivre ou diriger ?",
  "Tu préfères rester calme ou dire ce que tu penses ?",
  "Tu préfères la routine ou le changement ?",
  "Tu préfères rester chez toi ou sortir ?",
  "Tu préfères décider seul ou en groupe ?",
  "Tu préfères observer ou participer ?",
  "Tu préfères être discret ou remarqué ?",
  "Tu préfères économiser ou dépenser ?",
  "Tu préfères la sécurité ou le risque ?",
  "Tu préfères le silence ou le bruit ?",
  "Tu préfères travailler sous pression ou tranquillement ?",
  "Tu préfères prévoir à l’avance ou gérer sur le moment ?",
  "Tu préfères faire confiance vite ou lentement ?",

  // 🔵 Opinions simples et rapides
  "C’est mieux le matin ou le soir ?",
  "C’est mieux seul ou en équipe ?",
  "C’est mieux parler trop ou pas assez ?",
  "C’est mieux être honnête ou diplomate ?",
  "C’est mieux décider vite ou prendre son temps ?",
  "C’est mieux strict ou flexible ?",
  "C’est mieux prévoir le pire ou rester optimiste ?",
  "C’est mieux faire simple ou compliqué ?",
  "C’est mieux écouter les règles ou suivre son instinct ?",
  "C’est mieux finir ce qu’on commence ou changer quand ça bloque ?",
  "Tu préfères les vacances à la plage ou à la montagne ?",
  "Tu préfères lire un livre ou regarder une série ?",
  "Tu préfères le chocolat ou la vanille ?",
  "Tu préfères le café ou le thé ?",
  "Tu préfères les chiens ou les chats ?",
  "Tu préfères la musique ou le silence ?",
  "Tu préfères le shopping ou rester tranquille ?",
  "Tu préfères cuisiner ou commander à manger ?",
  "Tu préfères Netflix ou YouTube ?",
  "Tu préfères le sport ou les jeux vidéo ?",
  "Tu préfères le sucré ou le salé ?",
  "Tu préfères l’été ou l’hiver ?",
  "Tu préfères rester au chaud ou sortir dans le froid ?",
  "Tu préfères voyager loin ou rester proche ?",
  "Tu préfères marcher ou prendre le bus ?",
  "Tu préfères jouer ou regarder les autres jouer ?",
  "Tu préfères les films d’horreur ou les comédies ?",
  "Tu préfères les livres papier ou numériques ?",
  "Tu préfères la ville ou la campagne ?",

  // 🟣 Situations concrètes
  "Quelqu’un est en retard : tu attends ou tu pars ?",
  "On te coupe la parole : tu laisses passer ou tu reprends ?",
  "Un message reste sans réponse : tu relances ou tu laisses tomber ?",
  "Quelqu’un te critique : tu réponds ou tu ignores ?",
  "On te met la pression : tu accélères ou tu ralentis ?",
  "Un ami annule : tu comprends ou ça t’énerve ?",
  "Quelqu’un te ment : tu confrontes ou tu observes ?",
  "On te demande un service chiant : tu acceptes ou tu refuses ?",
  "Quelqu’un insiste : tu cèdes ou tu bloques ?",
  "Tu fais une erreur : tu l’assumes ou tu minimises ?",
  "Un collègue prend ton idée : tu dis quelque chose ou tu laisses passer ?",
  "Quelqu’un t’interrompt sans raison : tu réagis ou tu ignores ?",
  "On te demande ton avis sur quelque chose que tu ne connais pas : tu inventes ou tu dis la vérité ?",
  "Tu dois choisir un film pour tout le monde : tu prends le tien ou tu choisis autre chose ?",
  "Tu dois aider quelqu’un mais tu es pressé : tu aides ou tu pars ?",
  "Quelqu’un critique ton style : tu défends ou tu laisses passer ?",
  "On te demande de choisir une activité : tu choisis toi ou tu laisses les autres décider ?",
  "Tu dois décider qui commence un jeu : tu choisis toi ou un autre ?",
  "Quelqu’un gâche le jeu : tu râles ou tu continues ?",
  "On te pose une question personnelle : tu réponds ou tu esquives ?",
  "Tu dois expliquer un choix : tu donnes ta vraie raison ou une fausse ?",
  "Tu dois dire un secret : tu le dis ou tu mens légèrement ?",
  "On te pose une question de culture générale : tu inventes ou tu dis que tu sais pas ?",
  "Tu dois partager quelque chose à manger : tu donnes tout ou un peu ?",
  "On te demande ton opinion sur une série : tu critiques ou tu approuves ?",
  "Tu dois dire ce que tu ferais dans une situation gênante : tu exagères ou tu minimises ?",
  "On te demande ton plat préféré : tu dis vrai ou tu triches ?",
  "Quelqu’un te taquine : tu réponds ou tu ignores ?",
  "On te demande ton point de vue sur un sujet controversé : tu choisis un côté ou tu restes neutre ?",
  "Quelqu’un te provoque : tu réagis ou tu laisses passer ?",
];

const MISSIONS = [
"Te contredire au moins une fois",
"Changer d’avis deux fois pendant chaque tours",
"Accuser quelqu’un au moins une fois",
"Défendre quelqu’un alors qu'il n'est pas accuser",
"Dire « je suis pas d’accord » au moins deux fois",
"Poser une question qui n'as aucuns rapport",
"Répondre a coté de la plaque",
"Couper chaque joueurs une fois",
"Répondre même quand ce n’est pas ton tour",
"Insister sur un détail inutile",
"Redire la réponse d’un autre joueur mots pour mots",
"Répéter subtilement ce que dit les autres joueurs",
"Répondre à la question du tour d'avant (La partie d'avant pour le tour 1)",
"Faire une remarque hors sujet",
"Expliquer quelque chose d’évident",
"Demander confirmation à quelqu’un",
"Toujours réagir exagérément aux réponses d’un même joueur",
"Être systématiquement d’accord avec un joueur précis",
"Douter toujours du même joueur",
"Regarder toujours la même personne en parlant (la même pour les 3 tours)",
"Comparer souvent avec un joueur précis",
"Couper toujours la même personne",
"Créer une tension avec un joueur",
"Faire référence à un joueur absent",
"Mettre un joueur mal à l’aise",
"Exclure quelqu’un de la discussion",
"Commencer chaque réponse par la phrase: je sais pas si vous avez remarqué",
"Répéter souvent le même mot (le même pour les 3 tours)",
"Reformuler la question avant de répondre",
"Faire la plus longue justufication du monde",
"Repondre CHAQUE PHRASE en 5 mots max",
"Utiliser des exemples qui n'ont aucun rapport",
"Parler trop vite",
"Parler trop lentement",
"Répéter ce que tu viens de dire",
"Parler avec les mains à chaque réponse",
"Changer de place à chaque tour",
"Changer de position(spéciales) à chaque tour",
"Regarder ailleurs en parlant",
"Fixer constament un joueur précis",
"Hocher la tête souvent",
"Bouger sur ta chaise (si t'en a pas trouve en une)",
"Toucher ton visage en parlant",
"Jouer avec un objet",
"Croiser et décroiser les bras 5x (par tours)",
"Faire des gestes larges",
"Pointer quelqu’un en parlant (tout le long)",
"Regarder le sol en répondant",
"Regarder le plafond en parlant",
"Se rapprocher d’un joueur",
"Se reculer volontairement (1/2 mètre par tours)",
"Faire de faux rire constament",
"Sourire sans raison",
"Copie les mouvement d'un' autre joueur",
"Toucher le sol souvent",
"Faire pleins de bruit de bouche tout le temps",
"Respirer fort avant de parler",
"Soupirer fort souvent",
"Lever les mais au dessus des épaules (tout le long)",
"Dire 'OUI' ou 'NON' à tout, même quand c’est pas logique",
"Se lever et faire 3 pas à chaque tour",
"Faire semblant de boire dans une bouteille invisible",
"Parler en exagérant comme un professeur fou",
"Faire des bruits bizarres entre chaque mot",
"Imiter l’intonation de la personne précédente",
"Faire semblant de tomber ou trébucher légèrement",
"Répéter une phrase inutile deux fois",
"Chanter un mot de ta réponse",
"Se couvrir les yeux ou les oreilles brièvement",
"Dire le contraire de tout le monde en exagérant",
"Réagir de façon trop dramatique à chaque réponse"
];

type Step = "reveal" | "round_start" | "voting_time" | "phone_vote" | "reveal_result";

export function TrappedRound({ players, config, enablePhoneVote, onBack }: TrappedRoundProps) {
  const [step, setStep] = useState<Step>("reveal");
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [impostorsIds, setImpostorsIds] = useState<string[]>([]);
  const [missions, setMissions] = useState<Record<string, string>>({});
  const [constraint, setConstraint] = useState("");
  const [usedConstraints, setUsedConstraints] = useState<string[]>([]);
  const [showRole, setShowRole] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [round, setRound] = useState(1);
  const [startingPlayerId, setStartingPlayerId] = useState("");
  const [votesByPlayer, setVotesByPlayer] = useState<Record<string, string[]>>({});
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);
  const [selectedVoteIds, setSelectedVoteIds] = useState<string[]>([]);

  const requiredSelections = Math.min(Math.max(1, config.impostorCount), players.length);
  const currentVoter = players[currentVoterIdx];

  const voteGridColsClass = React.useMemo(() => {
    if (players.length <= 7) return "grid-cols-1";
    if (players.length <= 12) return "grid-cols-2";
    return "grid-cols-3";
  }, [players.length]);

  const voteResults = React.useMemo(() => {
    const counts = Object.values(votesByPlayer).flat().reduce<Record<string, number>>((acc, votedId) => {
      acc[votedId] = (acc[votedId] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([id, votes]) => ({ id, votes, name: players.find((player) => player.id === id)?.name ?? "Inconnu" }))
      .sort((a, b) => {
        const voteDiff = b.votes - a.votes;
        if (voteDiff !== 0) return voteDiff;
        const aIsImpostor = impostorsIds.includes(a.id) ? 1 : 0;
        const bIsImpostor = impostorsIds.includes(b.id) ? 1 : 0;
        return bIsImpostor - aIsImpostor;
      });
  }, [votesByPlayer, players, impostorsIds]);

  useEffect(() => {
    if (showRole && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showRole, countdown]);

  useEffect(() => {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const selectedImpostors = shuffled.slice(0, config.impostorCount).map(p => p.id);
    setImpostorsIds(selectedImpostors);

    const missionMap: Record<string, string> = {};
    selectedImpostors.forEach(id => {
      missionMap[id] = MISSIONS[Math.floor(Math.random() * MISSIONS.length)] ?? "Fais une remarque hors sujet";
    });
    setMissions(missionMap);
    
    // Pick first constraint
    const firstConstraint = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)] ?? CONSTRAINTS[0] ?? "";
    setConstraint(firstConstraint);
    setUsedConstraints([firstConstraint]);
    
    // Random starting player
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)]?.id ?? players[0]?.id ?? "");
  }, [players, config]);

  const handleNextReveal = () => {
    setShowRole(false);
    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      setStep("round_start");
    }
  };

  const nextRound = () => {
    setRound(round + 1);
    const available = CONSTRAINTS.filter(c => !usedConstraints.includes(c));
    const next = available.length > 0 
      ? (available[Math.floor(Math.random() * available.length)] ?? available[0] ?? "")
      : (CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)] ?? CONSTRAINTS[0] ?? ""); // Fallback if all used
    
    setConstraint(next);
    setUsedConstraints(prev => [...prev, next]);
    
    // Random starting player for each round
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)]?.id ?? players[0]?.id ?? "");
    
    setStep("round_start");
  };

  const startVote = () => {
    if (enablePhoneVote) {
      setVotesByPlayer({});
      setCurrentVoterIdx(0);
      setSelectedVoteIds([]);
      setStep("phone_vote");
      return;
    }
    setStep("voting_time");
  };

  const resetGame = () => {
    setStep("reveal");
    setCurrentPlayerIdx(0);
    setRound(1);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const selectedImpostors = shuffled.slice(0, config.impostorCount).map(p => p.id);
    setImpostorsIds(selectedImpostors);
    const missionMap: Record<string, string> = {};
    selectedImpostors.forEach(id => {
      missionMap[id] = MISSIONS[Math.floor(Math.random() * MISSIONS.length)] ?? "Fais une remarque hors sujet";
    });
    setMissions(missionMap);
    const first = CONSTRAINTS[Math.floor(Math.random() * CONSTRAINTS.length)] ?? CONSTRAINTS[0] ?? "";
    setConstraint(first);
    setUsedConstraints([first]);
    setStartingPlayerId(players[Math.floor(Math.random() * players.length)]?.id ?? players[0]?.id ?? "");
    setVotesByPlayer({});
    setCurrentVoterIdx(0);
    setSelectedVoteIds([]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
        <div className="text-center">
          <h2 className="text-xs font-bold text-purple-500 uppercase tracking-widest">🎭 Mission Comportementale</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {requiredSelections} {requiredSelections > 1 ? "Imposteurs" : "Imposteur"} parmi vous
          </p>
          {step !== "reveal" && <p className="text-sm font-medium text-slate-300">Round {round}</p>}
        </div>
        <div className="w-10"></div>
      </header>

      <AnimatePresence mode="wait">
        {step === "reveal" && (
          <motion.div key="reveal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex-1 flex flex-col justify-center gap-8 text-center">
            <div className="space-y-4">
              <p className="text-slate-400">Passe l'appareil à</p>
              <h3 className="text-3xl font-black text-white italic uppercase">{players[currentPlayerIdx].name}</h3>
            </div>

            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl shadow-2xl">
              {!showRole ? (
                <button onClick={() => { setShowRole(true); setCountdown(5); }} className="flex flex-col items-center gap-4 w-full py-4">
                  <div className="p-6 bg-purple-600/20 rounded-full text-purple-400 animate-pulse">
                    <Eye size={48} />
                  </div>
                  <p className="font-bold text-purple-400 uppercase tracking-widest text-xs">Voir mon rôle</p>
                </button>
              ) : (
                <div className="space-y-8 animate-in zoom-in duration-300">
                  <div className="space-y-2">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Ton Identité</p>
                    {impostorsIds.includes(players[currentPlayerIdx].id) ? (
                      <div className="space-y-4">
                        <p className="text-4xl font-black text-red-500 italic uppercase">Imposteur</p>
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                          <p className="text-xs uppercase text-slate-400 mb-1">Mission Secrète (A faire à chaque tours)</p>
                          <p className="text-lg font-bold text-white leading-tight underline decoration-red-500">{missions[players[currentPlayerIdx].id]}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-4xl font-black text-emerald-500 italic uppercase">Innocent</p>
                        <p className="text-slate-400 text-sm italic">Fais l'action naturellement.</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleNextReveal} 
                    disabled={countdown > 0}
                    className="w-full py-4 bg-purple-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                  >
                    {countdown > 0 ? `Attends (${countdown}s)` : "OK, Suivant"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === "round_start" && (
          <motion.div key="round" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col justify-center gap-10">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">La Question du Tour</h3>
                <div className="p-8 bg-slate-800 border-2 border-purple-500/30 rounded-3xl shadow-2xl relative">
                   <Brain className="absolute -top-6 -left-6 text-purple-500 bg-[#0f172a] p-2 rounded-full shadow-lg" size={40} />
                   <p className="text-xl font-black text-white italic leading-tight uppercase">"{constraint}"</p>
                </div>
              </div>

              <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                  Celui qui commence : <span className="text-white ml-1 font-black italic">{players.find(p => p.id === startingPlayerId)?.name}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-slate-500 text-[10px] font-medium uppercase tracking-widest mb-2">Chacun répond une fois, rapidement !</p>
              {round < 3 ? (
                <button onClick={nextRound} className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
                  Sujet suivant (Round {round + 1})
                </button>
              ) : (
                <button onClick={startVote} className="w-full py-5 bg-white text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
                  Passer au vote
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === "voting_time" && (
          <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <div className="inline-flex p-8 bg-purple-600/20 rounded-full text-purple-400 mb-4 animate-bounce">
                <Users size={64} />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Moment du Vote !</h2>
              <p className="text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                Discutez ensemble et désignez <span className="text-white font-bold">{impostorsIds.length}</span> suspects dans la vraie vie.
              </p>
            </div>

            <button onClick={() => setStep("reveal_result")} className="mt-8 py-5 bg-purple-600 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">
              Découvrir la vérité
            </button>
          </motion.div>
        )}

        {step === "phone_vote" && (
          <motion.div key="phone-vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-4 pt-2">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Vote</h3>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                C'est au tour de voter : {currentVoter?.name}
              </p>
              <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest text-center">
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
                        ? "bg-purple-500/10 border-purple-500/50 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase text-slate-500">{player.name}</span>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase italic shrink-0 ${selectedVoteIds.includes(player.id) ? "bg-purple-500 text-black" : "bg-slate-900 text-slate-400"}`}>
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
                setStep("reveal_result");
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
                  setStep("reveal_result");
                }
              }}
              disabled={selectedVoteIds.length !== requiredSelections}
              className="mt-auto w-full py-3.5 bg-purple-600 text-white font-black uppercase italic rounded-2xl disabled:opacity-50"
            >
              Valider le vote
            </button>
          </motion.div>
        )}

        {step === "reveal_result" && (
          <motion.div key="result" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col justify-center text-center gap-8">
            <div className="space-y-6">
              <ShieldAlert size={80} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">Les Coupables !</h2>
              {enablePhoneVote && voteResults.length > 0 && (
                <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl max-w-[320px] mx-auto space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Résultats des votes</p>
                  <div className="space-y-1">
                    {voteResults.map((entry) => (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between ${
                          impostorsIds.includes(entry.id)
                            ? "bg-red-500/10 border-red-500/50"
                            : "bg-slate-800 border-slate-700"
                        }`}
                      >
                        <span className={`text-xs font-black uppercase italic ${impostorsIds.includes(entry.id) ? "text-red-400" : "text-white"}`}>
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
              <div className="grid gap-3 max-w-[300px] mx-auto">
                {impostorsIds.map(id => (
                  <div key={id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-left">
                    <p className="text-red-500 font-black uppercase italic">{players.find(p => p.id === id)?.name}</p>
                    <p className="text-xs text-slate-400 mt-1 italic">Mission : {missions[id]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button onClick={resetGame} className="py-4 bg-purple-600 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2">
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
