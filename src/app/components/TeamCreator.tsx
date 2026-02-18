import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Users, Shuffle, Group } from "lucide-react";

interface TeamCreatorProps {
  players: { id: string; name: string }[];
  onBack: () => void;
}

  const [totalPlayers, setTotalPlayers] = useState(Math.max(3, players.length));
  const [numTeams, setNumTeams] = useState(2);
  const [playersPerTeam, setPlayersPerTeam] = useState(Math.max(2, Math.floor(totalPlayers / 2)));
  const [teams, setTeams] = useState<{ name: string; members: string[] }[]>([]);
  const [mode, setMode] = useState<'teams' | 'playersPerTeam'>('teams');

  // Synchronisation dynamique
  React.useEffect(() => {
    if (mode === 'teams') {
      // Recalcule joueurs par équipe
      setPlayersPerTeam(Math.max(1, Math.floor(totalPlayers / numTeams)));
    } else {
      // Recalcule nombre d'équipes
      setNumTeams(Math.max(1, Math.floor(totalPlayers / playersPerTeam)));
    }
  }, [totalPlayers, numTeams, playersPerTeam, mode]);

  // Calcul équilibré
  function getTeamSizes(): number[] {
    const base = Math.floor(totalPlayers / numTeams);
    const extra = totalPlayers % numTeams;
    return Array.from({ length: numTeams }, (_, i) => base + (i < extra ? 1 : 0));
  }

  function generateTeams() {
    // Génère des noms fictifs si pas assez de joueurs
    const playerNames = players.length >= totalPlayers
      ? players.slice(0, totalPlayers).map(p => p.name)
      : [
          ...players.map(p => p.name),
          ...Array.from({ length: totalPlayers - players.length }, (_, i) => `Joueur ${players.length + i + 1}`)
        ];
    const shuffled = [...playerNames].sort(() => Math.random() - 0.5);
    const sizes = getTeamSizes();
    const result: { name: string; members: string[] }[] = [];
    let idx = 0;
    for (let t = 0; t < numTeams; t++) {
      const members = [];
      for (let p = 0; p < sizes[t]; p++, idx++) {
        members.push(shuffled[idx]);
      }
      result.push({ name: `Équipe ${t + 1}`, members });
    }
    setTeams(result);
  }

  // Format lisible
  function getReadableFormat() {
    const sizes = getTeamSizes();
    if (sizes.every(s => s === sizes[0])) {
      return `${numTeams} équipes : ${sizes[0]} joueurs par équipe`;
    }
    // Affichage plage min-max
    const min = Math.min(...sizes);
    const max = Math.max(...sizes);
    if (min !== max) {
      return `${numTeams} équipes : ${min}–${max} joueurs par équipe`;
    }
    return `${numTeams} équipes : ${sizes.join(' – ')} joueurs`;
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
            <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-1">Nombre total de joueurs</label>
            <input
              type="range"
              min={3}
              max={15}
              value={totalPlayers}
              onChange={e => setTotalPlayers(parseInt(e.target.value))}
              className="slider w-full accent-blue-500"
            />
            <div className="text-slate-300 text-sm font-bold text-center">{totalPlayers} joueurs</div>
            <div className="flex gap-2 mt-4">
              <button
                className={`flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-widest border-2 ${mode === 'teams' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                onClick={() => setMode('teams')}
              >Choisir le nombre d'équipes</button>
              <button
                className={`flex-1 py-2 rounded-xl font-black text-xs uppercase tracking-widest border-2 ${mode === 'playersPerTeam' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                onClick={() => setMode('playersPerTeam')}
              >Choisir joueurs par équipe</button>
            </div>
            {mode === 'teams' ? (
              <>
                <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-1 mt-4">Nombre d'équipes</label>
                <input
                  type="range"
                  min={1}
                  max={totalPlayers}
                  value={numTeams}
                  onChange={e => setNumTeams(parseInt(e.target.value))}
                  className="slider w-full accent-blue-500"
                />
                <div className="text-slate-300 text-sm font-bold text-center">{numTeams} équipes</div>
              </>
            ) : (
              <>
                <label className="text-slate-400 text-xs uppercase tracking-widest font-black mb-1 mt-4">Joueurs par équipe</label>
                <input
                  type="range"
                  min={1}
                  max={totalPlayers}
                  value={playersPerTeam}
                  onChange={e => setPlayersPerTeam(parseInt(e.target.value))}
                  className="slider w-full accent-blue-500"
                />
                <div className="text-slate-300 text-sm font-bold text-center">{playersPerTeam} joueurs/équipe</div>
              </>
            )}
            <div className="mt-4 text-blue-300 font-bold text-center text-sm">
              {getReadableFormat()}
            </div>
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
                  <h4 className="text-lg font-black text-blue-400 mb-2">{team.name} ({team.members.length} joueurs)</h4>
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
