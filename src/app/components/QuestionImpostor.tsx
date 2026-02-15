import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { ChevronLeft, Send, RotateCcw, HelpCircle, Users } from "lucide-react";

interface QuestionImpostorProps {
  players: Player[];
  config: {
    questionMode: "standard" | "numbers";
  };
  onBack: () => void;
}

const NUMBER_QUESTIONS = [
  { question: "À quel âge as-tu appris à marcher ?", range: "Entre 0 et 20" },
  { question: "Combien d'heures par jour passes-tu sur ton téléphone ?", range: "Entre 0 et 24" },
  { question: "Combien de verres d'eau bois-tu par jour ?", range: "Entre 0 et 15" },
  { question: "Combien de pays as-tu visités ?", range: "Entre 0 et 50" },
  { question: "Combien d'heures dors-tu par nuit ?", range: "Entre 0 et 15" },
  { question: "Combien d'applications as-tu sur ton téléphone ?", range: "Entre 0 et 200" },
  { question: "À quel âge as-tu eu ton premier téléphone ?", range: "Entre 5 et 25" },
  { question: "Combien de minutes dure ta douche en moyenne ?", range: "Entre 0 et 60" },
  { question: "Combien de pas fais-tu par jour ?", range: "Entre 0 et 30000" },
  { question: "Combien de livres as-tu lus l'année dernière ?", range: "Entre 0 et 50" },
  { question: "Combien de fois par semaine manges-tu au restaurant/fast-food ?", range: "Entre 0 et 14" },
  { question: "Combien d'onglets as-tu ouverts sur ton navigateur en ce moment ?", range: "Entre 0 et 100" },
  { question: "Combien de photos as-tu dans ta galerie ?", range: "Entre 0 et 10000" },
  { question: "Combien de kilomètres fais-tu pour aller au travail/école ?", range: "Entre 0 et 100" },
  { question: "Combien de langues parles-tu ?", range: "Entre 1 et 10" },
  { question: "Combien de fois par jour vérifies-tu tes emails ?", range: "Entre 0 et 50" },
  { question: "Combien d'amis proches as-tu ?", range: "Entre 0 et 30" },
  { question: "Combien de paires de chaussures possèdes-tu ?", range: "Entre 0 et 50" },
  { question: "À quelle heure te réveilles-tu en moyenne ?", range: "Entre 0 et 12" },
  { question: "Combien de tasses de café/thé bois-tu par jour ?", range: "Entre 0 et 10" },
  { question: "Combien de messages envoies-tu par jour en moyenne ?", range: "Entre 20 et 300" },
{ question: "Combien de messages ignores-tu par jour en moyenne ?", range: "Entre 0 et 150" },
{ question: "Combien de fois regardes-tu ton téléphone par jour ?", range: "Entre 30 et 250" },
{ question: "Combien d’heures passes-tu sur ton téléphone par jour ?", range: "Entre 1 et 14" },
{ question: "Combien de fois manges-tu par jour ?", range: "Entre 2 et 7" },
{ question: "Combien de collations manges-tu par jour ?", range: "Entre 0 et 5" },
{ question: "Combien de boissons autres que l’eau bois-tu par jour ?", range: "Entre 0 et 8" },
{ question: "Combien de fois ris-tu vraiment par jour ?", range: "Entre 5 et 120" },
{ question: "Combien de fois souris-tu sans rire par jour ?", range: "Entre 10 et 200" },
{ question: "Combien de fois par jour te parles-tu dans ta tête ?", range: "Entre 10 et 300" },
{ question: "Combien de pensées te traversent l’esprit en une journée ?", range: "Entre 200 et 4000" },
{ question: "Combien de fois te laves-tu les mains par jour ?", range: "Entre 3 et 25" },
{ question: "Combien de fois touches-tu ton visage par jour ?", range: "Entre 20 et 150" },
{ question: "Combien de fois vas-tu aux toilettes par jour ?", range: "Entre 2 et 12" },
{ question: "Combien de minutes passes-tu aux toilettes par jour ?", range: "Entre 5 et 90" },
{ question: "Combien de notifications reçois-tu par jour ?", range: "Entre 20 et 350" },
{ question: "Combien de notifications supprimes-tu sans les lire par jour ?", range: "Entre 0 et 250" },
{ question: "Combien de photos prends-tu par semaine ?", range: "Entre 0 et 200" },
{ question: "Combien de photos gardes-tu vraiment par semaine ?", range: "Entre 0 et 120" },
{ question: "Combien de personnes vois-tu en vrai par jour ?", range: "Entre 1 et 25" },
{ question: "Combien de personnes contactes-tu en ligne par jour ?", range: "Entre 5 et 120" },
{ question: "Combien de conversations différentes as-tu par jour ?", range: "Entre 3 et 40" },
{ question: "Combien de conversations durent plus de 5 minutes par jour ?", range: "Entre 1 et 20" },
{ question: "Combien de fois te réveilles-tu pendant la nuit ?", range: "Entre 0 et 8" },
{ question: "Combien de jours par semaine fais-tu du sport ?", range: "Entre 0 et 6" },
{ question: "Combien de minutes dure une séance de sport pour toi ?", range: "Entre 20 et 150" },
{ question: "Combien d’applications utilises-tu chaque jour ?", range: "Entre 3 et 30" },
{ question: "Combien de fois changes-tu de musique par jour ?", range: "Entre 5 et 120" },
{ question: "Combien de chansons écoutes-tu en entier par jour ?", range: "Entre 5 et 60" },
{ question: "À partir de combien d’années un film devient vieux selon toi ?", range: "Entre 5 et 60" },
{ question: "Après combien d’années un film devient culte selon toi ?", range: "Entre 5 et 50" },
{ question: "À partir de combien de messages une conversation devient lourde ?", range: "Entre 10 et 150" },
{ question: "Combien de messages sont nécessaires pour vraiment discuter ?", range: "Entre 5 et 120" },
{ question: "À partir de combien d’argent un achat fait culpabiliser ?", range: "Entre 20 et 3000" },
{ question: "À partir de combien d’argent un achat fait plaisir longtemps ?", range: "Entre 50 et 5000" },
{ question: "À partir de combien de répétitions une blague n’est plus drôle ?", range: "Entre 2 et 25" },
{ question: "Combien de fois une blague peut faire rire avant de lasser ?", range: "Entre 2 et 30" },
{ question: "À partir de combien de personnes te sens-tu de trop dans un groupe ?", range: "Entre 3 et 25" },
{ question: "Combien de personnes rendent un groupe vivant selon toi ?", range: "Entre 3 et 20" },
{ question: "À partir de combien de minutes un silence devient gênant ?", range: "Entre 5 et 90" },
{ question: "Combien de minutes de silence peuvent être confortables ?", range: "Entre 1 et 60" },
{ question: "À partir de combien d’échecs faut-il changer de stratégie ?", range: "Entre 2 et 20" },
{ question: "Combien d’échecs sont nécessaires pour apprendre ?", range: "Entre 1 et 30" },
{ question: "À partir de combien d’années une relation devient routinière ?", range: "Entre 2 et 30" },
{ question: "Après combien d’années une relation devient stable ?", range: "Entre 1 et 25" },
{ question: "À partir de combien de tentatives on force trop ?", range: "Entre 2 et 20" },
{ question: "Combien de tentatives montrent de la détermination ?", range: "Entre 2 et 25" },
{ question: "Combien de contacts as-tu dans ton téléphone ?", range: "Entre 20 et 800" },
{ question: "Combien d’alarmes différentes as-tu programmées ?", range: "Entre 0 et 30" },
{ question: "Combien de playlists as-tu créées ?", range: "Entre 0 et 60" },
{ question: "Combien de chaînes YouTube es-tu abonné ?", range: "Entre 0 et 300" },
{ question: "Combien de vêtements as-tu dans ton garde-robe ?", range: "Entre 30 et 400" },
{ question: "Combien de manteaux possèdes-tu ?", range: "Entre 0 et 15" },
{ question: "Combien de paires de bas possèdes-tu ?", range: "Entre 10 et 120" },
{ question: "Combien de paires de souliers possèdes-tu ?", range: "Entre 2 et 40" },
{ question: "Combien de jeux as-tu dans ta bibliothèque (toutes plateformes confondues) ?", range: "Entre 0 et 300" },
{ question: "Combien de jeux as-tu terminés dans ta vie ?", range: "Entre 0 et 150" },
{ question: "Combien de films as-tu vus dans la dernière année ?", range: "Entre 0 et 150" },
{ question: "Combien de séries as-tu terminées dans ta vie ?", range: "Entre 0 et 80" },
{ question: "Combien d’objets y a-t-il sur ton bureau en ce moment ?", range: "Entre 0 et 80" },
{ question: "Combien d’onglets gardes-tu habituellement ouverts ?", range: "Entre 1 et 60" },
{ question: "Combien de comptes réseaux sociaux possèdes-tu ?", range: "Entre 0 et 15" },
{ question: "Combien de groupes de discussion fais-tu partie ?", range: "Entre 0 et 80" },
{ question: "Combien de mots de passe différents utilises-tu ?", range: "Entre 1 et 50" },
{ question: "Combien d’emails non lus as-tu actuellement ?", range: "Entre 0 et 5000" },
{ question: "Combien de photos as-tu prises dans le dernier mois ?", range: "Entre 0 et 500" },
{ question: "Combien de selfies as-tu pris dans ta vie ?", range: "Entre 0 et 1000" },
{ question: "Combien d’objets décoratifs as-tu dans ta chambre ?", range: "Entre 0 et 120" },
{ question: "Combien d’affiches ou cadres as-tu sur tes murs ?", range: "Entre 0 et 40" },
{ question: "Combien de sacs possèdes-tu (sac d’école, sac de sport, etc.) ?", range: "Entre 1 et 25" },
{ question: "Combien de casquettes ou chapeaux possèdes-tu ?", range: "Entre 0 et 30" },
{ question: "Combien d’appareils électroniques possèdes-tu ?", range: "Entre 2 et 25" },
{ question: "Combien de chargeurs différents as-tu chez toi ?", range: "Entre 2 et 40" },
{ question: "Combien de comptes de jeux en ligne as-tu créés ?", range: "Entre 0 et 30" },
{ question: "Combien de skins ou cosmétiques as-tu dans ton jeu principal ?", range: "Entre 0 et 500" },
{ question: "Combien de captures d’écran as-tu dans ton téléphone ?", range: "Entre 0 et 2000" },
{ question: "Combien de vidéos as-tu dans ta galerie ?", range: "Entre 0 et 1500" },
{ question: "Combien de livres possèdes-tu chez toi ?", range: "Entre 0 et 300" },
{ question: "Combien de cahiers ou carnets as-tu remplis dans ta vie ?", range: "Entre 0 et 80" }
];

const QUESTION_PAIRS = [
  { q1: "Un plat que tu adores vraiment ?", q2: "Un plat que tu n’as jamais mangé ?" },
  { q1: "Un aliment que tu pourrais manger sans faim ?", q2: "Un aliment que tu goûterais par curiosité ?" },
  { q1: "Un plat qui te rappelle un bon souvenir ?", q2: "Un plat que tu associes à quelqu’un d’autre ?" },
  { q1: "Un plat que tu sais parfaitement cuisiner ?", q2: "Un plat que tu aimerais apprendre à faire ?" },
  { q1: "Un pays où tu te sentirais bien vivre ?", q2: "Un pays que tu connais seulement de nom ?" },
  { q1: "Un endroit que tu voudrais visiter seul ?", q2: "Un endroit où tu irais seulement accompagné ?" },
  { q1: "Un pays que tu connais déjà un peu ?", q2: "Un pays sur lequel tu ne sais presque rien ?" },
  { q1: "Un lieu qui te semble fascinant ?", q2: "Un lieu que tu trouves mystérieux ?" },
  { q1: "Un film que tu pourrais revoir sans te lasser ?", q2: "Un film que tu n’as jamais vu mais qui t’intrigue ?" },
  { q1: "Un univers fictif que tu comprends bien ?", q2: "Un univers fictif que tu trouves compliqué ?" },
  { q1: "Un personnage de film auquel tu t’identifies ?", q2: "Un personnage de film que tu observes de loin ?" },
  { q1: "Un film que tu recommandes souvent ?", q2: "Un film que tout le monde connaît mais pas toi ?" },
  { q1: "Une activité qui te détend vraiment ?", q2: "Une activité que tu n’as jamais essayée ?" },
  { q1: "Un passe-temps que tu fais souvent ?", q2: "Un passe-temps que tu trouves original ?" },
  { q1: "Une activité où tu te débrouilles bien ?", q2: "Une activité où tu serais totalement nul ?" },
  { q1: "Une activité que tu fais seul ?", q2: "Une activité que tu fais surtout avec d’autres ?" },
  { q1: "Un objet que tu utilises tous les jours ?", q2: "Un objet que tu oublies toujours ?" },
  { q1: "Un objet que tu garderais longtemps ?", q2: "Un objet que tu remplacerais facilement ?" },
  { q1: "Un objet qui te simplifie la vie ?", q2: "Un objet que tu ne sais pas vraiment utiliser ?" },
  { q1: "Un objet auquel tu tiens ?", q2: "Un objet que tu possèdes mais n’utilises jamais ?" },
  { q1: "Un moment de la journée que tu apprécies ?", q2: "Un moment de la journée que tu remarques à peine ?" },
  { q1: "Un moment où tu es le plus productif ?", q2: "Un moment où ton cerveau est au ralenti ?" },
  { q1: "Un moment que tu prends pour toi ?", q2: "Un moment que tu passes surtout avec les autres ?" },
  { q1: "Une musique que tu connais par cœur ?", q2: "Une musique que tu as découverte récemment ?" },
  { q1: "Un style de musique que tu écoutes souvent ?", q2: "Un style de musique que tu comprends mal ?" },
  { q1: "Une musique qui te donne de l’énergie ?", q2: "Une musique que tu trouves relaxante ?" },
  { q1: "Une chose que tu fais sans réfléchir ?", q2: "Une chose que tu fais toujours avec attention ?" },
  { q1: "Une habitude que tu as depuis longtemps ?", q2: "Une habitude que tu as prise récemment ?" },
  { q1: "Une chose qui te motive facilement ?", q2: "Une chose qui te demande beaucoup d’effort ?" },
  { q1: "Un plat que tu pourrais manger n’importe quand ?", q2: "Un plat que tu manges seulement à certaines occasions ?" },
  { q1: "Un goût que tu as appris à aimer ?", q2: "Un goût que tu n’as jamais vraiment compris ?" },
  { q1: "Un plat que tu partages facilement ?", q2: "Un plat que tu préfères garder pour toi ?" },
  { q1: "Un endroit où tu te verrais rester longtemps ?", q2: "Un endroit où tu passerais seulement quelques jours ?" },
  { q1: "Un lieu qui te semble rassurant ?", q2: "Un lieu qui te semble impressionnant ?" },
  { q1: "Un pays qui te paraît familier ?", q2: "Un pays qui te paraît très dépaysant ?" },
  { q1: "Un film que tu comprends dès le premier visionnage ?", q2: "Un film que tu as compris après coup ?" },
  { q1: "Un film que tu regardes pour l’histoire ?", q2: "Un film que tu regardes surtout pour l’ambiance ?" },
  { q1: "Un film qui te met dans un certain mood ?", q2: "Un film que tu regardes sans trop t’impliquer ?" },
  { q1: "Une activité où tu te sens à l’aise ?", q2: "Une activité où tu te sens un peu maladroit ?" },
  { q1: "Une activité que tu fais spontanément ?", q2: "Une activité que tu dois planifier ?" },
  { q1: "Une activité qui te fatigue ?", q2: "Une activité qui te recharge ?" },
  { q1: "Un objet que tu remarques toujours ?", q2: "Un objet que tu oublies facilement ?" },
  { q1: "Un objet qui te rassure ?", q2: "Un objet qui t’agace un peu ?" },
  { q1: "Un objet que tu utiliserais même cassé ?", q2: "Un objet que tu jetterais au moindre défaut ?" },
  { q1: "Un moment où tu réfléchis beaucoup ?", q2: "Un moment où tu fais les choses en automatique ?" },
  { q1: "Un moment qui passe vite ?", q2: "Un moment qui te semble long ?" },
  { q1: "Une musique que tu écoutes en fond ?", q2: "Une musique que tu écoutes attentivement ?" },
  { q1: "Une musique liée à un souvenir ?", q2: "Une musique que tu écoutes sans y penser ?" },
  { q1: "Une musique qui te calme ?", q2: "Une musique qui te booste ?" },
  { q1: "Une décision que tu prends rapidement ?", q2: "Une décision que tu mets du temps à prendre ?" },
  { q1: "Une chose que tu fais par habitude ?", q2: "Une chose que tu fais par envie ?" },
  { q1: "Une chose que tu fais pour toi ?", q2: "Une chose que tu fais surtout pour les autres ?" },
  { q1: "Combien de messages envoies-tu par jour en moyenne ?", q2: "Combien de messages ignores-tu par jour en moyenne ?" },
  { q1: "Combien de fois regardes-tu ton téléphone par jour ?", q2: "Combien d’heures passes-tu sur ton téléphone par jour ?" },
  { q1: "Combien de fois manges-tu par jour ?", q2: "Combien de collations manges-tu par jour ?" },
  { q1: "Combien de verres d’eau bois-tu par jour ?", q2: "Combien de boissons autres que l’eau bois-tu par jour ?" },
  { q1: "Combien de fois ris-tu vraiment par jour ?", q2: "Combien de fois souris-tu sans rire par jour ?" },
  { q1: "Combien de fois par jour tu te parles dans ta tête ?", q2: "Combien de pensées te traversent l’esprit en une journée ?" },
  { q1: "Combien de fois te laves-tu les mains par jour ?", q2: "Combien de fois touches-tu ton visage par jour ?" },
  { q1: "Combien de fois vas-tu aux toilettes par jour ?", q2: "Combien de minutes passes-tu aux toilettes par jour ?" },
  { q1: "Combien de notifications reçois-tu par jour ?", q2: "Combien de notifications supprimes-tu sans les lire par jour ?" },
  { q1: "Combien de photos prends-tu par semaine ?", q2: "Combien de photos gardes-tu vraiment par semaine ?" },
  { q1: "Combien de personnes vois-tu en vrai par jour ?", q2: "Combien de personnes contactes-tu en ligne par jour ?" },
  { q1: "Combien de conversations différentes as-tu par jour ?", q2: "Combien de conversations durent plus de 5 minutes par jour ?" },
  { q1: "Combien d’heures dors-tu par nuit ?", q2: "Combien de fois te réveilles-tu pendant la nuit ?" },
  { q1: "Combien de jours par semaine fais-tu du sport ?", q2: "Combien de minutes dure une séance de sport pour toi ?" },
  { q1: "Combien d’applications utilises-tu chaque jour ?", q2: "Combien d’applications as-tu installées sur ton téléphone ?" },
  { q1: "Combien de fois changes-tu de musique par jour ?", q2: "Combien de chansons écoutes-tu en entier par jour ?" },
  { q1: "À partir de combien d’années un film devient vieux ?", q2: "Après combien d’années un film devient culte ?" },
  { q1: "À partir de combien de messages une conversation devient lourde ?", q2: "Combien de messages sont nécessaires pour vraiment discuter ?" },
  { q1: "À partir de combien d’argent un achat fait culpabiliser ?", q2: "À partir de combien d’argent un achat fait plaisir longtemps ?" },
  { q1: "À partir de combien de répétitions une blague n’est plus drôle ?", q2: "Combien de fois une blague peut faire rire avant de lasser ?" },
  { q1: "À partir de combien de personnes on se sent de trop ?", q2: "Combien de personnes rendent un groupe vivant ?" },
  { q1: "À partir de combien de minutes un silence devient gênant ?", q2: "Combien de minutes de silence peuvent être confortables ?" },
  { q1: "À partir de combien d’échecs il faut changer de stratégie ?", q2: "Combien d’échecs sont nécessaires pour apprendre ?" },
  { q1: "À partir de combien d’années une relation devient routinière ?", q2: "Après combien d’années une relation devient stable ?" },
  { q1: "À partir de combien de tentatives on force trop ?", q2: "Combien de tentatives montrent de la détermination ?" },
];

type Step = "answering" | "discussion" | "results";

export function QuestionImpostor({ players, config, onBack }: QuestionImpostorProps) {
  const [step, setStep] = useState<Step>("answering");
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [impostorId, setImpostorId] = useState("");
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [mainQuestion, setMainQuestion] = useState("");
  const [impostorQuestion, setImpostorQuestion] = useState("");

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

    const impIdx = Math.floor(Math.random() * players.length);
    const impId = players[impIdx].id;
    setImpostorId(impId);

    const qMap: Record<string, string> = {};
    players.forEach(p => {
      qMap[p.id] = p.id === impId ? qImp : qMain;
    });
    setQuestions(qMap);
  };

  // Initialisation
  useEffect(() => {
    setupGame();
  }, [players, config.questionMode]);

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = { ...answers, [players[currentPlayerIdx].id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");

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
    setupGame();
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400"><ChevronLeft /></button>
        <div className="text-center">
          <h2 className="text-xs font-black text-amber-500 uppercase italic tracking-widest">La Question Différente</h2>
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
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                {config.questionMode === "numbers" && players[currentPlayerIdx].id === impostorId 
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

            <button onClick={() => setStep("results")} className="mt-auto w-full py-5 bg-amber-500 text-black font-black uppercase italic rounded-2xl shadow-xl">
              Révéler les rôles
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
              <p className="text-[13px] font-black text-red-500 uppercase tracking-widest text-center">Imposteur :</p>
              <div className="bg-red-500/10 p-4 rounded-2xl border-2 border-red-500/30 text-white font-bold italic text-center">
                "{impostorQuestion}"
              </div>
            </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Rôles et réponses :</p>
              <div className="space-y-2">
                {players.map(p => (
                  <div key={p.id} className={`p-4 rounded-2xl flex items-center justify-between ${p.id === impostorId ? 'bg-red-500/10 border-2 border-red-500/50' : 'bg-slate-800'}`}>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-500">{p.name}</p>
                      <p className="font-bold text-white italic">"{answers[p.id]}"</p>
                    </div>
                    {p.id === impostorId ? (
                      <span className="text-[10px] font-black bg-red-500 text-white px-2 py-1 rounded uppercase italic shrink-0">L'Imposteur</span>
                    ) : (
                      <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded uppercase italic shrink-0">Innocent</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
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
