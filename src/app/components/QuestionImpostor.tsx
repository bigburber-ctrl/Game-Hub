import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Send, RotateCcw, HelpCircle, Users, Eye } from "lucide-react";

interface QuestionImpostorProps {
  players: Player[];
  config: {
    questionMode: "standard" | "numbers";
    impostorCount?: number;
  };
  enablePhoneVote: boolean;
  onBack: () => void;
}

const NUMBER_QUESTIONS = [
{ question: "Quel est le meilleur âge pour prendre sa retraite ?", range: "Entre 38 et 85" },
{ question: "À partir de quel âge est-on vraiment adulte ?", range: "Entre 10 et 50" },
{ question: "Quel âge est trop vieux pour aller en boîte de nuit ?", range: "Entre 18 et 80" },
{ question: "À quel âge idéal devrait-on quitter chez ses parents ?", range: "Entre 8 et 45" },
{ question: "Quel est l’âge parfait pour avoir son premier enfant ?", range: "Entre 15 et 55" },
{ question: "À quel âge commence-t-on à devenir 'plate' ?", range: "Entre 15 et 70" },
{ question: "Quel est l’âge idéal pour arrêter l’école définitivement ?", range: "Entre 8 et 50" },
{ question: "À partir de quel âge devient-on trop vieux pour jouer aux jeux vidéo ?", range: "Entre 10 et 100" },
{ question: "Quel âge est trop jeune pour avoir une relation sérieuse ?", range: "Entre 5 et 30" },
{ question: "À quel âge devrait-on arrêter de fêter son anniversaire ?", range: "Entre 20 et 120" },
{ question: "Combien d’amis proches est le nombre parfait ?", range: "Entre 0 et 25" },
{ question: "Combien de relations amoureuses sérieuses devrait-on vivre dans une vie ?", range: "Entre 0 et 20" },
{ question: "Combien de fois devrait-on déménager dans une vie ?", range: "Entre 0 et 30" },
{ question: "Combien d’heures par jour est acceptable de passer sur son téléphone ?", range: "Entre 0 et 24" },
{ question: "Combien de voyages importants devrait-on faire dans une vie ?", range: "Entre 0 et 100" },
{ question: "Combien d’emplois différents devrait-on avoir dans une vie ?", range: "Entre 0 et 40" },
{ question: "Combien d’années devrait durer une relation idéale ?", range: "Entre 0 et 100" },
{ question: "Combien d’heures par semaine devrait-on travailler ?", range: "Entre 8 et 70" },
{ question: "Combien de fois est-il acceptable de changer complètement de carrière ?", range: "Entre 0 et 20" },
{ question: "Combien d’heures par jour devrait-on dormir idéalement ?", range: "Entre 2 et 16" },
{ question: "Combien d’enfants représente une famille parfaite ?", range: "Entre 0 et 12" },
{ question: "Combien de jours de vacances devrait-on avoir par année ?", range: "Entre 0 et 120" },
{ question: "Combien de fois par semaine devrait-on sortir voir des amis ?", range: "Entre 0 et 14" },
{ question: "Combien de temps devrait durer un premier rendez-vous ?", range: "Entre 8 et 400" },
{ question: "Combien de fois par mois est-il acceptable de manger du fast-food ?", range: "Entre 0 et 30" },
{ question: "Combien de loisirs différents devrait-on avoir pour être équilibré ?", range: "Entre 0 et 20" },
{ question: "Combien de fois devrait-on changer de style vestimentaire dans sa vie ?", range: "Entre 0 et 30" },
{ question: "Combien de langues devrait-on parler pour être considéré cultivé ?", range: "Entre 0 et 12" },
{ question: "Combien de temps devrait durer un deuil normal ?", range: "Entre 0 et 24" },
{ question: "Combien d’heures par semaine devrait-on consacrer à ses passions ?", range: "Entre 0 et 60" },
{ question: "Combien de fois par année devrait-on voir sa famille élargie ?", range: "Entre 0 et 30" },
{ question: "Combien d’années devrait durer un téléphone avant de le changer ?", range: "Entre 0 et 20" },
{ question: "Combien de repas par semaine devrait-on cuisiner soi-même ?", range: "Entre 0 et 30" },
{ question: "Combien d’heures par semaine est acceptable de regarder des séries ?", range: "Entre 0 et 60" },
{ question: "Combien de fois devrait-on essayer un nouveau hobby dans sa vie ?", range: "Entre 0 et 40" },
{ question: "Combien d’années devrait durer une amitié forte ?", range: "Entre 0 et 100" },
{ question: "Combien de fois devrait-on faire du sport par semaine ?", range: "Entre 0 et 14" },
{ question: "Combien d’heures devrait durer une soirée idéale ?", range: "Entre 0 et 24" },
{ question: "Combien de fois par mois est-il acceptable de commander en ligne ?", range: "Entre 0 et 40" },
{ question: "Combien de fois devrait-on changer de coupe de cheveux dans sa vie ?", range: "Entre 0 et 100" },
{ question: "Combien d’heures par semaine devrait-on passer seul ?", range: "Entre 0 et 100" },
{ question: "Combien de fois devrait-on prendre des risques importants dans sa vie ?", range: "Entre 0 et 30" },
{ question: "Combien de projets personnels devrait-on terminer dans une vie ?", range: "Entre 0 et 100" },
{ question: "Combien de fois est-il acceptable d’annuler des plans à la dernière minute par mois ?", range: "Entre 0 et 20" },
{ question: "Combien de fois devrait-on changer de ville dans sa vie ?", range: "Entre 0 et 20" },
{ question: "Combien d’heures devrait durer une conversation profonde ?", range: "Entre 0 et 24" },
{ question: "Combien de fois par semaine devrait-on appeler ses proches ?", range: "Entre 0 et 30" },
{ question: "Combien de passions peut-on gérer sérieusement en même temps ?", range: "Entre 0 et 20" },
{ question: "Combien de fois devrait-on réinventer sa vie complètement ?", range: "Entre 0 et 20" },
{ question: "Combien de souvenirs importants devrait-on créer par année ?", range: "Entre 0 et 100" },
];

const QUESTION_PAIRS = [
{ q1: "Quel objet tu traînes presque toujours avec toi ?", q2: "Quel objet les gens transportent souvent mais que tu trouves inutile ?" },
{ q1: "Quel moment simple te rend vraiment heureux ?", q2: "Quel moment banal peut ruiner ta journée ?" },
{ q1: "Quel talent te rendrait impressionnant dans un party ?", q2: "Quel talent serait cool mais impossible à utiliser dans la vraie vie ?" },
{ q1: "Quelle activité te fait perdre la notion du temps ?", q2: "Quelle activité te paraît interminable même si elle dure 10 minutes ?" },
{ q1: "Quel endroit te donne instantanément envie de rester longtemps ?", q2: "Quel endroit te donne envie de partir dès que tu arrives ?" },
{ q1: "Quel job d’été t’aurais aimé essayer ?", q2: "Quel job d’été tu refuserais même très bien payé ?" },
{ q1: "Quel bruit te relaxe ?", q2: "Quel bruit te rend fou rapidement ?" },
{ q1: "Quelle habitude d’un ami te fait rire ?", q2: "Quelle habitude d’un ami peut devenir agaçante ?" },
{ q1: "Quel plat tu pourrais manger chaque semaine sans te tanner ?", q2: "Quel plat tu trouves bon mais jamais assez pour le choisir toi-même ?" },
{ q1: "Quel sport serait le plus drôle à regarder avec des amis ?", q2: "Quel sport serait le pire à regarder pendant 2 heures ?" },
{ q1: "Quel moment de l’année te motive le plus ?", q2: "Quel moment de l’année te vide d’énergie ?" },
{ q1: "Quel type de vidéo internet tu peux binge facilement ?", q2: "Quel type de vidéo tu skip presque toujours ?" },
{ q1: "Quelle compétence scolaire devrait être obligatoire ?", q2: "Quelle matière scolaire t’a semblé inutile personnellement ?" },
{ q1: "Quel endroit public te met de bonne humeur ?", q2: "Quel endroit public te met mal à l’aise ?" },
{ q1: "Quel vêtement te fait sentir confiant ?", q2: "Quel vêtement te rend inconfortable même s’il est beau ?" },
{ q1: "Quelle invention récente améliore vraiment la vie ?", q2: "Quelle invention récente complique tout selon toi ?" },
{ q1: "Quel type de fête tu trouves le plus fun ?", q2: "Quel type de fête te fatigue rapidement ?" },
{ q1: "Quel sujet pourrait te garder en discussion pendant des heures ?", q2: "Quel sujet te fait décrocher immédiatement ?" },
{ q1: "Quelle odeur te rappelle un bon souvenir ?", q2: "Quelle odeur te rappelle quelque chose de désagréable ?" },
{ q1: "Quel film ou série tu peux revoir plusieurs fois ?", q2: "Quel film ou série tu as abandonné malgré sa popularité ?" },
{ q1: "Quel animal serait le meilleur compagnon de vie ?", q2: "Quel animal serait impossible à vivre avec ?" },
{ q1: "Quelle activité sociale te recharge ?", q2: "Quelle activité sociale te draine mentalement ?" },
{ q1: "Quel gadget technologique te semble indispensable ?", q2: "Quel gadget technologique te semble exagéré ?" },
{ q1: "Quel petit luxe vaut la peine de payer plus cher ?", q2: "Quel petit luxe ne vaut pas du tout son prix ?" },
{ q1: "Quel repas te rappelle ton enfance ?", q2: "Quel repas te rappelle un mauvais souvenir ?" },
{ q1: "Quel endroit naturel te fascine ?", q2: "Quel endroit naturel te met mal à l’aise ?" },
{ q1: "Quel métier semble passionnant à observer ?", q2: "Quel métier semble stressant juste à imaginer ?" },
{ q1: "Quelle tradition familiale tu trouves cool ?", q2: "Quelle tradition familiale te semble inutile ?" },
{ q1: "Quel jeu tu pourrais jouer pendant des heures ?", q2: "Quel jeu te fait décrocher rapidement ?" },
{ q1: "Quel souvenir d’école te fait rire aujourd’hui ?", q2: "Quel souvenir d’école tu préfèrerais oublier ?" },
{ q1: "Quelle qualité te rend fier ?", q2: "Quel défaut tu trouves difficile à corriger ?" },
{ q1: "Quel type de météo te met de bonne humeur ?", q2: "Quel type de météo te donne envie de rester chez toi ?" },
{ q1: "Quelle ville te semble pleine de vie ?", q2: "Quelle ville te semble trop stressante ?" },
{ q1: "Quel moment de la journée tu préfères ?", q2: "Quel moment de la journée te semble le plus long ?" },
{ q1: "Quel loisir semble relaxant à apprendre ?", q2: "Quel loisir semble frustrant à apprendre ?" },
{ q1: "Quel objet chez quelqu’un attire toujours ton attention ?", q2: "Quel objet chez quelqu’un te semble bizarre ou inutile ?" },
{ q1: "Quelle musique te met de bonne humeur instantanément ?", q2: "Quelle musique te fatigue rapidement ?" },
{ q1: "Quel type de restaurant tu choisis souvent ?", q2: "Quel type de restaurant tu évites ?" },
{ q1: "Quel souvenir de voyage t’a marqué ?", q2: "Quel moment de voyage t’a déçu ?" },
{ q1: "Quel événement futur t’excite ?", q2: "Quel événement futur te stresse ?" },
{ q1: "Quel type de cadeau tu aimes recevoir ?", q2: "Quel type de cadeau tu trouves difficile à apprécier ?" },
{ q1: "Quel réseau social te divertit le plus ?", q2: "Quel réseau social te fatigue mentalement ?" },
{ q1: "Quelle activité d’hiver tu apprécies ?", q2: "Quelle activité d’hiver tu trouves pénible ?" },
{ q1: "Quelle activité d’été tu attends chaque année ?", q2: "Quelle activité d’été tu évites ?" },
{ q1: "Quel endroit calme te ressource ?", q2: "Quel endroit calme te rend mal à l’aise ?" },
{ q1: "Quel type de transport tu trouves agréable ?", q2: "Quel type de transport te rend nerveux ?" },
{ q1: "Quel moment avec des amis reste mémorable ?", q2: "Quel moment social t’a déjà mis mal à l’aise ?" },
{ q1: "Quel jeu de société tu trouves drôle ?", q2: "Quel jeu de société devient trop compétitif selon toi ?" },
{ q1: "Quel défi personnel tu aimerais réussir ?", q2: "Quel défi personnel tu refuses de tenter ?" },
{ q1: "Quel souvenir d’enfance te fait sourire ?", q2: "Quel souvenir d’enfance te semble gênant aujourd’hui ?" },
{ q1: "Quel personnage fictif serait un bon ami ?", q2: "Quel personnage fictif serait insupportable en vrai ?" },
{ q1: "Quel style vestimentaire te plaît ?", q2: "Quel style vestimentaire te surprend négativement ?" },
{ q1: "Quel moment te rend nostalgique ?", q2: "Quel moment te rappelle quelque chose que tu veux oublier ?" },
{ q1: "Quel aliment tu trouves sous-estimé ?", q2: "Quel aliment tu trouves surestimé ?" },
{ q1: "Quel type de conversation te passionne ?", q2: "Quel type de conversation t’ennuie ?" },
{ q1: "Quel endroit pour étudier ou travailler te motive ?", q2: "Quel endroit te déconcentre complètement ?" },
{ q1: "Quelle activité artistique t’attire ?", q2: "Quelle activité artistique te semble incompréhensible ?" },
{ q1: "Quel moment spontané t’a rendu heureux ?", q2: "Quel moment spontané t’a causé du stress ?" },
{ q1: "Quel jeu vidéo te semble immersif ?", q2: "Quel jeu vidéo te semble répétitif ?" },
{ q1: "Quel style d’humour te fait rire ?", q2: "Quel style d’humour te met mal à l’aise ?" },
{ q1: "Quel type de fête familiale tu apprécies ?", q2: "Quel type de fête familiale tu trouves longue ?" },
{ q1: "Quel endroit historique te fascine ?", q2: "Quel endroit historique te laisse indifférent ?" },
{ q1: "Quel objet ancien tu trouves cool ?", q2: "Quel objet ancien te semble dépassé ?" },
{ q1: "Quelle activité matinale te motive ?", q2: "Quelle activité matinale te fatigue ?" },
{ q1: "Quel film t’a déjà inspiré ?", q2: "Quel film t’a laissé confus ?" },
{ q1: "Quel animal te fascine ?", q2: "Quel animal te rend nerveux ?" },
{ q1: "Quel type de voyage te correspond ?", q2: "Quel type de voyage te stresse ?" },
{ q1: "Quel souvenir avec un professeur t’a marqué ?", q2: "Quel souvenir avec un professeur t’a frustré ?" },
{ q1: "Quel jeu d’enfance tu rejouerais ?", q2: "Quel jeu d’enfance semble plate aujourd’hui ?" },
{ q1: "Quel objet décoratif te plaît ?", q2: "Quel objet décoratif te semble inutile ?" },
{ q1: "Quelle activité de groupe te motive ?", q2: "Quelle activité de groupe te fatigue ?" },
{ q1: "Quel endroit pour relaxer est parfait ?", q2: "Quel endroit pour relaxer ne fonctionne pas pour toi ?" },
{ q1: "Quel défi sportif te motive ?", q2: "Quel défi sportif te semble impossible ?" },
{ q1: "Quel moment passé avec ta famille te rend heureux ?", q2: "Quel moment familial peut devenir stressant ?" },
{ q1: "Quel objet technologique futur te ferait rêver ?", q2: "Quel objet technologique futur te ferait peur ?" },
{ q1: "Quel loisir calme te plaît ?", q2: "Quel loisir calme te semble ennuyant ?" },
{ q1: "Quel moment dans un film te captive ?", q2: "Quel moment dans un film te fait décrocher ?" },
{ q1: "Quel talent social tu admires ?", q2: "Quel talent social te met mal à l’aise ?" },
{ q1: "Quel type d’événement public tu apprécies ?", q2: "Quel type d’événement public tu évites ?" },
{ q1: "Quel style de maison te plaît ?", q2: "Quel style de maison te semble inconfortable ?" },
{ q1: "Quel souvenir lié à la nourriture te fait sourire ?", q2: "Quel souvenir lié à la nourriture t’a déçu ?" },
{ q1: "Quel moment imprévu peut être excitant ?", q2: "Quel moment imprévu peut être stressant ?" },
{ q1: "Quel loisir créatif te tente ?", q2: "Quel loisir créatif te semble trop compliqué ?" },
{ q1: "Quel endroit touristique vaut le détour ?", q2: "Quel endroit touristique te semble surcoté ?" },
];


type Step = "answering" | "discussion" | "vote" | "results";

export function QuestionImpostor({ players, config, enablePhoneVote, onBack }: QuestionImpostorProps) {
  const [step, setStep] = useState<Step>("answering");
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [impostorIds, setImpostorIds] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [mainQuestion, setMainQuestion] = useState("");
  const [impostorQuestion, setImpostorQuestion] = useState("");
  const [showQuestion, setShowQuestion] = useState(false);
  const [votesByPlayer, setVotesByPlayer] = useState<Record<string, string[]>>({});
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);
  const [selectedVoteIds, setSelectedVoteIds] = useState<string[]>([]);

  const requiredSelections = Math.min(Math.max(1, config.impostorCount ?? 1), players.length);
  const currentVoter = players[currentVoterIdx];

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
        const aIsImpostor = impostorIds.includes(a.id) ? 1 : 0;
        const bIsImpostor = impostorIds.includes(b.id) ? 1 : 0;
        return bIsImpostor - aIsImpostor;
      });
  }, [votesByPlayer, players, impostorIds]);

  const voteCountById = useMemo(() => {
    return voteResults.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.id] = entry.votes;
      return acc;
    }, {});
  }, [voteResults]);

  const playerOrderById = useMemo(
    () => players.reduce<Record<string, number>>((acc, player, index) => {
      acc[player.id] = index;
      return acc;
    }, {}),
    [players]
  );

  const playersByVoteDesc = useMemo(
    () => [...players].sort((a, b) => {
      const voteDiff = (voteCountById[b.id] ?? 0) - (voteCountById[a.id] ?? 0);
      if (voteDiff !== 0) return voteDiff;
      const aIsImpostor = impostorIds.includes(a.id) ? 1 : 0;
      const bIsImpostor = impostorIds.includes(b.id) ? 1 : 0;
      if (aIsImpostor !== bIsImpostor) return bIsImpostor - aIsImpostor;
      return (playerOrderById[a.id] ?? 0) - (playerOrderById[b.id] ?? 0);
    }),
    [players, voteCountById, playerOrderById, impostorIds]
  );

  const voteGridColsClass = useMemo(() => {
    if (players.length <= 7) return "grid-cols-1";
    return "grid-cols-2";
  }, [players.length]);

  const setupGame = () => {
    if (!players || players.length === 0) return;

    let qMain = "";
    let qImp = "";

    if (config.questionMode === "numbers") {
      const qObj = NUMBER_QUESTIONS[Math.floor(Math.random() * NUMBER_QUESTIONS.length)];
      qMain = qObj.question;
      qImp = qObj.range;
    } else {
      const pair = QUESTION_PAIRS[Math.floor(Math.random() * QUESTION_PAIRS.length)];
      const isQ1Main = Math.random() > 0.5;
      qMain = isQ1Main ? pair.q1 : pair.q2;
      qImp = isQ1Main ? pair.q2 : pair.q1;
    }

    setMainQuestion(qMain);
    setImpostorQuestion(qImp);

    const impostorsTargetCount = Math.min(Math.max(1, config.impostorCount ?? 1), players.length);
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const chosenImpostorIds = shuffled.slice(0, impostorsTargetCount).map((player) => player.id);
    const impostorIdsSet = new Set(chosenImpostorIds);
    setImpostorIds(chosenImpostorIds);

    const qMap: Record<string, string> = {};
    players.forEach(p => {
      qMap[p.id] = impostorIdsSet.has(p.id) ? qImp : qMain;
    });
    setQuestions(qMap);
  };

  // Initialisation
  useEffect(() => {
    setupGame();
  }, [players, config.questionMode, config.impostorCount]);

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = { ...answers, [players[currentPlayerIdx].id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");
    setShowQuestion(false);

    if (currentPlayerIdx < players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
    } else {
      setStep("discussion");
    }
  };

  const restart = () => {
    setStep("answering");
    setCurrentPlayerIdx(0);
    setAnswers({});
    setCurrentAnswer("");
    setShowQuestion(false);
    setVotesByPlayer({});
    setCurrentVoterIdx(0);
    setSelectedVoteIds([]);
    setupGame();
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
        <div className="text-center">
          <h2 className="text-xs font-black text-amber-500 uppercase italic tracking-widest">❓ La Question Différente</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {requiredSelections} {requiredSelections > 1 ? "Imposteurs" : "Imposteur"} parmi vous
          </p>
        </div>
        <div className="w-10"></div>
      </header>

      <AnimatePresence mode="wait">
        {/* Phase réponse directe joueur par joueur */}
        {step === "answering" && (
          <motion.div key="answering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col justify-center gap-8 text-center">
            <div className="space-y-4">
              <p className="text-slate-400 uppercase font-black text-[10px] tracking-widest">C'est au tour de</p>
              <h3 className="text-3xl font-black text-white italic uppercase">{players[currentPlayerIdx]?.name}</h3>
              <p className="text-xs text-slate-500 font-bold uppercase italic tracking-widest">Réponds à ta question secrètement</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-3xl border-2 border-slate-700 space-y-4">
              {!showQuestion ? (
                <button onClick={() => setShowQuestion(true)} className="flex flex-col items-center gap-4 w-full py-6">
                  <div className="p-6 bg-amber-500/20 rounded-full text-amber-400">
                    <Eye size={48} />
                  </div>
                  <p className="font-bold text-amber-400 uppercase tracking-widest text-[10px]">Voir ma question</p>
                </button>
              ) : (
                <div className="space-y-4 animate-in zoom-in duration-300">
                  <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                    {config.questionMode === "numbers" && impostorIds.includes(players[currentPlayerIdx].id)
                      ? "Indice de Fourchette :"
                      : "Ta Question Secrète :"}
                  </p>
                  <p className="text-xl font-black text-white italic uppercase">"{questions[players[currentPlayerIdx].id]}"</p>

                  <input
                    type={config.questionMode === "numbers" ? "number" : "text"}
                    autoFocus
                    placeholder={config.questionMode === "numbers" ? "Ex: 15" : "Ta réponse..."}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-700 p-4 rounded-xl text-white font-bold focus:border-amber-500 outline-none transition-all"
                  />

                  <button
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim()}
                    className="w-full py-4 bg-white text-black font-black uppercase italic rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send size={18} /> Valider
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Discussion / Lecture des réponses */}
        {step === "discussion" && (
          <motion.div key="discussion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-6 pt-4">
            <div className="text-center space-y-2">
              <Users size={48} className="mx-auto text-amber-500 mb-2" />
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Qui est suspect ?</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Relisez les réponses à haute voix</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Question des innocents :</p>
              <div className="bg-slate-800 p-4 rounded-2xl border-2 border-amber-500/30 text-white font-bold italic text-center">
                "{mainQuestion}"
              </div>
            </div>

            <div className="grid gap-2 overflow-y-auto max-h-[40vh] pr-1">
              {players.map(p => (
                <div key={p.id} className="p-4 bg-slate-800 rounded-2xl flex items-center justify-between gap-4 border border-slate-700">
                  <span className="text-[10px] font-black uppercase text-slate-500 italic shrink-0">{p.name}</span>
                  <span className="text-sm font-bold text-white text-right break-words italic">"{answers[p.id]}"</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (enablePhoneVote) {
                  setVotesByPlayer({});
                  setCurrentVoterIdx(0);
                  setSelectedVoteIds([]);
                  setStep("vote");
                  return;
                }
                setStep("results");
              }}
              className="mt-auto w-full py-5 bg-amber-500 text-black font-black uppercase italic rounded-2xl shadow-xl"
            >
              Révéler les rôles
            </button>
          </motion.div>
        )}

        {step === "vote" && (
          <motion.div key="vote" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col gap-4 pt-2">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Vote</h3>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Question des innocents :</p>
              <div className="bg-slate-800 p-4 rounded-2xl border-2 border-amber-500/30 text-white font-bold italic text-center">
                "{mainQuestion}"
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                C'est au tour de voter : {currentVoter?.name}
              </p>
              <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest text-center">
                Sélectionne {requiredSelections} personne{requiredSelections > 1 ? "s" : ""}
              </p>
              <div className={`grid ${voteGridColsClass} gap-1.5`}>
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
                        ? "bg-amber-500/10 border-amber-500/50 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase text-slate-500">{player.name}</p>
                        <p className="text-sm font-bold text-white italic break-words">"{answers[player.id]}"</p>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-1 rounded uppercase italic shrink-0 ${selectedVoteIds.includes(player.id) ? "bg-amber-500 text-black" : "bg-slate-900 text-slate-400"}`}>
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
              className="mt-auto w-full py-3.5 bg-amber-500 text-black font-black uppercase italic rounded-2xl disabled:opacity-50"
            >
              Valider le vote
            </button>
          </motion.div>
        )}

        {/* Résultats finaux */}
        {step === "results" && (
          <motion.div key="results" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex-1 flex flex-col gap-8 pt-4">
            <div className="text-center space-y-4">
              <HelpCircle size={48} className="mx-auto text-amber-500" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions :</p>
                <div className="space-y-1">
                  <p className="text-[13px] font-black text-emerald-500 uppercase tracking-widest text-center">Innocents :</p>
                  <div className="bg-emerald-500/10 p-4 rounded-2xl border-2 border-emerald-500/30 text-white font-bold italic text-center">
                    "{mainQuestion}"
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-black text-red-500 uppercase tracking-widest text-center">
                    {impostorIds.length > 1 ? "Imposteurs :" : "Imposteur :"}
                  </p>
                  <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/30 text-white font-bold italic text-center">
                    "{impostorQuestion}"
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Rôles et réponses :</p>
              <div className="space-y-2">
                {playersByVoteDesc.map((player) => (
                  <div
                    key={player.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                      impostorIds.includes(player.id)
                        ? "bg-red-500/10 border-red-500/50"
                        : "bg-slate-800 border-slate-700"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase text-slate-500">
                        {player.name} - {voteCountById[player.id] ?? 0} vote{(voteCountById[player.id] ?? 0) > 1 ? "s" : ""}
                      </p>
                      <p className="font-bold text-white italic break-words">"{answers[player.id]}"</p>
                    </div>
                    {impostorIds.includes(player.id) ? (
                      <span className="text-[10px] font-black bg-red-500 text-white px-2 py-1 rounded uppercase italic shrink-0">
                        {impostorIds.length > 1 ? "Imposteur" : "L'Imposteur"}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded uppercase italic shrink-0">Innocent</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button onClick={restart} className="w-full py-4 bg-amber-500 text-black font-black uppercase italic rounded-2xl flex items-center justify-center gap-2">
                <RotateCcw size={20} /> Rejouer
              </button>
              <button onClick={onBack} className="w-full py-4 bg-slate-800 text-slate-300 font-black uppercase italic rounded-2xl">
                Menu Principal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
