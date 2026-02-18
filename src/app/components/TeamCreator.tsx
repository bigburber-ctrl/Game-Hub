import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Shuffle, Group } from "lucide-react";

interface TeamCreatorProps {
  players: { id: string; name: string }[];
  onBack: () => void;
}

export function TeamCreator({ players, onBack }: TeamCreatorProps) {
  const [mode, setMode] = useState<"teams" | "players">("teams");
  const [teamsCount, setTeamsCount] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  // Calcul automatique
  const maxTeams = Math.max(2, Math.floor(players.length / 2));
  const maxPlayersPerTeam = Math.max(2, players.length);

  function generateTeams() {
    let shuffled = [...players].sort(() => Math.random() - 0.5);
    let result: string[][] = [];
    if (mode === "teams") {
      for (let i = 0; i < teamsCount; i++) result.push([]);
      shuffled.forEach((p, idx) => {
        result[idx % teamsCount].push(p.name);
      });
    } else {
      const teamCount = Math.ceil(players.length / playersPerTeam);
      for (let i = 0; i < teamCount; i++) result.push([]);
      shuffled.forEach((p, idx) => {
        result[Math.floor(idx / playersPerTeam)].push(p.name);
      });
    }
    setTeams(result);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">
            Créateur <span className="text-blue-400">d'équipe</span>
          </h1>
        </div>
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto pb-8 pr-1">
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Group size={20} className="text-blue-400" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Paramètres</h3>
          </div>
          <div className="flex gap-4 items-center">
            <button
              className={`px-4 py-2 rounded-xl border-2 font-black uppercase tracking-widest text-xs transition-all ${mode === "teams" ? "bg-blue-700/10 border-blue-500 text-white" : "bg-slate-900 border-slate-700 text-slate-400"}`}
              onClick={() => setMode("teams")}
            >
              Nombre d'équipes
            </button>
            <button
              className={`px-4 py-2 rounded-xl border-2 font-black uppercase tracking-widest text-xs transition-all ${mode === "players" ? "bg-blue-700/10 border-blue-500 text-white" : "bg-slate-900 border-slate-700 text-slate-400"}`}
              onClick={() => setMode("players")}
            >
              Joueurs par équipe
            </button>
          </div>
          {mode === "teams" ? (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-bold text-slate-300">Nombre d'équipes :</span>
              <input
                type="number"
                min={2}
                max={maxTeams}
                value={teamsCount}
                onChange={e => setTeamsCount(Math.max(2, Math.min(maxTeams, parseInt(e.target.value))))}
                className="w-16 py-2 px-3 rounded-xl bg-slate-900 text-white border border-slate-700 text-center font-black"
              />
              <span className="text-xs text-slate-400">(max {maxTeams})</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm font-bold text-slate-300">Joueurs par équipe :</span>
              <input
                type="number"
                min={2}
                max={maxPlayersPerTeam}
                value={playersPerTeam}
                onChange={e => setPlayersPerTeam(Math.max(2, Math.min(maxPlayersPerTeam, parseInt(e.target.value))))}
                className="w-16 py-2 px-3 rounded-xl bg-slate-900 text-white border border-slate-700 text-center font-black"
              />
              <span className="text-xs text-slate-400">(max {maxPlayersPerTeam})</span>
            </div>
          )}
        </section>

        <button
          onClick={generateTeams}
          className="w-full mt-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
        >
          Générer les équipes <Shuffle size={20} />
        </button>

        {teams.length > 0 && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4 mt-6">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Users size={20} className="text-blue-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Équipes</h3>
            </div>
            <div className="grid gap-4">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <h4 className="text-blue-300 font-black uppercase tracking-widest text-sm mb-2">Équipe {idx + 1}</h4>
                  <ul className="space-y-1">
                    {team.map((name, i) => (
                      <li key={i} className="text-white font-bold text-sm">{name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
