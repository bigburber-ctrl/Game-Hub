import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
  // Système de triage de mission supprimé
    try {
      localStorage.setItem(LAST_GAME_CONFIGS_STORAGE_KEY, JSON.stringify(lastGameConfigs));
    } catch {
      // ignore
    }
  }, [lastGameConfigs]);

  const selectGame = (game: GameType) => {
    const minRequired = GAME_METADATA[game].minPlayers;
    if (players.length < minRequired) {
      toast.error(`Ce jeu nécessite au moins ${minRequired} joueurs !`);
      return;
    }
    
    // Pour Dîner de l'Extrême, aller directement au jeu
    if (game === "diner-extreme") {
      setGameState("diner-extreme");
      return;
    }
    
    setActiveGame(game);
    setGameState("settings");
  };

  const startGame = (config: GameConfig) => {
    setGameConfig(config);
    if (activeGame) {
      setLastGameConfigs((prev) => ({ ...prev, [activeGame]: config }));
    }
    setGameState("playing");
  };

  const resetToHome = () => {
    setGameState("home");
    setActiveGame(null);
    setGameConfig(null);
  };

  const normalizeMission = (value: string) => value.replace(/\s+/g, " ").trim();

  const persistCurrentDraftToHistory = (nextDraft: string) => {
    if (missionHistoryIndex < 0) return;
    const item = missionHistoryRef.current[missionHistoryIndex];
    if (!item) return;
    item.draft = nextDraft;
  };

  const getFallbackMissionsPool = () => {
    if (fallbackPoolRef.current) return fallbackPoolRef.current;
  };

  const resetMissionDeck = () => {
    const pool = getFallbackMissionsPool();
    missionDeckRef.current = [...pool];
    setMissionReviewTotal(pool.length);
    setMissionReviewCurrent(0);
    missionHistoryRef.current = [];
    setMissionHistoryIndex(-1);
    setMissionGenerated("");
    setMissionDraft("");
  };

  const drawNextMissionFromPool = () => {
    // Toujours sauvegarder la version modifiée avant de changer de mission
    persistCurrentDraftToHistory(missionDraft);

    const pool = getFallbackMissionsPool();
    if (missionDeckRef.current.length === 0) {
      missionDeckRef.current = [...pool];
      setMissionReviewTotal(pool.length);
      setMissionReviewCurrent(0);
      missionHistoryRef.current = [];
      setMissionHistoryIndex(-1);
    }

    // Si on est revenu en arrière, avancer dans l'historique au lieu de "consommer" une nouvelle mission
    if (missionHistoryIndex < missionHistoryRef.current.length - 1) {
      const nextIndex = missionHistoryIndex + 1;
      setMissionHistoryIndex(nextIndex);
      setMissionReviewTotal(pool.length);
      setMissionReviewCurrent(nextIndex + 1);
      const nextFromHistory = missionHistoryRef.current[nextIndex]?.draft ?? "";
      setMissionGenerated(nextFromHistory);
      setMissionDraft(nextFromHistory);
      return;
    }

    const next = missionDeckRef.current.shift() ?? "";
    const id = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
    missionHistoryRef.current.push({ id, draft: next });
    const nextIndex = missionHistoryRef.current.length - 1;
    setMissionHistoryIndex(nextIndex);
    setMissionReviewTotal(pool.length);
    setMissionReviewCurrent(nextIndex + 1);
    setMissionGenerated(next);
    setMissionDraft(next);
  };

  // Système de triage de mission supprimé

  return (
    <div className="min-h-dvh bg-[#0f172a] text-slate-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Toaster position="top-center" expand={false} richColors />
      


      <div
        className="mx-auto min-h-dvh flex flex-col p-4 relative max-w-md"
      >
        <AnimatePresence mode="wait">
          {gameState === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col gap-8 pt-12"
            >
              <div className="text-center space-y-2 relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="inline-flex p-4 rounded-3xl bg-purple-600/20 text-purple-400 mb-4"
                >
                  <Gamepad2 size={48} />
                </motion.div>
                <div className="relative flex items-center justify-center">
                  <h1 className="text-4xl font-black tracking-tight text-white uppercase italic flex items-center">
                    <span>Game <span className="text-purple-500">Hub</span></span>
                  </h1>
                  <button
                    onClick={() => setShowOptions(true)}
                    className="absolute -top-35 right-0 w-10 h-10 flex items-center justify-center rounded-md bg-slate-800/50 border border-slate-700/50 text-white font-bold shadow-lg hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                    aria-label={showOptions ? 'Fermer les options' : 'Ouvrir les options'}
                    aria-expanded={showOptions}
                  >
                    <span className="text-lg">➕</span>
                  </button>
                </div>
                <p className="text-slate-400 text-sm">Le multijoueur local ultime</p>
              </div>

              {/* Overlay options Plus */}
              {/* Fond flou et sombre, toujours visible pendant la transition */}
              <BlurPortal show={showOptions} onClick={() => setShowOptions(false)} />
              <MenuPlusPortal show={showOptions}>
                <div className="relative bg-slate-900 border-2 border-purple-700/40 rounded-2xl shadow-2xl p-8 w-full max-w-xs flex flex-col gap-6 items-center">
                  <button
                    onClick={() => setShowOptions(false)}
                    className="absolute top-3 left-3 p-2 rounded-full bg-transparent hover:bg-slate-700 text-slate-400 hover:text-white transition flex items-center justify-center"
                    aria-label="Retour"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <div className="flex flex-col w-full mt-6 gap-3">
                    <div className="w-full text-center mb-2">
                      <span className="text-lg font-black text-white uppercase tracking-tight italic">Plus</span>
                    </div>
                    <button
                      onClick={() => {
                        if (players.length < 3) {
                          toast.error("Il faut au moins 3 joueurs !");
                          return;
                        }
                        setShowOptions(false);
                        setTimeout(() => setGameState("custom-impostor"), 250);
                      }}
                      className={`w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all ${
                        players.length < 3
                          ? "bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed grayscale"
                          : "bg-purple-600/10 border-purple-500/20 text-purple-400 hover:bg-purple-600/20 active:scale-95 shadow"
                      }`}
                      disabled={players.length < 3}
                    >
                      🕵️ Jeu D'IMPOSTEUR PERSONNALISÉ
                    </button>
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        setTimeout(() => setGameState("fortune-wheel"), 250);
                      }}
                      className="w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all bg-slate-800/60 border-slate-700/30 text-slate-200 hover:bg-slate-700/60 active:scale-95 shadow"
                    >
                      🎡 Roue de la chance
                    </button>
                    <button
                      onClick={() => {
                        setShowOptions(false);
                        setTimeout(() => setGameState("team-creator"), 250);
                      }}
                      className="w-full py-4 border font-black text-[12px] uppercase tracking-[0.2em] rounded-xl transition-all bg-blue-600/10 border-blue-500/20 text-blue-400 hover:bg-blue-600/20 active:scale-95 shadow"
                    >
                      👥 Créateur d'équipe
                    </button>
                  </div>
                </div>
              </MenuPlusPortal>
              {/* Bloc supprimé : menu Plus géré par MenuPlusPortal */}

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setGameState("setup")}
                  className="w-full py-6 px-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-700 transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
                >
                  <Users size={16} className="text-purple-400" />
                  Gérer les Joueurs ({players.length})
                </button>
              </div>

              {players.length < 3 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-center">
                  <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
                    ⚠️ Ajoutez au moins 3 joueurs pour débloquer les jeux
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                <button
                  onClick={() => selectGame("trapped-round")}
                  disabled={players.length < GAME_METADATA["trapped-round"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-purple-900/20 ${
                    players.length < GAME_METADATA["trapped-round"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">🎭 Mission Comportementale</h2>
                      <p className="text-purple-100/70 text-sm leading-tight max-w-[800px]">
                        Les imposteurs doivent accomplir des missions comportementales secrètes pendant que les innocents essaient de les identifier.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("trouve-regle")}
                  disabled={players.length < GAME_METADATA["trouve-regle"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-left transition-all shadow-lg shadow-blue-700/40 ${
                    players.length < GAME_METADATA["trouve-regle"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">📏 TROUVE LA RÈGLE</h2>
                      <p className="text-blue-100/80 text-sm leading-tight max-w-[800px]">
                        Suivez une règle secrète… pendant que les enquêteurs essaient de la découvrir.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("word-impostor")}
                  disabled={players.length < GAME_METADATA["word-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-emerald-900/20 ${
                    players.length < GAME_METADATA["word-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">🕵️ Qui est l'Imposteur ?</h2>
                      <p className="text-emerald-100/70 text-sm leading-tight max-w-[800px]">
                        Trouvez qui n'a pas le même mot que les autres en écoutant les indices donnés par chaque joueur.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("question-impostor")}
                  disabled={players.length < GAME_METADATA["question-impostor"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-amber-900/20 ${
                    players.length < GAME_METADATA["question-impostor"].minPlayers 
                      ? "opacity-50 grayscale cursor-not-allowed" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">❓ LA QUESTION DIFFÉRENTE</h2>
                      <p className="text-amber-100/70 text-sm leading-tight max-w-[800px]">
                        Tout le monde répond à une question, mais l'imposteur a une question légèrement différente...
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectGame("diner-extreme")}
                  disabled={players.length < GAME_METADATA["diner-extreme"].minPlayers}
                  className={`group relative overflow-hidden bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-2xl text-left transition-all shadow-lg shadow-orange-900/20 ${
                    players.length < GAME_METADATA["diner-extreme"].minPlayers 
                      ? "opacity-50 grayscale" 
                      : "hover:scale-[1.02] active:scale-95"
                  }`}
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-wide italic">
                        🍽️ DÎNER DE L'EXTRÊME
                        <span className="ml-2 text-[10px] font-black tracking-widest text-white/70 normal-case">multi-cell</span>
                      </h2>
                      <p className="text-orange-100/70 text-sm leading-tight max-w-[800px]">
                        Accomplissez des missions secrètes pendant le repas, mais attention à ne pas vous faire crâmer!
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {gameState === "setup" && (
            <PlayerSetup
              players={players}
              setPlayers={setPlayers}
              onBack={resetToHome}
            />
          )}

          {/* Système de triage de mission supprimé */}

          {gameState === "diner-extreme" && (
            <DinerExtreme
              players={players}
              onBack={resetToHome}
            />
          )}

          {gameState === "settings" && activeGame !== null && (
            <GameSettings
              key={activeGame}
              gameType={activeGame}
              playersCount={players.length}
              onBack={resetToHome}
              onStart={startGame}
              initialConfig={lastGameConfigs[activeGame]}
            />
          )}

          {gameState === "playing" && activeGame === "trapped-round" && gameConfig && (
            <TrappedRound
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "word-impostor" && gameConfig && (
            <WordImpostor
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "question-impostor" && gameConfig && (
            <QuestionImpostor
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "playing" && activeGame === "trouve-regle" && gameConfig && (
            <TrouveRegle
              players={players}
              config={gameConfig}
              onBack={resetToHome}
            />
          )}

          {gameState === "custom-impostor" && (
            <CustomImpostor
              players={players}
              onBack={resetToHome}
            />
          )}

          {gameState === "fortune-wheel" && (
            <RoueDeLaChance onBack={resetToHome} />
          )}
          {gameState === "team-creator" && (
            <TeamCreator players={players} onBack={resetToHome} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
