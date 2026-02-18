import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Shuffle, Group } from "lucide-react";

interface TeamCreatorProps {
  players: { id: string; name: string }[];
  onBack: () => void;
}

export function TeamCreator({ players, onBack }: TeamCreatorProps) {
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(Math.max(2, Math.floor(players.length / 2)));
  const [teams, setTeams] = useState<{ name: string; members: string[] }[]>([]);

  function generateTeams() {
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const result: { name: string; members: string[] }[] = [];
    let idx = 0;
    for (let t = 0; t < numTeams; t++) {
      const members = [];
      for (let p = 0; p < playersPerTeam && idx < shuffled.length; p++, idx++) {
        members.push(shuffled[idx].name);
      }
      result.push({ name: `Équipe ${t + 1}`, members });
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
            Créateur <span className="text-blue-500">d'équipe</span>
          </h1>
        </div>
      </header>

      <div className="space-y-6 flex-1 overflow-y-auto pb-8 pr-1">
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
          <div className="flex items-center gap-3 text-blue-400 mb-2">
            <Group size={20} className="text-blue-400" />
            <h3 className="font-bold uppercase text-xs tracking-widest">Paramètres</h3>
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-1">Nombre d'équipes</label>
            <input
              type="range"
              min={2}
              max={Math.max(2, Math.floor(players.length / 2))}
              value={numTeams}
              onChange={e => setNumTeams(parseInt(e.target.value))}
              className="slider w-full accent-blue-500"
            />
            <div className="text-slate-300 text-sm font-bold text-center">{numTeams} équipes</div>
            <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-1">Joueurs par équipe</label>
            <input
              type="range"
              min={2}
              max={Math.max(2, Math.floor(players.length / numTeams))}
              value={playersPerTeam}
              onChange={e => setPlayersPerTeam(parseInt(e.target.value))}
              className="slider w-full accent-blue-500"
            />
            <div className="text-slate-300 text-sm font-bold text-center">{playersPerTeam} joueurs/équipe</div>
          </div>
        </section>
        <button
          onClick={generateTeams}
          className="w-full mt-6 py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
        >
          Générer les équipes <Shuffle size={20} />
        </button>
        {teams.length > 0 && (
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 mt-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Users size={20} className="text-blue-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">Équipes générées</h3>
            </div>
            <div className="space-y-4">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-slate-900 rounded-xl border border-slate-700 p-4">
                  <h4 className="text-lg font-black text-blue-400 mb-2">{team.name}</h4>
                  <ul className="text-white font-bold space-y-1">
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
