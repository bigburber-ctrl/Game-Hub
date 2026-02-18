import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Group } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

interface TeamCreatorProps {
  players: Player[];
  onBack: () => void;
}

export function TeamCreator({ players, onBack }: TeamCreatorProps) {
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(Math.ceil(players.length / 2));
  const [teams, setTeams] = useState<Player[][]>([]);
  const [showTeams, setShowTeams] = useState(false);

  const maxTeams = Math.max(2, Math.floor(players.length / 2));
  const minPlayersPerTeam = 1;
  const maxPlayersPerTeam = players.length;

  const handleGenerateTeams = () => {
    // Shuffle players
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    let result: Player[][] = [];
    if (playersPerTeam * numTeams > players.length) {
      // Adjust to fit
      setPlayersPerTeam(Math.floor(players.length / numTeams));
    }
    for (let i = 0; i < numTeams; i++) {
      result.push([]);
    }
    let idx = 0;
    for (const player of shuffled) {
      result[idx % numTeams].push(player);
      idx++;
    }
    setTeams(result);
    setShowTeams(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
      </header>

      {!showTeams ? (
        <div className="space-y-6 flex-1">
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Group size={20} className="text-blue-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">
                Nombre d'équipes
              </h3>
            </div>
            <input
              type="range"
              min={2}
              max={maxTeams}
              value={numTeams}
              onChange={e => setNumTeams(parseInt(e.target.value))}
              className="slider w-full accent-blue-500"
            />
            <div className="text-blue-300 text-sm font-bold text-center">
              {numTeams} équipe{numTeams > 1 ? "s" : ""}
            </div>
          </section>

          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Users size={20} className="text-blue-400" />
              <h3 className="font-bold uppercase text-xs tracking-widest">
                Joueurs par équipe
              </h3>
            </div>
            <input
              type="range"
              min={minPlayersPerTeam}
              max={maxPlayersPerTeam}
              value={playersPerTeam}
              onChange={e => setPlayersPerTeam(parseInt(e.target.value))}
              className="slider w-full accent-blue-500"
            />
            <div className="text-blue-300 text-sm font-bold text-center">
              {playersPerTeam} joueur{playersPerTeam > 1 ? "s" : ""} par équipe
            </div>
          </section>

          <button
            onClick={handleGenerateTeams}
            className="w-full mt-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
          >
            Générer les équipes
          </button>
        </div>
      ) : (
        <div className="space-y-6 flex-1">
          <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 space-y-4">
            <h3 className="font-bold uppercase text-xs tracking-widest text-blue-400 mb-4">
              Équipes générées
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {teams.map((team, idx) => (
                <div key={idx} className="bg-blue-700/10 border border-blue-700 rounded-xl p-4">
                  <h4 className="text-lg font-black text-blue-500 mb-2">Équipe {idx + 1}</h4>
                  <ul className="space-y-1">
                    {team.map(player => (
                      <li key={player.id} className="text-white font-bold">
                        {player.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <button
            onClick={() => setShowTeams(false)}
            className="w-full mt-6 py-4 bg-blue-600 text-white font-black uppercase rounded-2xl active:scale-95 transition-all"
          >
            Refaire un tirage
          </button>
        </div>
      )}
    </motion.div>
  );
}
