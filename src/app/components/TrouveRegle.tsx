import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@/app/App";
import { GameConfig } from "@/app/components/GameSettings";
import { AlertCircle, ChevronLeft, RotateCcw, Users } from "lucide-react";

interface TrouveRegleProps {
  players: Player[];
  config: GameConfig;
  onBack: () => void;
}

type Phase = "seekers" | "rule" | "play" | "results";

const RULES_POOL: string[] = [
"A chaque question posée, il faut integrer un chiffre dans la réponse.",
"Il faut volontairement ecorcher le nom des enquêteurs quand on s'adresse à eux.",
"Prendre en photo les enquêteurs le plus possible sans qu'ils ne remarquent.",
"Les enquêteurs doivent trouver la règle (une règle de mesure physique ou dessinée)",
"Faire rimer la réponse avec la question posée.",
"Il faut cligner exagerement des yeux des qu'on entend un verbe.",
"Integrer des titres de films dans les réponses.",
"Integrer des titres de musique dans les réponses.",
"Il faut imiter la personne a votre droite.",
"Faire un geste de magie après avoir répondu à une question.",
"Couper la parole aux enquêteurs lorsqu'on s'adresse à vous.",
"Il faut intégrer le dernier mot de la phrase d'un des enquêteurs dans sa réponse.",
"Il ne faut pas mettre les mains au dessus de vos hanches.",
"Il faut répondre aux questions dans l'ordre de l'alphabet (première question, réponse commençant par A, deuxième question, réponse commençant par B, etc.).",
"Il n'est autorisé de parler que quand les enquêteurs vous désigne avec sa main.",
"Il n'est pas autorisé de respirer en même temps que les enquêteurs parle.",
"Il n'est pas autorisé de prononcer la lettre \"T\".",
"Il faut faire un maximum de doigts d'honneur aux enquêteurs.",
"Il faut faire un bruit à l'aide de son corps lorsqu'on répond aux enquêteurs.",
"Il faut intégrer une conjonction de coordination (mais, ou, et, donc, car, ni, or) dans sa réponse.",
"Il faut finir sa phrase avec un note plus aigüe qu'au début de celle-ci.",
"Il faut dire \"Ta geule\" aux enquêteurs à la fin de votre réponse.",
"Il faut obtenir la validation d'un autre joueur pour parler/répondre.",
"Vous devez tous tomber au sol lorsque les enquêteurs appuient sur le buzzer.",
"Quand un des enquêteurs tape des mains une personne doit dire (à tour de rôle) \"Je dois aller pisser.\" et sortir de la pièce 5 secondes.",
"Il faut ajouter un mot en anglais dans chaque réponse.",
"Il faut faire semblant d’avoir oublié la question avant de répondre.",
"Il faut intégrer une couleur dans chaque réponse.",
"Il faut répondre en faisant un mini geste de danse discret.",
"Il faut répéter le premier mot de la question dans la réponse.",
"Il faut regarder le plafond avant de répondre.",
"Il faut toucher la table avant chaque réponse.",
"Il faut répondre en parlant légèrement plus lentement que d’habitude.",
"Il faut faire un mini rire après chaque réponse.",
"Il faut répondre en commençant par « techniquement ».",
"Il faut faire un mini soupir avant de répondre.",
"A chaque fois qu’un enquêteur croise les bras, il faut arrêter de parler immédiatement.",
"Il faut répondre en utilisant exactement le même nombre de mots que la question.",
"Il faut donner une vraie réponse, puis en murmurer une deuxième différente.",
"Il faut répondre 100% a coté de la plaque.",
"Quand un des enquêteurs parlent, il faut fermer les yeux jusqu’à ce qu’ils arrêtent.",
"Chaque fois qu’un enquêteur touche un objet, vous devez le touchez également.",
"Chaque fois qu’un enquêteur touche un objet, il faut se toucher le front.",
"Il faut répondre en évitant de regarder la personne qui pose la question.",
"Interdiction de montrer ses dents en parlant.",
"Imiter discrètement la posture d’un enquêteur choisi au début.",
"Garder une main cachée sous la table pendant toute la manche.",
"Éviter complètement les mots contenant la lettre « M ».",
"Parler en fixant un objet précis choisi secrètement.",
"Garder les pieds collés ensemble en permanence.",
"Éviter les mots de plus de deux syllabes.",
"Hocher la tête exagérément quand un prénom est prononcé.",
"Garder le dos collé au dossier de la chaise.",
"Conserver un objet en main pendant toute la manche.",
"Interdiction de fermer la bouche complètement (lèvres qui touche).",
"Il faut faire un clin d’œil à chaque fois que quelqu’un dit un mot contenant la lettre « A ».",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] ?? items[0];
}

function pickAnotherRule(currentRule: string): string {
  if (RULES_POOL.length <= 1) return currentRule;
  let nextRule = currentRule;
  while (nextRule === currentRule) {
    nextRule = pickRandom(RULES_POOL);
  }
  return nextRule;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatStopwatch(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const pad2 = (value: number) => value.toString().padStart(2, "0");

  if (hours > 0) return `${hours}:${pad2(minutes)}:${pad2(seconds)}`;
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

function normalizeInvestigatorsWording(rule: string, isSingleInvestigator: boolean) {
  if (!isSingleInvestigator) return rule;

  return rule
    .replace(/aux enquêteurs/gi, "à l'enquêteur")
    .replace(/des enquêteurs/gi, "de l'enquêteur")
    .replace(/les enquêteurs/gi, "l'enquêteur")
    .replace(/enquêteurs\s+doivent/gi, "enquêteur doit")
    .replace(/enquêteurs\s+sont/gi, "enquêteur est")
    .replace(/d'un enquêteurs/gi, "d'un enquêteur")
    .replace(/un enquêteurs/gi, "un enquêteur")
    .replace(/l'enquêteur\s+doivent/gi, "l'enquêteur doit")
    .replace(/l'enquêteur\s+sont/gi, "l'enquêteur est")
    .replace(/ils\s+doivent/gi, "il doit")
    .replace(/ils\s+sont/gi, "il est")
    .replace(/à eux/gi, "à lui")
    .replace(/l'enquêteur\s+lorsqu'on/gi, "l'enquêteur lorsqu'il")
    .replace(/d'un de l'enquêteur/gi, "de l'enquêteur")
    .replace(/un de l'enquêteur/gi, "l'enquêteur");
}

export function TrouveRegle({ players, config, onBack }: TrouveRegleProps) {
  const randomSeekersCount = config.randomSeekersCount ?? false;
  const desiredSeekersCount = Math.max(1, Math.floor(config.seekersCount ?? 1));
  const maxSeekersCount = Math.max(1, players.length - 1);
  const initialSeekersCount = Math.max(1, Math.min(desiredSeekersCount, maxSeekersCount));
  const usePresetRule = config.usePresetRule ?? true;
  const timeLimitMinutes: 5 | 10 | 15 | "unlimited" =
    config.timeLimitMinutes === 5 || config.timeLimitMinutes === 15 || config.timeLimitMinutes === "unlimited"
      ? config.timeLimitMinutes
      : 10;
  const buzzLimit: 1 | 2 | 3 | 4 | 5 | "unlimited" =
    config.buzzLimit === 1 ||
    config.buzzLimit === 2 ||
    config.buzzLimit === 3 ||
    config.buzzLimit === 4 ||
    config.buzzLimit === 5 ||
    config.buzzLimit === "unlimited"
      ? config.buzzLimit
      : 3;
  const isUnlimitedTime = timeLimitMinutes === "unlimited";
  const isUnlimitedBuzz = buzzLimit === "unlimited";
  const initialTimeLimitMs = isUnlimitedTime ? 0 : timeLimitMinutes * 60 * 1000;
  const [activeSeekersCount, setActiveSeekersCount] = useState(initialSeekersCount);
  const isSingleInvestigator = activeSeekersCount === 1;
  const [phase, setPhase] = useState<Phase>("seekers");
  const [seekersIds, setSeekersIds] = useState<string[]>([]);
  const [secretRule, setSecretRule] = useState<string>(pickRandom(RULES_POOL));
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalElapsedMs, setFinalElapsedMs] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [finalRemainingMs, setFinalRemainingMs] = useState<number | null>(null);
  const [remainingBuzz, setRemainingBuzz] = useState<number>(isUnlimitedBuzz ? Number.POSITIVE_INFINITY : buzzLimit);
  const [finalRemainingBuzz, setFinalRemainingBuzz] = useState<number | null>(null);
  const timerStartAtRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const buzzAudioContextRef = useRef<AudioContext | null>(null);

  const displayedRule = useMemo(() => {
    const baseRule = usePresetRule ? secretRule : "Discutez et définissez la règle";
    return normalizeInvestigatorsWording(baseRule, isSingleInvestigator);
  }, [secretRule, usePresetRule, isSingleInvestigator]);

  const seekers = useMemo(
    () => players.filter((p) => seekersIds.includes(p.id)),
    [players, seekersIds]
  );

  const seekersLabel = useMemo(() => {
    if (seekers.length === 0) return "";
    return seekers
      .map((seeker) => seeker.name)
      .filter((name): name is string => Boolean(name))
      .join(" - ");
  }, [seekers]);

  const nonSeekers = useMemo(
    () => players.filter((p) => !seekersIds.includes(p.id)),
    [players, seekersIds]
  );

  const nonSeekersLabel = useMemo(() => {
    if (nonSeekers.length === 0) return "";
    return nonSeekers
      .map((player) => player.name)
      .filter((name): name is string => Boolean(name))
      .join(" - ");
  }, [nonSeekers]);

  const showPlayersInsteadOfSeekers = activeSeekersCount > players.length / 2;

  const getRoundSeekersCount = () => {
    if (randomSeekersCount) {
      return Math.floor(Math.random() * maxSeekersCount) + 1;
    }
    return initialSeekersCount;
  };

  const startNewRound = () => {
    const roundSeekersCount = getRoundSeekersCount();
    const shuffled = shuffle(players);
    const picked = shuffled.slice(0, Math.min(roundSeekersCount, players.length)).map((p) => p.id);
    setActiveSeekersCount(roundSeekersCount);
    setSeekersIds(picked);
    setSecretRule(pickRandom(RULES_POOL));
    setElapsedMs(0);
    setFinalElapsedMs(null);
    setRemainingMs(initialTimeLimitMs);
    setFinalRemainingMs(null);
    setRemainingBuzz(isUnlimitedBuzz ? Number.POSITIVE_INFINITY : buzzLimit);
    setFinalRemainingBuzz(null);
    endedRef.current = false;
    timerStartAtRef.current = null;
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setPhase("seekers");
  };

  const stopRunningTimer = () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timerStartAtRef.current = null;
  };

  const finishRound = (forcedElapsedMs?: number, forcedRemainingMs?: number) => {
    if (endedRef.current) return;
    endedRef.current = true;

    const startAt = timerStartAtRef.current;
    const computedElapsed = forcedElapsedMs ?? (startAt ? Date.now() - startAt : elapsedMs);
    const normalizedElapsed = Math.max(0, computedElapsed);

    stopRunningTimer();
    setElapsedMs(normalizedElapsed);
    setFinalElapsedMs(normalizedElapsed);

    if (!isUnlimitedTime) {
      const computedRemaining = forcedRemainingMs ?? Math.max(0, initialTimeLimitMs - normalizedElapsed);
      setRemainingMs(computedRemaining);
      setFinalRemainingMs(computedRemaining);
    }

    setFinalRemainingBuzz(remainingBuzz);

    setPhase("results");
  };

  useEffect(() => {
    if (phase !== "play") {
      stopRunningTimer();
      return;
    }

    endedRef.current = false;
    setElapsedMs(0);
    setFinalElapsedMs(null);
    setFinalRemainingMs(null);
    setFinalRemainingBuzz(null);

    const startAt = Date.now();
    timerStartAtRef.current = startAt;

    setRemainingBuzz(isUnlimitedBuzz ? Number.POSITIVE_INFINITY : buzzLimit);
    setRemainingMs(isUnlimitedTime ? 0 : initialTimeLimitMs);

    timerIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startAt;
      setElapsedMs(elapsed);

      if (!isUnlimitedTime) {
        const nextRemaining = Math.max(0, initialTimeLimitMs - elapsed);
        setRemainingMs(nextRemaining);

        if (nextRemaining <= 0) {
          finishRound(initialTimeLimitMs, 0);
        }
      }
    }, 250);

    return () => {
      stopRunningTimer();
    };
  }, [phase, timeLimitMinutes, buzzLimit, isUnlimitedTime, initialTimeLimitMs, isUnlimitedBuzz]);

  const revealRule = () => {
    if (isUnlimitedTime) {
      finishRound();
      return;
    }

    const startAt = timerStartAtRef.current;
    const computedElapsed = startAt ? Date.now() - startAt : elapsedMs;
    const computedRemaining = Math.max(0, initialTimeLimitMs - computedElapsed);
    finishRound(computedElapsed, computedRemaining);
  };

  const changeRule = () => {
    setSecretRule((currentRule) => pickAnotherRule(currentRule));
  };

  const triggerBuzz = async () => {
    if (phase !== "play") return;
    if (!isUnlimitedBuzz && remainingBuzz <= 0) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        if (!isUnlimitedBuzz) {
          setRemainingBuzz((current) => Math.max(0, current - 1));
        }
        return;
      }

      if (!buzzAudioContextRef.current || buzzAudioContextRef.current.state === "closed") {
        buzzAudioContextRef.current = new AudioContextClass();
      }

      const audioContext = buzzAudioContextRef.current;
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const now = audioContext.currentTime;

      oscillator.type = "square";
      oscillator.frequency.value = 180;
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 0.2);
    } catch {
      // ignore audio errors
    }

    if (!isUnlimitedBuzz) {
      setRemainingBuzz((current) => Math.max(0, current - 1));
    }
  };

  useEffect(() => {
    return () => {
      if (buzzAudioContextRef.current && buzzAudioContextRef.current.state !== "closed") {
        buzzAudioContextRef.current.close().catch(() => undefined);
      }
    };
  }, []);

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 text-slate-400">
          <ChevronLeft />
        </button>

        <div className="text-center">
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest italic">📏 Trouve la règle</h2>
          <p className="text-sm font-black text-slate-300 uppercase italic tracking-tighter">
            {activeSeekersCount} {activeSeekersCount > 1 ? "enquêteurs" : "enquêteur"}
          </p>
        </div>

        <div className="w-10" />
      </header>

      <AnimatePresence mode="wait">
        {phase === "seekers" && (
          <motion.div
            key="seekers"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="flex-1 flex flex-col justify-center gap-8 text-center"
          >
            <div className="bg-slate-800 border-2 border-slate-700 p-8 rounded-3xl relative shadow-xl overflow-hidden">
              <div className="space-y-4">
                <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  {showPlayersInsteadOfSeekers ? (
                    nonSeekers.length === 1 ? (
                      <>
                        Le <span className="font-bold text-white">joueur</span> est
                      </>
                    ) : (
                      <>
                        Les <span className="font-bold text-white">joueurs</span> sont
                      </>
                    )
                  ) : isSingleInvestigator ? (
                    <>
                      L'<span className="font-bold text-white">enquêteur</span> est
                    </>
                  ) : (
                    <>
                      Les <span className="font-bold text-white">enquêteurs</span> sont
                    </>
                  )}
                </p>
                <div className="space-y-2">
                  {showPlayersInsteadOfSeekers ? (
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter">
                      {nonSeekers.length > 0 ? nonSeekersLabel : "Sélection…"}
                    </p>
                  ) : seekers.length > 0 ? (
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{seekersLabel}</p>
                  ) : (
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter">Sélection…</p>
                  )}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {showPlayersInsteadOfSeekers ? (
                    activeSeekersCount === 1 ? (
                      <>
                        Le reste est un <span className="font-bold text-white">enquêteur</span>, il doit <span className="text-white font-bold">quitter la pièce</span>.
                      </>
                    ) : (
                      <>
                        Le reste sont des <span className="font-bold text-white">enquêteurs</span>, ils doivent <span className="text-white font-bold">quitter la pièce</span>.
                      </>
                    )
                  ) : (
                    <>
                      {isSingleInvestigator ? (
                        <>
                          L'<span className="font-bold text-white">enquêteur</span> doit{" "}
                        </>
                      ) : (
                        <>
                          Les <span className="font-bold text-white">enquêteurs</span> doivent{" "}
                        </>
                      )}
                      <span className="text-white font-bold">quitter la pièce</span>.
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={() => setPhase("rule")}
                className="mt-8 w-full py-4 bg-blue-700 text-white font-black uppercase rounded-2xl active:scale-95 transition-all"
              >
                RÉVÉLER LA RÈGLE
              </button>
            </div>
          </motion.div>
        )}

        {phase === "rule" && (
          <motion.div
            key="rule"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col justify-center gap-8 text-center"
          >
            <div className="bg-slate-800 border-2 border-slate-700 p-6 rounded-3xl relative shadow-xl overflow-hidden">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {usePresetRule && (
                      <button
                        onClick={changeRule}
                        className="px-2 py-1 rounded-lg bg-slate-700 text-slate-200 text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                      >
                        Changer
                      </button>
                    )}
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Règle secrète:</p>
                  </div>
                  <p className="text-lg font-black text-white uppercase italic tracking-tight">{displayedRule}</p>
                </div>
              </div>

              <button
                onClick={() => setPhase("play")}
                className="mt-8 w-full py-4 bg-blue-700 text-white font-black uppercase rounded-2xl active:scale-95 transition-all"
              >
                CONTINUER
              </button>
            </div>
          </motion.div>
        )}

        {phase === "play" && (
          <motion.div
            key="play"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col gap-6 pt-4"
          >
            <div className="text-center space-y-2">
              <Users size={48} className="mx-auto text-blue-500 mb-2" />
              <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Trouvez la règle</h3>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Observez les comportements</p>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {!isUnlimitedTime ? "Temps restant" : "Temps"}
                  </span>
                  <span className="text-sm font-black text-white tabular-nums">
                    {!isUnlimitedTime ? formatStopwatch(remainingMs) : formatStopwatch(elapsedMs)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                {isSingleInvestigator ? "Enquêteur :" : "Enquêteurs :"}
              </p>
              <div className="bg-slate-800 p-4 rounded-2xl border-2 border-blue-600/30 text-white font-bold italic text-center">
                {seekers.length > 0 ? seekersLabel : "—"}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                Buzz restants : {isUnlimitedBuzz ? "∞" : remainingBuzz}
              </p>
              <button
                onClick={triggerBuzz}
                disabled={!isUnlimitedBuzz && remainingBuzz <= 0}
                className={`w-full py-4 font-black uppercase italic rounded-2xl transition-all ${
                  isUnlimitedBuzz || remainingBuzz > 0
                    ? "bg-blue-700 text-white active:scale-95"
                    : "bg-slate-700 text-slate-400 cursor-not-allowed"
                }`}
              >
                BUZZ
              </button>
            </div>

            <button
              onClick={revealRule}
              className="mt-auto w-full py-5 bg-blue-700 text-white font-black uppercase italic rounded-2xl shadow-xl"
            >
              Révéler la règle
            </button>
          </motion.div>
        )}

        {phase === "results" && (
          <motion.div
            key="results"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col gap-8 pt-4"
          >
            <div className="text-center space-y-4">
              <AlertCircle size={48} className="mx-auto text-blue-500" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Règle :</p>
                <div className="bg-blue-600/10 p-4 rounded-2xl border-2 border-blue-600/30 text-white font-bold italic text-center">
                  {usePresetRule ? normalizeInvestigatorsWording(secretRule, isSingleInvestigator) : "Règle personnalisé"}
                </div>
              </div>

              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temps pour trouvez</span>
                  <span className="text-sm font-black text-white tabular-nums">
                    {formatStopwatch(finalElapsedMs ?? elapsedMs)}
                  </span>
                </div>
              </div>

              {!isUnlimitedTime ? (
                <div className="pt-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temps restant</span>
                    <span className="text-sm font-black text-white tabular-nums">
                      {formatStopwatch(finalRemainingMs ?? remainingMs)}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buzz restants</span>
                  <span className="text-sm font-black text-white tabular-nums">
                    {isUnlimitedBuzz ? "∞" : finalRemainingBuzz ?? remainingBuzz}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                {isSingleInvestigator ? "Enquêteur :" : "Enquêteurs :"}
              </p>
              <div className="bg-slate-800 p-4 rounded-2xl border-2 border-blue-600/30 text-white font-bold italic text-center">
                {seekers.length > 0 ? seekersLabel : "—"}
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <button
                onClick={startNewRound}
                className="w-full py-4 bg-blue-700 text-white font-black uppercase italic rounded-2xl flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> Rejouer
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
