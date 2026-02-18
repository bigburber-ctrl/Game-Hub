import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Shuffle, Group } from "lucide-react";

interface TeamCreatorProps {
  players: { id: string; name: string }[];
  onBack: () => void;
}

export function TeamCreator({ players, onBack }: TeamCreatorProps) {
  const totalPlayers = players.length;
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(Math.max(1, Math.floor(totalPlayers / 2)));
  const [teams, setTeams] = useState<{ name: string; members: string[] }[]>([]);

  // Calcul dynamique
  function getDistribution(tp: number, nt: number): number[] {
    const base = Math.floor(tp / nt);
    const extra = tp % nt;
    return Array.from({ length: nt }, (_, i) => base + (i < extra ? 1 : 0));
  }

  // Quand totalPlayers change, recalcule les sliders
  React.useEffect(() => {
    setPlayersPerTeam(Math.max(1, Math.floor(totalPlayers / numTeams)));
  }, [numTeams, totalPlayers]);

  React.useEffect(() => {
    setNumTeams(Math.max(1, Math.floor(totalPlayers / playersPerTeam)));
  }, [playersPerTeam, totalPlayers]);

  // Génération des équipes
  function generateTeams() {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const dist = getDistribution(totalPlayers, numTeams);
    let idx = 0;
    const result: { name: string; members: string[] }[] = [];
    for (let t = 0; t < numTeams; t++) {
      const members = [];
      for (let p = 0; p < dist[t] && idx < shuffled.length; p++, idx++) {
        members.push(shuffled[idx]?.name ?? `Joueur ${idx + 1}`);
      }
      result.push({ name: `Équipe ${t + 1}`, members });
    }
    setTeams(result);
  }

  //

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col flex-1">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-400 hover:bg-slate-800 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-black uppercase italic tracking-tight">
            Créateur <span className="text-blue-500">d'équipe</span>
          </h1>
        </div>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto pb-8 pr-1">
        {/* Nouvelle section paramètres */}
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mb-6">
          <div className="flex items-center gap-6 justify-center">
            <div className="flex flex-col items-center">
              <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-2">Nombre d'équipes</label>
              <select
                className="px-4 py-2 rounded-xl font-bold text-xs border bg-slate-900 text-blue-400 border-slate-700"
                value={numTeams}
                onChange={e => {
                  const n = parseInt(e.target.value);
                  setNumTeams(n);
                  setPlayersPerTeam(Math.max(1, Math.floor(totalPlayers / n)));
                }}
              >
                {Array.from({ length: totalPlayers }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-2">Joueurs par équipe</label>
              <select
                className="px-4 py-2 rounded-xl font-bold text-xs border bg-slate-900 text-blue-400 border-slate-700"
                value={playersPerTeam}
                onChange={e => {
                  const n = parseInt(e.target.value);
                  setPlayersPerTeam(n);
                  setNumTeams(Math.max(1, Math.floor(totalPlayers / n)));
                }}
              >
                {Array.from({ length: totalPlayers }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Affichage de la répartition */}
          <div className="mt-6 text-center text-blue-300 font-bold text-lg">
            {(() => {
              const min = Math.floor(totalPlayers / numTeams);
              const max = Math.ceil(totalPlayers / numTeams);
              if (min === max) {
                return `${numTeams} équipes : ${min} joueurs par équipe`;
              } else {
                return `${numTeams} équipes : ${min}–${max} joueurs par équipe`;
              }
            })()}
          </div>
        </section>

        <button
          onClick={generateTeams}
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3 mb-6"
        >
          Générer les équipes <Shuffle size={20} />
        </button>

        {/* Section équipes générées en grille responsive */}
        {teams.length > 0 && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mt-6">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Users size={20} className="text-blue-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Équipes générées</h3>
            </div>
            <div
              className={
                teams.length <= 4
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                  : teams.length <= 6
                  ? "grid grid-cols-2 md:grid-cols-3 gap-4"
                  : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              }
            >
              {teams.map((team, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col">
                  <h4 className="text-lg font-black text-blue-400 mb-2 text-center">{team.name}</h4>
                  <ul className="text-white font-bold space-y-1 text-center">
                    {team.members.map((member, i) => (
                      <li key={i}>• {member}</li>
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
