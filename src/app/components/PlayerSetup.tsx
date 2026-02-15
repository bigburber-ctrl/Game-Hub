import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Player } from "@/app/App";
import { Plus, Trash2, User, ChevronLeft, Pencil, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface PlayerSetupProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onBack: () => void;
}

export function PlayerSetup({ players, setPlayers, onBack }: PlayerSetupProps) {
  const [newName, setNewName] = useState("");
  const nameInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 8 },
    })
  );

  const addPlayer = () => {
    if (!newName.trim()) return;
    if (players.length >= 15) {
      toast.error("Maximum 15 joueurs");
      return;
    }
    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName.trim(),
      score: 0,
    };
    setPlayers([...players, newPlayer]);
    setNewName("");
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayerName = (id: string, name: string) => {
    setPlayers(players.map((p) => (p.id === id ? { ...p, name } : p)));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    setPlayers((prevPlayers) => {
      const oldIndex = prevPlayers.findIndex((player) => player.id === active.id);
      const newIndex = prevPlayers.findIndex((player) => player.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prevPlayers;
      return arrayMove(prevPlayers, oldIndex, newIndex);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col flex-1 h-full"
    >
      <header className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold uppercase tracking-tight italic">
          Gérer les <span className="text-purple-500">Joueurs</span>
        </h1>
      </header>

      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nom du joueur..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addPlayer()}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
          <button
            onClick={addPlayer}
            className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors active:scale-95"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 max-h-[60vh]">
        {players.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <User size={48} className="mx-auto mb-4 opacity-20" />
            <p>Ajoutez au moins 1 joueurs pour commencer</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={players.map((player) => player.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {players.map((player, index) => (
                  <PlayerRow
                    key={player.id}
                    player={player}
                    index={index}
                    nameInputRefs={nameInputRefs}
                    removePlayer={removePlayer}
                    updatePlayerName={updatePlayerName}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={onBack}
          disabled={players.length < 1}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          Valider la Liste
        </button>
        <p className="text-center text-slate-500 text-xs mt-4">
          Les joueurs sont automatiquement sauvegardés sur cet appareil.
        </p>
      </div>
    </motion.div>
  );
}

interface PlayerRowProps {
  player: Player;
  index: number;
  nameInputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
}

function PlayerRow({
  player,
  index,
  nameInputRefs,
  removePlayer,
  updatePlayerName,
}: PlayerRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: player.id });

  const style: React.CSSProperties = {
    transform: isDragging ? CSS.Transform.toString(transform) : undefined,
    transition: isDragging ? transition : undefined,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-3 bg-slate-800 p-2 pl-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
    >
      <span className="text-slate-500 font-mono text-sm w-4">{index + 1}</span>
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className="p-1 text-slate-500 hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none"
        aria-label={`Déplacer ${player.name}`}
      >
        <GripVertical size={16} />
      </button>
      <input
        type="text"
        value={player.name}
        ref={(element) => {
          nameInputRefs.current[player.id] = element;
        }}
        onChange={(e) => updatePlayerName(player.id, e.target.value)}
        className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-white font-medium"
      />
      <button
        onClick={() => nameInputRefs.current[player.id]?.focus()}
        className="p-2 text-slate-500 hover:text-sky-400 transition-colors"
        aria-label={`Modifier le nom de ${player.name}`}
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={() => removePlayer(player.id)}
        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
