import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Player } from "@/app/App";

interface TeamCreatorProps {
  onBack: () => void;
  players: Player[];
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type Distribution = {
  teams: number;
  minSize: number;
  maxSize: number;
  smallerTeams: number;
  biggerTeams: number;
};

const getTeamSizes = (totalPlayers: number, teams: number): Distribution => {
  const safeTeams = clamp(teams, 1, totalPlayers);
  const minSize = Math.floor(totalPlayers / safeTeams);
  const maxSize = Math.ceil(totalPlayers / safeTeams);
  const biggerTeams = totalPlayers % safeTeams;
  const smallerTeams = safeTeams - biggerTeams;

  return {
    teams: safeTeams,
    minSize,
    maxSize,
    smallerTeams,
    biggerTeams,
  };
};

const formatTeamRange = (minSize: number, maxSize: number) => {
  if (minSize === maxSize) return `${minSize}`;
  return `${minSize}-${maxSize}`;
};

export function TeamCreator({ onBack, players }: TeamCreatorProps) {
  const totalPlayers = clamp(players.length, 3, 15);
  const [teamCount, setTeamCount] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState<string[][]>([]);

  const setTeamsFromDropdown = (nextTeams: number) => {
    const safeTeams = clamp(nextTeams, 2, totalPlayers);
    setTeamCount(safeTeams);
    setGeneratedTeams([]);
  };

  const distribution = useMemo(() => getTeamSizes(totalPlayers, teamCount), [totalPlayers, teamCount]);

  const sizePattern = useMemo(() => {
    const sizes = [
      ...Array.from({ length: distribution.smallerTeams }, () => distribution.minSize),
      ...Array.from({ length: distribution.biggerTeams }, () => distribution.maxSize),
    ];
    return sizes;
  }, [distribution]);

  const targetOptions = useMemo(() => {
    const options: Array<{ teams: number; label: string }> = [];
    const seen = new Set<string>();

    for (let teams = 2; teams <= totalPlayers; teams += 1) {
      const dist = getTeamSizes(totalPlayers, teams);
      const label = formatTeamRange(dist.minSize, dist.maxSize);

      if (seen.has(label)) continue;
      seen.add(label);
      options.push({ teams, label });
    }

    return options;
  }, [totalPlayers]);

  const selectedTargetLabel = useMemo(() => {
    const dist = getTeamSizes(totalPlayers, teamCount);
    return formatTeamRange(dist.minSize, dist.maxSize);
  }, [teamCount, totalPlayers]);

  const generateTeams = () => {
    const realPlayers = players.map((player) => player.name).filter(Boolean).slice(0, totalPlayers);
    const shuffled = [...realPlayers].sort(() => Math.random() - 0.5);

    const teams: string[][] = [];
    let cursor = 0;
    sizePattern.forEach((size) => {
      teams.push(shuffled.slice(cursor, cursor + size));
      cursor += size;
    });

    setGeneratedTeams(teams);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1"
    >
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">
            Créateur <span className="text-blue-500">d'équipe</span>
          </h1>
        </div>
        <div className="w-10" />
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto pb-8 pr-1">
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <h3 className="font-bold uppercase text-[10px] tracking-widest text-slate-300">Nombre d'équipes</h3>
              <select
                value={teamCount}
                onChange={(event) => setTeamsFromDropdown(parseInt(event.target.value, 10))}
                className="w-full py-3 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {Array.from({ length: totalPlayers - 1 }, (_, index) => index + 2).map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold uppercase text-[10px] tracking-widest text-slate-300">Joueurs par équipe</h3>
              <select
                value={selectedTargetLabel}
                onChange={(event) => {
                  const selected = targetOptions.find((option) => option.label === event.target.value);
                  if (!selected) return;
                  setTeamsFromDropdown(selected.teams);
                }}
                className="w-full py-3 px-3 rounded-xl text-sm font-bold bg-slate-900 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {targetOptions.map((option) => (
                  <option key={option.label} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={generateTeams}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
          >
            Générer les équipes
          </button>
        </section>

        {generatedTeams.length > 0 && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
                <div className="grid grid-cols-2 gap-3">
                  {generatedTeams.map((team, index) => (
                    <div key={index} className="p-4 bg-slate-900 rounded-xl border border-slate-700">
                      <p className="text-blue-300 font-black text-xs uppercase tracking-widest mb-2">
                        Équipe {index + 1}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {team.map((name, memberIndex) => {
                          const maxLen = 14;
                          let displayName = name;
                          if (displayName.length > maxLen) {
                            displayName = displayName.slice(0, maxLen - 2) + "…";
                          }
                          return (
                            <span key={`${name}-${memberIndex}`} className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-100 text-xs font-bold">
                              {displayName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
