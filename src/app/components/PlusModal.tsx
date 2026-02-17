import React, { useState } from "react";

interface PlusModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (choice: string) => void;
  onAddChoice: (choice: string) => void;
  choices: string[];
}

export const PlusModal: React.FC<PlusModalProps> = ({ open, onClose, onSelect, onAddChoice, choices }) => {
  const [newChoice, setNewChoice] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl"
          onClick={onClose}
          aria-label="Fermer"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-center text-purple-700">Menu Plus</h2>
        <div className="flex flex-col gap-3 mb-4">
          {choices.map((choice) => (
            <button
              key={choice}
              onClick={() => onSelect(choice)}
              className="w-full py-3 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold transition"
            >
              {choice}
            </button>
          ))}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (newChoice.trim()) {
              onAddChoice(newChoice.trim());
              setNewChoice("");
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newChoice}
            onChange={e => setNewChoice(e.target.value)}
            placeholder="Ajouter un choix..."
            className="flex-1 border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};
