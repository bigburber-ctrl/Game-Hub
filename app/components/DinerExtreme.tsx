import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import type { Player } from "../App";

// Missions prédéfinies - infinies avec boucle
const MISSIONS_POOL: string[] = [];

export const RAW_FALLBACK_MISSIONS_POOL: string[] = [
"Commence toutes tes phrases par « Personnellement » pendant 2 minutes.",
"Dis « Quoicoubeh » ou « Ampagnan » 5 fois à voix haute.",
"Gargarise-toi avec une boisson pendant 5 secondes.",
"Sois en désaccord avec tout ce que les autres disent pendant 2 minutes.",
"Quitte la table et va te cacher pendant exactement 4 minutes.",
"Fais au moins 3 compliments au chef.",
"Roule par terre pendant 5 secondes.",
"Change de place avec un joueur et reste à cette place pendant 2 minutes.",
"Dis « Wesh wesh cane à pêche » à voix haute.",
"Mange pendant 2 minutes uniquement avec ta cuillère.",
"Mange pendant 2 minutes de manières très sophistiquées (Petit doigt levé, pas de coude sur la table, essuie ta bouche après chaque bouchée).",
"Parle uniquement en anglais pendant 2 minutes.",
"Place ta main devant la bouche de ton voisin juste avant qu’il prenne une bouchée",
"Fais le tour complet de la table.",
"Dis du mal de X.",
"Remplis le verre de tous les invités sauf celui de X.",
"Chante une chanson pendant au moins 8 secondes.",
"Place les mots « M », « M » et « M » dans trois phrases différentes.",
"Trouve un chapeau et porte-le sur ta tête pendant 1 minute.",
"Fais des push-ups.",
"Fais un massage d’épaules à quelqu’un.",
"Coupe la parole de X exactement 2 fois.",
"Chatouille ton voisin pendant 3 secondes.",
"Fais un bras de fer contre X et perd.",
"Fais un placement de produit d’un objet sur la table pendant 20 secondes.",
"Frappe la table une fois et fais une annonce dramatique.",
"Essaie de séduire quelqu’un.",
"Surjoue toutes tes émotions pendant 2 minutes.",
"Lève la main et attend qu'on te donne le droit de parole.",
"Parle de toi à la troisième personne pendant 2 minutes.",
"Empêche X de manger le plus possible.",
"Miaule chaque fois que X parle pendant 3 occurrences.",
"Fais semblant de te faire appeler pendant 30 secondes.",
"Prends les ustensiles de ton voisin et utilise-les au moins 1 minute.",
"Tapote le dos de X 4 fois.",
"Prends 4 bouchée dans l’assiette d’un autre joueur.",
"Prends discrètement une photo de chacun des invités.",
"Décris à voix haute tout ce qu’un joueur fait pendant 30 secondes.",
"Parle avec un accent italien pendant 2 minutes.",
"Fais 6 jumping jacks.",
"Fais en sorte qu’un invité te fasse un compliment.",
"Échange ta cuillère avec celle d’un joueur",
"Va aux toilettes et reviens avec ton chandail à l’envers.",
"Va aux toilettes et reviens avec du papier toilette accroché à ton pantalon.",
"Fais trinquer ton verre avec celui de chaque invité.",
"Accroche ton voisin 6 fois et excuse-toi à chaque fois.",
"Parle la bouche pleine pendant 1 minute.",
"Fais un check différent avec chaque invité.",
"Lance un morceau de nourriture en l’air et attrape-le avec ta bouche.",
"Sois excessivement gentil avec X pendant 2 minutes.",
"Sent les cheveux de X très fortement.",
"Tu dois répéter tout ce que dit X discrètement.",
"Tu dois renverser un verre d'eau sur un des invités par accident.",
"Tu dois parler très fort comme si personne n'entendait pendant 1 minute.",
"Tu dois faire semblant de t'endormir pendant 20 secondes.",
"Tu dois faire semblant de ne pas comprendre ce que les autres disent pendant 1 minute.",
"Assaisonne le plat de ton voisin sans que celui-ci ne s'en rende compte.",
"Tu dois raconter une anecdote qui ressemble a une anecdote d'un autres invité.",
"Tu dois faire dire à X « C'est le meilleure plat que j'ai jamais mangé ».",
"Tu dois faire un compliment à chaque invité (individuellement).",
"Remplis énormément le verre à X, le maximum possible.",
"Tu dois parler espagnol pendant 2 minutes.",
"Caresse les oreilles de X 3 fois.",
"Tu dois jouer sur un jeu mobile de ton choix sans que personne ne remarque (interdit de couper le son).",
"Fait danser l'un des participants.",
"Réussir à faire dire « Ahh ouais j'avoue » à un invité.",
"Il faut que tu fasse porter un de tes vêtements à quelqu'un.",
"Lancer une musique acapela qui doit-être chantée par tous les invités.",
"Fait comme si tu ne savais pas boire, 3 fois",
"Tu dois faire un bisous sur le front de X.",
"Tu dois te plaindre de ton plat au chef.",
"Fait une magnifique roulade sur le sol.",
"Tu dois inverser les assiettes de X et Y.",
"Tu dois faire parler tout le monde en anglais pendant 1 minute.",
"Tu dois échanger ta chaisse avec celle de X.",
"Tu dois faire un « Je te tiens par la barbichette, tu me tiens par la barbichette » avec X.",
"Tu dois proposer aux autres joueurs de juger le rap que tu fait en cachette.",
"Organise un tournois de roche papier ciseaux et faire participer tout les autres invités.",
"Fais un toast improvisé d’au moins 10 secondes.",
"Demande à X de te donner un surnom et utilise-le 3 fois.",
"Fais en sorte que X te passe un objet (sel, eau, pain) sans parler.",
"Fais un compliment très précis à X puis le même à Y.",
"Lance un mini débat absurde (30 secondes) et fais voter X et Y.",
"Imite a la perfection les mouvements de X (1 minute).",
"Ai toute l'attention sur toi, commence une phrase, fais une pause de 5 secondes, puis termine-la (2 fois).",
"Fais semblant d’être un serveur et propose un menu imaginaire à X.",
"Propose un pacte secret à X (ex: lever le verre en même temps) et réussis-le 2 fois.",
"Demande à X de répéter un mot que tu inventes.",
"Parle très lentement pendant 1 minute.",
"Fais une mini interview de X (3 questions rapides).",
"Fais une déclaration dramatique de 10 secondes puis dis « St'une blague  ».",
"Demande à X de te raconter une chose drôle, puis répète-la en exagérant.",
"Fais passer le sel à X, puis demande à Y de le récupérer (sans expliquer pourquoi).",
"Décris ton plat comme si c’était une critique gastronomique pendant 20 secondes.",
"Fais un bruit de trompette avec la bouche 3 fois, à 3 moments différents.",
"Fais en sorte que X et Y trinquent ensemble (une fois).",
"Crie « Mama Mia ».",
"Crie « C'est ma maison ici ».",
"Passe ta main dans les cheveux de X pendant 3 secondes.",
"Fais semblant d’éternuer bruyamment pendant que quelqu’un parle.",
"Crie « J'ai pas le temps de niaiser ».",
"Prend ta cuillère et met la dans la bouche à X.",
"Assieds toi sur les genoux de X pendant 10 secondes.",
"Fais semblant de pleurer pendant 20 secondes.",
"Fais semblant de ronfler pendant 20 secondes.",
"Soulève X.",
"Tu dois placer le mot « M » au moins 3 fois dans la conversation.",
"Tu dois réussir à faire dire le mot « M » à X au moins 2 fois.",
"Tu dois répéter la phrase « P » exactement 2 fois.",
"Tu dois placer le mot « Suspect » au minimum 5 fois.",
"Tu dois faire dire à quelqu’un la phrase « P ».",
"Tu dois dire la phrase « P » 2 fois.",
"Tu dois placer le mot « M » au moins 3 fois.",
"Tu dois faire répéter « P » à X.",
"Tu dois placer le mot « M » exactement 3 fois.",
"Tu dois dire « P » 2 fois.",
"Place le mot « M » au moins 3 fois.",
"Tu dois dire « P » 2 fois.",
"Tu dois dire « M », « M » et « M » dans une conversation.",
"Tu dois faire dire « P » à X.",
"Tu dois placer le mot « M » au minimum 2 fois.",
"Tu dois dire « M », « M » et « M » dans une phrase",
"Tu dois faire la météo pour la table à voix haute.",
"Tu dois parler uniquement en exclamations pendant 1 minute.",
"Tu dois chanter chaque mot de ta prochaine phrase comme si c’était un opéra.",
"Tu dois inventer une insulte totalement ridicule et la dire à X sans te faire remarquer.",
"Tu dois imiter la voix de X pendant 30 secondes tout en répétant ses phrases.",
"Tu dois raconter ce qui vient de se passer, en détail, depuis les 15 dernières secondes",
"Tu dois parler avec un accent complètement inventé et le maintenir pendant 1 minute.",
"Tu dois expliquer pourquoi un objet sur la table est en réalité un artefact magique.",
"Tu dois te lever et toucher le plafond.",
"Tu dois taper trois fois sur la table avec ton coude.",
"Tu dois jongler avec trois fourchettes.",
"Tourner sur toi-même une fois sur ta chaise.",
"Applaudis à trois moments différents.",
"Tu dois faire semblant de lancer une balle invisible à X et qu’il la rattrape.",
"Tu dois te pencher en arrière et faire semblant de tomber.",
"Tu dois mettre un pied sur la table pendant 5 secondes en parlant.",
"Tu dois faire semblant de ramasser quelque chose du sol.",
"Tu dois faire un applaudissement exagéré.",
"Lève les deux mains et agite-les comme un oiseau.",
"Tu dois toucher ton nez pendant 3 secondes, attendre 3 secondes, puis répéter l’action trois fois.",
"Étire-toi exagérément pendant 5 secondes",
"Tapote doucement l’arrière de ta tête trois fois.",
"Tu dois lever les épaules de manière exagérée quand on t’adresse la parole (3 fois).",
"Tu dois mimer le fait de boire dans un verre invisible.",
"Tu dois toucher l’épaule de X trois fois.",
"Tu dois mimer un animal et faire deviner à X lequel.",
"Tu dois échanger ta place avec X pendant au moins 30 secondes.",
"Tu dois réussir à faire chanter X une note aiguë.",
"Tu dois faire lever la main gauche de X.",
"Tu dois faire faire un tour complet à X sur lui-même.",
"Tu dois faire taper X trois fois sur la table.",
"Tu dois faire imiter à X ton geste le plus étrange.",
"Tu dois faire lever les deux bras de X simultanément.",
"Tu dois réussir à faire applaudir X.",
"Tu dois faire toucher le nez de X avec son doigt.",
"Tu dois faire répéter à X la phrase « je ne sais pas » 2 fois.",
"Tu dois faire lever X puis t’asseoir à sa place.",
"Tu dois applaudir une personne au hasard après chacune de ses phrases pendant 1 minute.",
"Il faut que tu boives 3 gorgées en tenant ton verre avec les deux mains.",
"Tu dois faire semblant de découvrir ton repas pour la première fois à chaque bouchée pendant 1 minute.",
"Tu dois taper fortement la table exactement 5 fois à des moments différents.",
"Tu dois essayer de faire répéter un mot compliqué à X 2 fois.",
"Tu dois lever ton verre vers X 4 fois.",
"Pendant 1 minute, tu dois regarder ton assiette intensément sans parler.",
"Pendant 2 minutes, tu dois hocher la tête exagérément quand quelqu’un parle.",
"Tu es obligé de lever ton verre comme pour un toast puis ne rien dire pendant 5 secondes.",
"Pendant 1 minute, tu dois parler en chuchotant même si on te répond normalement.",
"Il faut que tu demandes à quelqu’un de goûter ton plat et lui demander de toujours le décrire plus.",
"Tu es obligé de taper deux fois sur la table avant chaque phrase pendant 1 minute.",
"Pendant 2 minutes, tu dois sourire de façon trop intense sans raison.",
"Tu doit complimenter X excessivement pendant 1 minute (Vraiment beaucoup).",
"Tu as pour objectif de faire répéter un mot par toute la table.",
"Essaie de convaincre quelqu’un que son verre n’est pas le sien.",
"Demande l’avis de tout le monde sur un sujet complètement inutile.",
"Fais semblant que ta chaise est inconfortable et ajuste-la au moins 5 fois.",
"Regarde quelqu’un intensément jusqu’à ce qu’il te demande pourquoi.",
"Fais semblant d’avoir oublié comment utiliser une fourchette pendant 1 minute.",
"Applaudis discrètement quand quelqu’un termine une phrase (3 fois).",
"Essaie de faire rire X sans parler.",
"Fais croire que tu connais une anecdote embarrassante sur X mais refuse de la raconter.",
"Demande à quelqu’un de te passer un objet puis change d’idée immédiatement (3 fois).",
"Fais semblant de chercher quelque chose dans tes poches pendant 30 secondes.",
"Agis comme si ton repas était extrêmement épicé pendant 1 minute.",
"Fais un commentaire philosophique sur la nourriture pendant 30 secondes.",
"Demande à quelqu’un s’il se souvient d’un événement qui n’a jamais existé.",
"Essaie de faire dire ton prénom à X sans le demander directement.",
"Fais croire que tu connais une blague incroyable, raconte la, mais fais croire que tu a oublié la fin.",
"Essaie de faire hocher la tête à X trois fois.",
"Fais lever quelqu’un de sa chaise puis rassois-le.",
"Fais en sorte que quelqu’un te passe un objet 4 fois. (le même)",
"Donne un « High Five » à 4 moments différents.",
"Réussis à faire lever les bras de quelqu’un 5 secondes.",
"Fais faire un thumbs up à 3 joueurs.",
"Fais asseoir quelqu’un plus proche de toi.",
"Fais passer un objet sous la table à quelqu’un.",
"Échanger ta chaise avec celle de X.",
"Faire un mini-check avec X (toucher la main) et le rompre immédiatement. (2 fois)",
"Fais semblant de te tromper de verre et bois dans celui d’un autre joueur.",
"Fais semblant de trébucher en te levant de ta chaise.",
"Tapote sur la table comme si tu faisais un rythme, pendant 10 secondes.",
"Fais une mini danse en te levant de ta chaise.",
"Échange les assiettes de deux joueurs discrètement.",
"Fais semblant de t’endormir 10 secondes sur la table.",
"Fais semblant de voler un morceau de nourriture à Y.",
];

const FALLBACK_MISSIONS_POOL: string[] = RAW_FALLBACK_MISSIONS_POOL.map((mission) =>
  mission.replace(/,\s*$/, ".")
);

const EFFECTIVE_MISSIONS_POOL = MISSIONS_POOL.length > 0 ? MISSIONS_POOL : FALLBACK_MISSIONS_POOL;

const RANDOM_M_WORDS: readonly string[] = [
  "Parallélépipède",
  "Piraterie",
  "Sempiternel",
  "Catastrophe",
  "Théoriquement",
  "Techniquement",
  "Officiellement",
  "Paradoxalement",
  "Horloge",
  "Banquise",
  "Trombone",
  "Kangourou",
  "Parapluie",
  "Spaghetti",
  "Ambiance",
  "Hasard",
  "Bizarre",
  "Courage",
  "Galère",
  "Souvenir",
  "Réussite",
  "Erreur",
  "Stress",
  "Confiance",
  "Secret",
  "Rumeur",
  "Courageux",
  "Chanceux",
  "Honte",
  "Fierté",
  "Panique",
  "Routine",
  "Habitude",
  "Surprise",
  "Doute",
  "Espoir",
  "Regret",
  "Colère",
  "Fatigue",
  "Énergie",
  "Patience",
  "Respect",
  "Talent",
  "Passion",
  "Motivation",
  "Décision",
  "Opinion",
  "Argument",
  "Solution",
  "Problème",
  "Situation",
  "Réaction",
  "Impression",
  "Intention",
  "Expérience",
  "Exemple",
  "Résultat",
  "Conséquence",
  "Possibilité",
  "Occasion",
  "Limite",
  "Risque",
  "Danger",
  "Aventure",
  "Mystère",
  "Rencontre",
  "Relation",
  "Influence",
  "Inspiration",
  "Créativité",
  "Concentration",
  "Organisation",
  "Prétexte",
  "Détail",
  "Résumé",
  "Conclusion",
  "Début",
  "Fin",
  "Milieu",
  "Direction",
  "Destination",
  "Parcours",
  "Chemin",
  "Étape",
  "Niveau",
  "Objectif",
  "Priorité",
  "Choix",
  "Alternative",
  "Discussion",
  "Explication",
  "Justification",
  "Description",
  "Observation",
  "Analyse",
  "Comparaison",
];

const RANDOM_P_PHRASES: readonly string[] = [
  "La chance tourne vite",
  "Faut tenter le coup",
  "Rien n’arrive pour rien",
  "On verra bien",
  "C’est pas si simple",
  "J’ai un mauvais pressentiment",
  "Ça me dit quelque chose",
  "Prends ton temps",
  "Fais attention à toi",
  "Ça vaut la peine d’essayer",
  "On apprend de ses erreurs",
  "C’était prévisible",
  "Tout peut arriver",
  "Faut garder espoir",
  "C’est mieux que rien",
  "On n’a rien à perdre",
  "Ça part mal",
  "Ça peut marcher",
  "J’y crois moyen",
  "On s’en reparle plus tard",
  "C’est une longue histoire",
  "Ça dépend comment tu vois ça",
  "Faut rester calme",
  "Ça va passer",
  "J’ai besoin de réfléchir",
  "C’est plus compliqué que ça",
  "On improvise",
  "Fais comme tu le sens",
  "Ça me semble louche",
  "On fait avec ce qu’on a",
  "C’est déjà ça",
  "Ça pourrait être pire",
  "Je comprends ton point",
  "C’est une bonne question",
  "On va trouver une solution",
  "Rien n’est garanti",
  "C’est un détail important",
  "On avance tranquillement",
  "Faut pas lâcher",
  "C’est une autre façon de voir les choses",
  "On verra demain",
  "Ça change tout",
  "J’ai un doute",
  "C’est surprenant quand même",
  "On va s’arranger",
  "Ça prend de la patience",
  "C’est un bon début",
  "On s’adapte",
  "C’est le moment ou jamais",
  "On garde ça entre nous",
];

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickUniqueMWord(usedInRoom: Set<string>, usedInMission: Set<string>): string {
  const availableRoomUnique = RANDOM_M_WORDS.filter(
    (word) => !usedInRoom.has(word) && !usedInMission.has(word)
  );
  if (availableRoomUnique.length > 0) {
    return pickRandom(availableRoomUnique);
  }

  const availableMissionUnique = RANDOM_M_WORDS.filter((word) => !usedInMission.has(word));
  if (availableMissionUnique.length > 0) {
    return pickRandom(availableMissionUnique);
  }

  return pickRandom(RANDOM_M_WORDS);
}

export type MissionStatus = "active" | "completed" | "busted" | "skipped";

export interface Mission {
  id: string;
  description: string;
  status: MissionStatus;
  startedAt?: number;
  bustedBy?: string;
}

export interface GameRoom {
  id: string;
  host: string;
  players: string[];
  // map of playerId -> playerName to allow cross-tab display of names
  playerNames?: Record<string, string>;
  missions: Record<string, Mission[]>;
  missionIndex: Record<string, number>;
  usedMWords?: string[];
  scores: Record<string, number>;
  gameStarted: boolean;
  gameEnded: boolean;
  createdAt?: number; // Timestamp de création pour l'expiration après 30 min
}

interface DinerExtremeProps {
  players: Player[];
  onBack: () => void;
}

const ROOM_EXPIRATION_MS = 30 * 60 * 1000;
const DISMISSED_RESUME_CODES_KEY = "diner_resume_dismissed_codes";

function isRoomExpired(room: GameRoom) {
  const createdAt = room.createdAt;
  if (!createdAt) return false;
  return Date.now() - createdAt > ROOM_EXPIRATION_MS;
}

export function DinerExtreme({ players, onBack }: DinerExtremeProps) {
  const [gameState, setGameState] = useState<"setup" | "lobby" | "playing" | "results">("setup");
  const [roomCode, setRoomCode] = useState<string>("");
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [gameData, setGameData] = useState<GameRoom | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; action: () => void } | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [showResumeGame, setShowResumeGame] = useState(false);
  const [resumeGameData, setResumeGameData] = useState<{ code: string; room: GameRoom } | null>(null);

  const getDismissedResumeCodes = () => {
    try {
      const raw = sessionStorage.getItem(DISMISSED_RESUME_CODES_KEY);
      if (!raw) return new Set<string>();
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return new Set<string>();
      return new Set(parsed.filter((value): value is string => typeof value === "string"));
    } catch {
      return new Set<string>();
    }
  };

  const setDismissedResumeCodes = (codes: Set<string>) => {
    sessionStorage.setItem(DISMISSED_RESUME_CODES_KEY, JSON.stringify(Array.from(codes)));
  };

  // Dériver l'ID de l'hôte depuis gameData plutôt que de le stocker séparément
  const hostId = gameData?.host || "";

  // Assure que currentPlayer est toujours valide
  const currentPlayer = myPlayerId 
    ? players.find(p => p.id === myPlayerId) ?? players[0]
    : players[currentPlayerIndex] ?? players[0];

  const getNextMission = (playerId: string, gameData: GameRoom | null) => {
    const pool = EFFECTIVE_MISSIONS_POOL;
    if (!gameData) {
      if (pool.length === 0) return "Tu dois faire un signe de tête sérieux, puis reprendre.";
      let mission = pool[Math.floor(Math.random() * pool.length)];

      if (/\bM\b/.test(mission)) {
        const usedInMission = new Set<string>();
        mission = mission.replace(/\bM\b/g, () => {
          const word = pickUniqueMWord(new Set(), usedInMission);
          usedInMission.add(word);
          return word;
        });
      }

      if (/\bP\b/.test(mission)) {
        const phrase = pickRandom(RANDOM_P_PHRASES);
        mission = mission.replace(/\bP\b/g, phrase);
      }

      return mission;
    }

    const otherPlayerIds = gameData.players.filter((id) => id !== playerId);
    const getPlayerNameById = (id: string) => gameData.playerNames?.[id] || `Joueur ${id}`;
    const usedMWordsInRoom = new Set(gameData.usedMWords || []);

    // Collect all missions currently in use by other players
    const usedMissions = new Set<string>();
    for (const pid in gameData.missions) {
      if (pid !== playerId) {
        gameData.missions[pid].forEach(m => {
          if (m.status === "active" || m.status === "completed") {
            usedMissions.add(m.description);
          }
        });
      }
    }

    // Collect all missions already had by this player (any status)
    const playerMissionHistory = new Set<string>();
    if (gameData.missions[playerId]) {
      gameData.missions[playerId].forEach(m => {
        playerMissionHistory.add(m.description);
      });
    }

    // Combine both sets (missions used by others + missions already had by this player)
    usedMissions.forEach(m => playerMissionHistory.add(m));

    // Find an available mission
    // Si une mission utilise X et Y, il faut 2 joueurs distincts (différents du receveur)
    let availableMissions = pool
      .filter((m) => !playerMissionHistory.has(m))
      .filter((m) => {
        const needsX = /\bX\b/.test(m);
        const needsY = /\bY\b/.test(m);
        if (needsX && needsY) return otherPlayerIds.length >= 2;
        if (needsY) return otherPlayerIds.length >= 1;
        if (needsX) return otherPlayerIds.length >= 1;
        return true;
      });
    
    // If all missions are used, allow any mission
    if (availableMissions.length === 0) {
      availableMissions = pool;
    }

    const selectedMission = availableMissions[Math.floor(Math.random() * availableMissions.length)];

    if (!selectedMission) {
      return "Tu dois aligner tes couverts bien droit pendant 3 secondes.";
    }
    
    const needsX = /\bX\b/.test(selectedMission);
    const needsY = /\bY\b/.test(selectedMission);
    const needsM = /\bM\b/.test(selectedMission);
    const needsP = /\bP\b/.test(selectedMission);

    const pickOtherId = (exclude: Set<string>) => {
      const candidates = otherPlayerIds.filter((id) => !exclude.has(id));
      if (candidates.length === 0) return null;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    let result = selectedMission;
    let xId: string | null = null;
    let yId: string | null = null;

    if (needsX && otherPlayerIds.length > 0) {
      xId = pickOtherId(new Set());
      if (xId) {
        result = result.replace(/\bX\b/g, getPlayerNameById(xId));
      }
    }

    if (needsY && otherPlayerIds.length > 0) {
      const exclude = new Set<string>();
      if (xId) exclude.add(xId);
      yId = pickOtherId(exclude);

      // Si on ne peut pas trouver un Y distinct (ex: seulement 2 joueurs), on garde la mission telle quelle
      // (et grâce au filtre plus haut, les missions X+Y n'apparaissent pas sans 3 joueurs au total).
      if (yId) {
        result = result.replace(/\bY\b/g, getPlayerNameById(yId));
      }
    }

    if (needsM) {
      const usedInMission = new Set<string>();
      result = result.replace(/\bM\b/g, () => {
        const word = pickUniqueMWord(usedMWordsInRoom, usedInMission);
        usedInMission.add(word);
        usedMWordsInRoom.add(word);
        return word;
      });
      gameData.usedMWords = Array.from(usedMWordsInRoom);
    }

    if (needsP) {
      const phrase = pickRandom(RANDOM_P_PHRASES);
      result = result.replace(/\bP\b/g, phrase);
    }

    return result;
  };

  // Détecter une partie en cours au montage du composant
  useEffect(() => {
    const dismissedCodes = getDismissedResumeCodes();

    // Chercher toutes les lobbies en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("diner_room_")) {
        const roomData = localStorage.getItem(key);
        if (roomData) {
          try {
            const room = JSON.parse(roomData) as GameRoom;

            // Nettoyer les lobbies terminées ou expirées
            if (room.gameEnded || isRoomExpired(room)) {
              localStorage.removeItem(key);
              continue;
            }

            // Chercher si le joueur actuel (avec son name) est dans cette partie
            const currentName = players[currentPlayerIndex]?.name;
            const playerId = Object.entries(room.playerNames || {}).find(
              ([_, name]) => name === currentName
            )?.[0];
            
            // Si le joueur est trouvé ET la partie est en cours (gameStarted mais pas gameEnded)
            if (playerId && room.gameStarted && !room.gameEnded && room.players.includes(playerId)) {
              const code = key.replace("diner_room_", "");

              // L'utilisateur a déjà refusé de reprendre cette partie dans cette session
              if (dismissedCodes.has(code)) {
                continue;
              }

              setResumeGameData({ code, room });
              setShowResumeGame(true);
              return; // Arrêter après avoir trouvé la première partie
            }
          } catch {}
        }
      }
    }
  }, [currentPlayerIndex, players]);

  // Synchroniser les données du localStorage en temps réel
  useEffect(() => {
    if (!roomCode) return;
    const sync = () => {
      const roomData = localStorage.getItem(`diner_room_${roomCode}`);
      if (roomData) {
        try {
            const parsed = JSON.parse(roomData);

            if (parsed.gameEnded || isRoomExpired(parsed)) {
              localStorage.removeItem(`diner_room_${roomCode}`);
              return;
            }

            setGameData(parsed);
            // Keep UI state in sync with room public flags
            // Check gameEnded FIRST, then gameStarted
            if (parsed.gameEnded) {
              setGameState("results");
            } else if (parsed.gameStarted) {
              setGameState("playing");
            } else if (!parsed.gameStarted && !parsed.gameEnded) {
              setGameState("lobby");
            }
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    const interval = setInterval(sync, 500);
    return () => {
      window.removeEventListener("storage", sync);
      clearInterval(interval);
    };
  }, [roomCode]);

  // Créer une lobby
  const createLobby = () => {
    if (!currentPlayer) {
      toast.error("Aucun joueur sélectionné!");
      return;
    }

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newRoom: GameRoom = {
      id: code,
      host: currentPlayer.id,
      players: [currentPlayer.id],
      playerNames: {
        [currentPlayer.id]: currentPlayer.name,
      },
      missions: {},
      missionIndex: {},
      usedMWords: [],
      scores: Object.fromEntries([[currentPlayer.id, 0]]),
      gameStarted: false,
      gameEnded: false,
      createdAt: Date.now(), // Timestamp de création pour l'expiration
    };

    // Générer la première mission pour le joueur
    newRoom.missions[currentPlayer.id] = [{
      id: `${currentPlayer.id}-0`,
      description: getNextMission(currentPlayer.id, newRoom),
      status: "active",
      startedAt: undefined, // Sera défini au démarrage du jeu
    }];
    newRoom.missionIndex[currentPlayer.id] = 0;
    newRoom.scores[currentPlayer.id] = 0;

    setRoomCode(code);
    setMyPlayerId(currentPlayer.id);
    setGameData(newRoom);
    setGameState("lobby");

    localStorage.setItem(`diner_room_${code}`, JSON.stringify(newRoom));
    toast.success(`Lobby créée! Code: ${code}`);
  };

  // Rejoindre une lobby
  const joinLobby = () => {
    if (!currentPlayer) {
      toast.error("Aucun joueur sélectionné!");
      return;
    }

    if (joinCode.length !== 6) {
      toast.error("Code invalide (6 caractères)!");
      return;
    }

    const roomData = localStorage.getItem(`diner_room_${joinCode}`);
    if (!roomData) {
      toast.error("Code invalide ou expiré!");
      return;
    }

    const room = JSON.parse(roomData) as GameRoom;
    room.usedMWords = room.usedMWords || [];
    
    // Si la partie est terminée, impossible de rejoindre
    if (room.gameEnded) {
      toast.error("Cette partie est terminée!");
      return;
    }
    
    // Vérifier l'expiration après 30 minutes
    const createdAt = room.createdAt || Date.now();
    const now = Date.now();
    const thirtyMinutesMs = 30 * 60 * 1000;
    if (now - createdAt > thirtyMinutesMs) {
      localStorage.removeItem(`diner_room_${joinCode}`);
      toast.error("Cette lobby a expiré!");
      return;
    }

    room.playerNames = room.playerNames || {};
    if (!room.players.includes(currentPlayer.id)) {
      room.playerNames[currentPlayer.id] = currentPlayer.name;
      room.players.push(currentPlayer.id);
      room.missions[currentPlayer.id] = [{
        id: `${currentPlayer.id}-0`,
        description: getNextMission(currentPlayer.id, room),
        status: "active",
        startedAt: undefined, // Sera défini au démarrage du jeu
      }];
      room.missionIndex[currentPlayer.id] = 0;
      room.scores[currentPlayer.id] = 0;
    }

    setRoomCode(joinCode);
    setMyPlayerId(currentPlayer.id);
    setGameData(room);
    setGameState("lobby");
    localStorage.setItem(`diner_room_${joinCode}`, JSON.stringify(room));
    toast.success("Rejoint!");
  };

  // Lancer la partie
  const startGame = () => {
    if (!gameData) return;
    if (gameData.players.length < 3) {
      toast.error("Il faut au moins 3 joueurs pour lancer la partie.");
      return;
    }

    const updated = { ...gameData, gameStarted: true };
    // Initialiser startedAt pour toutes les missions actives
    for (const playerId in updated.missions) {
      updated.missions[playerId].forEach(mission => {
        if (mission.status === "active" && !mission.startedAt) {
          mission.startedAt = Date.now();
        }
      });
    }
    setGameData(updated);
    localStorage.setItem(`diner_room_${roomCode}`, JSON.stringify(updated));
    setGameState("playing");
  };

  // Copier le code
  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Code copié!");
  };

  // Mettre à jour une mission
  const updateMission = (playerId: string, missionId: string, status: MissionStatus, bustedBy?: string) => {
    if (!gameData) return;

    const updated = { ...gameData };
    const mission = updated.missions[playerId]?.find(m => m.id === missionId);
    if (mission) {
      if (bustedBy) {
        // Mission crâmée: enlever le point au joueur cramé, donner au joueur qui crâme
        const wasCompleted = mission.status === "completed";
        mission.status = "busted";
        mission.bustedBy = bustedBy;
        
        // Si la mission était "completed", enlever 1 point
        if (wasCompleted) {
          updated.scores[playerId] = Math.max(0, (updated.scores[playerId] || 0) - 1);
        }
        // Donner 1 point au joueur qui crâme
        updated.scores[bustedBy] = (updated.scores[bustedBy] || 0) + 1;
      } else {
        mission.status = status;
        if (status === "completed") {
          updated.scores[playerId] = (updated.scores[playerId] || 0) + 1;
        }
      }

      // Générer une nouvelle mission si la mission est terminée
      if (status === "completed" || status === "skipped" || status === "busted") {
        const nextIndex = (updated.missionIndex[playerId] || 0) + 1;
        updated.missionIndex[playerId] = nextIndex;
        updated.missions[playerId].push({
          id: `${playerId}-${nextIndex}`,
          description: getNextMission(playerId, updated),
          status: "active",
          startedAt: Date.now(),
        });
      }
    }

    setGameData(updated);
    localStorage.setItem(`diner_room_${roomCode}`, JSON.stringify(updated));
  };

  // Finaliser la partie
  const endGame = () => {
    if (!gameData) return;

    const updated = { ...gameData, gameEnded: true };
    setGameData(updated);
    localStorage.setItem(`diner_room_${roomCode}`, JSON.stringify(updated));
    setGameState("results");
  };

  // Continuer une partie existante
  const handleResumeGame = () => {
    if (resumeGameData) {
      const { code, room } = resumeGameData;
      const playerId = Object.entries(room.playerNames || {}).find(
        ([_, name]) => name === currentPlayer.name
      )?.[0];
      
      if (playerId) {
        const dismissedCodes = getDismissedResumeCodes();
        dismissedCodes.delete(code);
        setDismissedResumeCodes(dismissedCodes);
        setRoomCode(code);
        setMyPlayerId(playerId);
        setGameData(room);
        setGameState("playing");
        setShowResumeGame(false);
        setResumeGameData(null);
      }
    }
  };

  // Abandonner la partie reprise
  const handleDontResumeGame = () => {
    if (resumeGameData) {
      const dismissedCodes = getDismissedResumeCodes();
      dismissedCodes.add(resumeGameData.code);
      setDismissedResumeCodes(dismissedCodes);
    }
    setShowResumeGame(false);
    setResumeGameData(null);
  };

  // Quitter la partie et retirer le joueur de la liste
  const handleQuitGame = () => {
    if (gameData && myPlayerId) {
      const updated = { ...gameData };
      // Retirer le joueur de la liste
      updated.players = updated.players.filter(id => id !== myPlayerId);
      // Si le joueur était l'hôte, choisir un nouvel hôte
      if (updated.host === myPlayerId && updated.players.length > 0) {
        updated.host = updated.players[0];
      }
      
      // Si la lobby est vide, la supprimer du localStorage
      if (updated.players.length === 0) {
        localStorage.removeItem(`diner_room_${roomCode}`);
      } else {
        // Sinon, sauvegarder les changements
        localStorage.setItem(`diner_room_${roomCode}`, JSON.stringify(updated));
      }
    }
    onBack();
  };

  // Fonction pour confirmer une action
  const confirmThenAction = (title: string, action: () => void) => {
    setConfirmAction({ title, action });
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen">
      {/* Modal de reprise de partie */}
      <AnimatePresence>
        {showResumeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 max-w-sm text-white"
            >
              <h3 className="text-2xl font-black mb-4">🎮 Partie en cours</h3>
              <p className="text-orange-100 mb-6">Voulez-vous continuer la partie?</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResumeGame}
                  className="flex-1 py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600 transition"
                >
                  ✅ Oui
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDontResumeGame}
                  className="flex-1 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  ❌ Non
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {gameState === "setup" && (
          <SetupScreen
            key="setup"
            currentPlayer={currentPlayer}
            joinCode={joinCode}
            setJoinCode={setJoinCode}
            onCreateLobby={createLobby}
            onJoinCode={joinLobby}
            onBack={onBack}
          />
        )}

        {gameState === "lobby" && gameData && (
          <LobbyScreen
            key="lobby"
            room={gameData}
            roomCode={roomCode}
            players={players}
            myPlayerId={myPlayerId}
            isHost={hostId === currentPlayer.id}
            onStart={startGame}
            onCopyCode={copyCode}
            onBack={() => confirmThenAction("Quitter le lobby?", handleQuitGame)}
          />
        )}

        {gameState === "playing" && gameData && (
          <GameScreen
            key="playing"
            room={gameData}
            currentPlayer={currentPlayer}
            players={players}
            onUpdateMission={updateMission}
            onEndGame={endGame}
            isHost={hostId === currentPlayer.id}
            onBack={() => confirmThenAction("Quitter la partie?", handleQuitGame)}
          />
        )}

        {gameState === "results" && gameData && (
          <ResultsScreen
            key="results"
            room={gameData}
            currentPlayerId={currentPlayer.id}
            onBack={onBack}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 max-w-sm text-white"
            >
              <h3 className="text-xl font-bold mb-4">{confirmAction?.title}</h3>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    confirmAction?.action();
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600 transition"
                >
                  Oui
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 bg-orange-700 rounded-lg font-bold hover:bg-orange-800 transition"
                >
                  Non
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Écran de setup
function SetupScreen({ currentPlayer, joinCode, setJoinCode, onCreateLobby, onJoinCode, onBack }: any) {
  const [showRules, setShowRules] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-24 left-4 p-2 bg-orange-700/50 rounded-lg hover:bg-orange-700 transition"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowRules(true)}
        className="absolute top-24 right-4 px-3 py-2 bg-orange-700/50 rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
      >
        <AlertCircle size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">RÈGLES</span>
      </motion.button>

      <div className="text-center space-y-8 max-w-sm">
        <h1 className="text-5xl font-black tracking-tight">
          🍽️ DÎNER DE L'EXTRÊME
        </h1>
        <p className="text-xl text-orange-100">
          Bienvenue {currentPlayer?.name}!
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateLobby}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition"
          >
            Créer une Lobby
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-orange-400" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0f172a] text-orange-300">ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Code de lobby (6 caractères)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full px-4 py-3 bg-orange-700/50 border border-orange-500 rounded-lg text-white placeholder-orange-300 text-center tracking-widest font-bold"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onJoinCode}
              disabled={joinCode.length !== 6}
              className="w-full py-3 bg-orange-500 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Rejoindre
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gradient-to-br from-orange-900 to-red-900 border border-orange-500/60 w-full max-w-md p-6 rounded-3xl max-h-[80vh] overflow-y-auto shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-wide">🍽️ RÈGLES</h3>
                <button onClick={() => setShowRules(false)} className="p-2 text-orange-200 hover:text-white">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>

              <div className="space-y-4 text-orange-100 text-sm leading-relaxed">
                <div>
                  <p className="font-bold text-white">🎭 But du jeu</p>
                  <p>
                    Le jeu se déroule pendant un dîner ou un souper. Chaque joueur reçoit des missions secrètes à accomplir discrètement tout en mangeant et discutant normalement. Au milieu de la table, un buzzer ou n’importe quel objet peut servir pour signaler quand quelqu’un croit deviner la mission d’un autre. L’objectif est de réussir tes missions sans te faire attraper, tout en observant les autres, en interagissant et en profitant du repas. Les missions sont courtes, amusantes et parfois étranges, ce qui rend le repas encore plus vivant et imprévisible.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-white">🧩 Comment ça marche</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Chaque joueur reçoit une mission secrète à la fois.</li>
                    <li>Les missions doivent être accomplies discrètement, mais sont observables : les autres peuvent buzzer si elles pensent deviner ta mission.</li>
                    <li>Une fois la mission accomplie, tu reçois une nouvelle mission.</li>
                    <li>Tu peux skipper une mission si tu ne peux pas la réussir après 3 minutes, mais tu ne peux pas revenir dessus.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-white">🔄 Déroulement</p>
                  <ul className="pl-5 space-y-2">
                  <li>Distribution des missions : chaque joueur reçoit sa première mission secrète en cachette.</li>
                  <li>Accomplissement des missions : tu appuis sur Mission Réussie lorsque tu as accompli ta mission.</li>
                  <li>Buzzer et deviner : si un joueur pense avoir découvert la mission d’un autre, il peut buzzer et proposer sa réponse.</li>
                  <li>Si c’est correct : le joueur devineur gagne un point, et le joueur qui faisait la mission ne marque pas pour cette mission.</li>
                  <li>Si c’est incorrect : aucun point n’est donné, et la mission continue.</li>
                  <li>Nouvelle mission : après avoir réussi ou skippé une mission, le joueur reçoit la suivante.</li>
                  <li>Fin de la partie : à la fin du repas, le nombre de points est compté.</li>
                  <li>Le joueur avec le plus de points gagne.</li>
                </ul>
              </div>

                <div>
                  <p className="font-bold text-white">📝 Conseils</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Reste naturel, les missions sont cramables si tu n’es pas attentif.</li>
                    <li>Observe les autres pour détecter leurs missions et buzzer au bon moment.</li>
                    <li>Les missions sont courtes et peuvent impliquer un geste, un objet ou une interaction sociale.</li>
                    <li>Le fun et le chaos sont la priorité : l’important est de jouer le jeu et de rigoler !</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Écran de lobby
function LobbyScreen({ room, roomCode, players, myPlayerId, isHost, onStart, onCopyCode, onBack }: any) {
  const canStart = room.players.length >= 3;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-24 left-4 p-2 bg-orange-700/50 rounded-lg hover:bg-orange-700 transition"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black">En attente...</h2>
          <p className="text-orange-100">Partage ce code</p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={onCopyCode}
          className="bg-orange-700/50 border-2 border-orange-500 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-700 transition flex items-center justify-between"
        >
          <p className="text-4xl font-black tracking-widest flex-1">{roomCode}</p>
          <Copy size={24} className="text-orange-200" />
        </motion.div>

        <div className="space-y-3">
          <p className="text-sm text-orange-200">Joueurs connectés ({room.players.length})</p>
          <div className="space-y-2">
            {room.players.map((playerId: string) => {
              const player = players.find((p: Player) => p.id === playerId);
              const name = room.playerNames?.[playerId] || player?.name || `Joueur ${playerId}`;
              const isSelf = playerId === myPlayerId;
              const isHostPlayer = playerId === room.host;
              return (
                <div
                  key={playerId}
                  className={`border rounded-lg p-3 flex items-center justify-between ${
                    isSelf
                      ? "bg-blue-700/50 border-blue-400"
                      : "bg-orange-700/30 border-orange-500"
                  }`}
                >
                  <span className="font-semibold">
                    {name}
                    {isSelf && " (Vous)"}
                    {isHostPlayer && " 👑"}
                  </span>
                  <Check size={20} className="text-green-400" />
                </div>
              );
            })}
          </div>
        </div>

        {isHost && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            disabled={!canStart}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              canStart
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                : "bg-orange-900/40 text-orange-200 cursor-not-allowed"
            }`}
          >
            Lancer la Partie 🚀
          </motion.button>
        )}

        {isHost && !canStart && (
          <div className="text-center text-orange-200 text-sm">
            Ajoute un 3e joueur pour lancer la partie.
          </div>
        )}

        {!isHost && (
          <div className="text-center text-orange-200 text-sm">
            En attente du lancement par l'hôte...
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 bg-orange-500 rounded-lg font-bold hover:bg-orange-600 transition"
        >
          Retour au Hub 🏠
        </motion.button>
      </div>
    </motion.div>
  );
}

// Écran de jeu
function GameScreen({ room, currentPlayer, players, onUpdateMission, onEndGame, isHost, onBack }: any) {
  const [showBustWorkflow, setShowBustWorkflow] = useState(false);
  const [selectedMissionForBust, setSelectedMissionForBust] = useState<string | null>(null);
  const [selectedPlayerForBust, setSelectedPlayerForBust] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const playerMissions = room.missions[currentPlayer.id] || [];
  const activeMission = playerMissions.find((m: Mission) => m.status === "active");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const elapsedSeconds = activeMission?.startedAt ? Math.floor((currentTime - activeMission.startedAt) / 1000) : 0;
  const canSkip = elapsedSeconds >= 180; // 3 minutes

  const completeMission = () => {
    if (activeMission) {
      onUpdateMission(currentPlayer.id, activeMission.id, "completed");
    }
  };

  const skipMission = () => {
    if (activeMission && canSkip) {
      onUpdateMission(currentPlayer.id, activeMission.id, "skipped");
    }
  };

  const bustMission = () => {
    if (!selectedMissionForBust || !selectedPlayerForBust) {
      toast.error("Sélectionne une mission et un joueur!");
      return;
    }

    // Vérifier qu'on a bien une mission "completed"
    const playerName = room?.playerNames?.[selectedPlayerForBust] || `Joueur ${selectedPlayerForBust}`;
    const missionToBust = room?.missions[currentPlayer.id]?.find((m: Mission) => m.id === selectedMissionForBust);
    
    if (!missionToBust || missionToBust.status !== "completed") {
      toast.error("La mission n'existe pas ou n'est pas complétée!");
      return;
    }

    onUpdateMission(
      currentPlayer.id,  // Le joueur qui avait la mission
      selectedMissionForBust,
      "busted",
      selectedPlayerForBust  // Le joueur qui a crâmé
    );

    setSelectedMissionForBust(null);
    setSelectedPlayerForBust(null);
    toast.success(`${playerName} t'a crâmé! +1 point pour ${playerName}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white relative"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-24 left-4 p-2 bg-orange-700/50 rounded-lg hover:bg-orange-700 transition"
      >
        <ChevronLeft size={24} />
      </motion.button>

      {isHost && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEndGame}
          className="absolute top-24 right-4 px-4 py-2 bg-red-600 rounded-lg font-bold hover:bg-red-700 transition text-sm"
        >
          🏁 Fin de Partie
        </motion.button>
      )}

      <div className="w-full max-w-sm space-y-6 pt-20">
        <div className="text-center">
          <p className="text-orange-200">Mission actuelle</p>
          <h2 className="text-2xl font-black mt-2">
            {activeMission?.description || "Pas de mission"}
          </h2>
        </div>

        {activeMission && (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={completeMission}
              className="w-full py-4 bg-green-500 rounded-xl font-bold text-lg hover:bg-green-600 transition"
            >
              ✅ Mission Réussie
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={skipMission}
              disabled={!canSkip}
              className={`w-full py-3 rounded-xl font-bold transition ${
                canSkip
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-gray-600 opacity-50 cursor-not-allowed"
              }`}
            >
              ⏭️ Skipper {canSkip ? "" : `(${Math.max(0, 180 - elapsedSeconds)}s)`}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowBustWorkflow(!showBustWorkflow);
                setSelectedMissionForBust(null);
                setSelectedPlayerForBust(null);
              }}
              className="w-full py-3 bg-red-600 rounded-xl font-bold hover:bg-red-700 transition"
            >
              🔥 Mission Crâmée
            </motion.button>
          </div>
        )}

        {showBustWorkflow && (
          <BustWorkflow
            playerMissions={playerMissions}
            players={players}
            room={room}
            currentPlayer={currentPlayer}
            selectedMission={selectedMissionForBust}
            selectedPlayer={selectedPlayerForBust}
            onSelectMission={setSelectedMissionForBust}
            onSelectPlayer={setSelectedPlayerForBust}
            onConfirm={() => {
              bustMission();
              setShowBustWorkflow(false);
              setSelectedMissionForBust(null);
              setSelectedPlayerForBust(null);
            }}
            onCancel={() => {
              setShowBustWorkflow(false);
              setSelectedMissionForBust(null);
              setSelectedPlayerForBust(null);
            }}
          />
        )}

      </div>
    </motion.div>
  );
}

// Workflow de crâmer
function BustWorkflow({
  playerMissions,
  players,
  room,
  currentPlayer,
  selectedMission,
  selectedPlayer,
  onSelectMission,
  onSelectPlayer,
  onConfirm,
  onCancel,
}: any) {
  const [isClosing, setIsClosing] = useState(false);
  const completedMissions = playerMissions.filter((m: Mission) => m.status === "completed");
  // Récupère les autres joueurs de la room et les enrichit avec les noms du playerNames
  const otherPlayerIds = room?.players?.filter((id: string) => id !== currentPlayer.id) || [];
  const otherPlayers = otherPlayerIds.map((playerId: string) => ({
    id: playerId,
    name: room?.playerNames?.[playerId] || players.find((p: Player) => p.id === playerId)?.name || `Joueur ${playerId}`,
  }));

  const canConfirm = selectedMission && selectedPlayer;

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => onConfirm(), 300);
  };

  const handleCancel = () => {
    setIsClosing(true);
    setTimeout(() => onCancel(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: isClosing ? 0.9 : 1, opacity: isClosing ? 0 : 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-orange-900 to-red-900 rounded-2xl p-6 max-w-2xl w-full text-white max-h-[1000px] overflow-hidden flex flex-col relative"
      >
        <h3 className="text-2xl font-black mb-6">🔥 Crâmer une Mission</h3>

        {/* Wrapper pour les deux blocs */}
        <motion.div
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-hidden flex flex-col gap-4"
        >
          {completedMissions.length === 0 ? (
            <p className="text-orange-200 text-sm">Aucune mission réussie à crâmer!</p>
          ) : (
            <>
              {/* Bloc 1 - Sélection de la mission avec scroll individuel */}
              <div className="bg-orange-700/20 border border-orange-500/50 rounded-lg p-4 max-h-[350px] flex flex-col overflow-hidden">
                <p className="text-sm text-orange-200 font-semibold mb-3">Quelle mission a été crâmée?</p>
                <div className="overflow-y-auto flex-1 pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {completedMissions.map((mission: Mission) => (
                      <motion.button
                        key={mission.id}
                        onClick={() => onSelectMission(mission.id)}
                        className={`p-2 rounded-lg text-left text-sm transition ${
                          selectedMission === mission.id
                            ? "bg-orange-600 border-2 border-orange-300"
                            : "bg-orange-700/50 border border-orange-500 hover:bg-orange-700"
                        }`}
                      >
                        {mission.description}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bloc 2 - Sélection du joueur avec scroll individuel */}
              <div className="bg-orange-700/20 border border-orange-500/50 rounded-lg p-4 max-h-[350px] flex flex-col overflow-hidden">
                <p className="text-sm text-orange-200 font-semibold mb-3">Qui t'a crâmé?</p>
                <div className="overflow-y-auto flex-1 pr-2">
                  <div className="grid grid-cols-2 gap-2">
                    {otherPlayers.length > 0 ? (
                      otherPlayers.map((player: any) => (
                        <motion.button
                          key={player.id}
                          onClick={() => onSelectPlayer(player.id)}
                          className={`p-3 rounded-lg text-left font-semibold transition ${
                            selectedPlayer === player.id
                              ? "bg-red-600 border-2 border-red-300"
                              : "bg-orange-700/50 border border-orange-500 hover:bg-orange-700"
                          }`}
                        >
                          {player.name}
                        </motion.button>
                      ))
                    ) : (
                      <p className="text-orange-200 text-sm col-span-2">Aucun autre joueur</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Gradient fade en bas */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-red-900 to-transparent pointer-events-none z-10" />

        {/* Boutons toujours visibles */}
        <div className="space-y-3 pt-6 border-t border-orange-500 mt-6 relative z-20">
          <motion.button
            whileHover={canConfirm ? { scale: 1.05 } : {}}
            whileTap={canConfirm ? { scale: 0.95 } : {}}
            onClick={handleConfirm}
            disabled={!canConfirm || isClosing}
            className={`w-full py-3 rounded-lg font-bold transition ${
              canConfirm
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-600 cursor-not-allowed opacity-50"
            }`}
          >
            ✅ Confirmer
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCancel}
            disabled={isClosing}
            className="w-full py-3 bg-orange-700 rounded-lg font-bold hover:bg-orange-800 transition"
          >
            ❌ Annuler
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Écran de résultats
function ResultsScreen({ room, currentPlayerId, onBack }: any) {
  // Utiliser les joueurs de la room, pas les joueurs locaux
  const roomPlayers = room.players.map((playerId: string) => ({
    id: playerId,
    name: room.playerNames?.[playerId] || `Joueur ${playerId}`,
  }));

  const sortedPlayers = [...roomPlayers].sort(
    (a, b) => (room.scores[b.id] || 0) - (room.scores[a.id] || 0)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return { emoji: "✅", text: "Réussie", color: "bg-green-600" };
      case "skipped":
        return { emoji: "⏭️", text: "Skippée", color: "bg-yellow-600" };
      case "busted":
        return { emoji: "🔥", text: "Cramée", color: "bg-red-600" };
      default:
        return { emoji: "❓", text: "Inconnu", color: "bg-gray-600" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-start p-4 text-white overflow-y-auto"
    >
      <div className="w-full max-w-2xl space-y-6 pt-8">
        <div className="text-center sticky top-0 pb-5">
          <h2 className="text-4xl font-black">🏆 Résultats</h2>
        </div>

        {/* Classement */}
        <div className="space-y-3 bg-orange-700/30 border border-orange-500 rounded-xl p-4">
          <h3 className="text-xl font-bold text-center mb-3">Classement</h3>
          {sortedPlayers.map((player: any, idx: number) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-r from-orange-700 to-red-700 rounded-lg p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</span>
                <span className="font-bold">
                  {player.name}
                  {room.host === player.id && " 👑"}
                </span>
              </div>
              <span className="text-xl font-black">{room.scores[player.id] || 0} pts</span>
            </motion.div>
          ))}
        </div>

        {/* Missions (uniquement celles du joueur courant) */}
        <div className="space-y-4">
          {sortedPlayers
            .filter((player: Player) => player.id === currentPlayerId)
            .map((player: Player) => {
              const missions = (room.missions[player.id] || []).filter(
                (m: Mission) => m.status === "completed" || m.status === "skipped" || m.status === "busted"
              );
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-orange-700/30 border border-orange-500 rounded-xl p-4 space-y-3"
                >
                  <h4 className="text-lg font-bold">Récapitulatif de tes missions :</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {missions.map((mission: Mission) => {
                      const badge = getStatusBadge(mission.status);
                      return (
                        <div
                          key={mission.id}
                          className="bg-orange-800/50 border border-orange-600 rounded-lg p-3 flex gap-3 items-start"
                        >
                          <span className="text-xl">{badge.emoji}</span>
                          <div className="flex-1">
                            <p className="text-sm text-orange-200">{mission.description}</p>
                            <span className={`inline-block text-xs font-bold px-2 py-1 rounded mt-1 ${badge.color}`}>
                              {badge.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-full py-3 bg-orange-500 rounded-lg font-bold hover:bg-orange-600 transition sticky bottom-4"
        >
          Retour au Hub 🏠
        </motion.button>
      </div>
    </motion.div>
  );
}
