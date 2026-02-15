import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const projectId = Deno.env.get("SUPABASE_URL")?.split(".")[0].split("//")[1];
const routePrefix = "/make-supabase-0cd99078";

app.use("*", logger(console.log));
app.use("*", cors());

// --- MISSIONS DATA ---
const DINER_MISSIONS = [
  "Dire 'C'est pas faux' 3 fois dans la conversation.",
  "Toucher ton lobe d'oreille gauche pendant 10 secondes.",
  "Demander l'heure à quelqu'un qui a déjà une montre visible.",
  "Échanger discrètement ton verre avec celui de ton voisin.",
  "Faire un compliment très spécifique sur les chaussures de quelqu'un.",
  "Parler d'un voyage imaginaire en Islande pendant 30 secondes.",
  "Boire une gorgée dès que quelqu'un rit.",
  "Utiliser un mot très compliqué (ex: 'équivoque', 'pléthore').",
  "S'étirer bruyamment au milieu d'une phrase.",
  "Replacer sa chaise 3 fois de suite.",
  "Dire 'Miam' de façon un peu trop enthousiaste.",
  "Toucher ton nez avec ton index quand quelqu'un dit ton nom.",
  "Demander du sel même si le plat n'est pas encore servi.",
  "Regarder fixement un point derrière quelqu'un pendant 5 secondes.",
  "Changer de sujet brusquement pour parler de dinosaures.",
  "Répéter le dernier mot de la phrase de ton voisin.",
  "Essuyer ton front avec ta serviette toutes les minutes pendant 3 min.",
  "Toquer discrètement sous la table et demander 'C'est qui ?'.",
  "Faire semblant d'avoir un hoquet une seule fois.",
  "Dire 'Ah, classique...' après que quelqu'un ait fini de parler."
];

function generateCode() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

// --- ROUTES ---

// Create Lobby
app.post(`${routePrefix}/create-lobby`, async (c) => {
  const { hostName } = await c.req.json();
  const code = generateCode();
  const playerId = crypto.randomUUID();

  const lobby = {
    code,
    status: 'waiting',
    createdAt: Date.now(),
  };

  const players = [
    { id: playerId, name: hostName, isHost: true, score: 0 }
  ];

  await kv.set(`lobby:${code}`, lobby);
  await kv.set(`lobby:${code}:players`, players);

  return c.json({ code, playerId, players });
});

// Join Lobby
app.post(`${routePrefix}/join-lobby`, async (c) => {
  const { code, name } = await c.req.json();
  const lobbyCode = code.toUpperCase();
  
  const lobby = await kv.get(`lobby:${lobbyCode}`);
  if (!lobby) return c.json({ error: "Code invalide" }, 404);
  if (lobby.status !== 'waiting') return c.json({ error: "Partie déjà commencée" }, 400);

  const players = await kv.get(`lobby:${lobbyCode}:players`) || [];
  if (players.find(p => p.name === name)) return c.json({ error: "Nom déjà pris" }, 400);

  const playerId = crypto.randomUUID();
  players.push({ id: playerId, name, isHost: false, score: 0 });

  await kv.set(`lobby:${lobbyCode}:players`, players);

  return c.json({ code: lobbyCode, playerId, players });
});

// Get Lobby Status (Polling)
app.get(`${routePrefix}/lobby/:code`, async (c) => {
  const code = c.req.param("code").toUpperCase();
  const lobby = await kv.get(`lobby:${code}`);
  const players = await kv.get(`lobby:${code}:players`);
  const gameData = await kv.get(`lobby:${code}:game`) || {};

  if (!lobby) return c.json({ error: "Lobby non trouvé" }, 404);

  return c.json({ lobby, players, gameData });
});

// Start Game
app.post(`${routePrefix}/start-game`, async (c) => {
  const { code, playerId } = await c.req.json();
  const lobby = await kv.get(`lobby:${code}`);
  const players = await kv.get(`lobby:${code}:players`);

  const player = players.find(p => p.id === playerId);
  if (!player?.isHost) return c.json({ error: "Seul l'hôte peut lancer" }, 403);

  lobby.status = 'playing';
  await kv.set(`lobby:${code}`, lobby);

  // Use a map to store missions for faster retrieval and consistency
  const playerMissions: Record<string, any> = {};
  
  // Initialize first mission for everyone
  for (const p of players) {
    const missionText = DINER_MISSIONS[Math.floor(Math.random() * DINER_MISSIONS.length)];
    const missionData = {
      text: missionText,
      status: 'active',
      startTime: Date.now(),
      history: []
    };
    await kv.set(`lobby:${code}:mission:${p.id}`, missionData);
  }

  return c.json({ success: true });
});

// Get My Mission
app.get(`${routePrefix}/mission/:code/:playerId`, async (c) => {
  const code = c.req.param("code").toUpperCase();
  const playerId = c.req.param("playerId");
  const mission = await kv.get(`lobby:${code}:mission:${playerId}`);
  return c.json(mission || { error: "Pas de mission" });
});

// Success Mission
app.post(`${routePrefix}/mission-success`, async (c) => {
  const { code, playerId } = await c.req.json();
  const mission = await kv.get(`lobby:${code}:mission:${playerId}`);
  const players = await kv.get(`lobby:${code}:players`);
  
  if (mission.status === 'active') {
    mission.status = 'success';
    // Add to history for "Cramée" later
    mission.history.push({ text: mission.text, timestamp: Date.now(), status: 'success' });
    
    // Pick new mission
    const nextMission = DINER_MISSIONS[Math.floor(Math.random() * DINER_MISSIONS.length)];
    mission.text = nextMission;
    mission.status = 'active';
    mission.startTime = Date.now();

    // Update player score (+1 for success)
    const pIdx = players.findIndex(p => p.id === playerId);
    players[pIdx].score += 1;

    await kv.set(`lobby:${code}:mission:${playerId}`, mission);
    await kv.set(`lobby:${code}:players`, players);
  }

  return c.json({ success: true, mission });
});

// Skip Mission
app.post(`${routePrefix}/mission-skip`, async (c) => {
  const { code, playerId } = await c.req.json();
  const mission = await kv.get(`lobby:${code}:mission:${playerId}`);
  
  if (mission.status === 'active') {
    const elapsed = Date.now() - mission.startTime;
    if (elapsed < 3 * 60 * 1000) return c.json({ error: "Attends 3 minutes !" }, 400);

    mission.history.push({ text: mission.text, timestamp: Date.now(), status: 'skipped' });
    
    const nextMission = DINER_MISSIONS[Math.floor(Math.random() * DINER_MISSIONS.length)];
    mission.text = nextMission;
    mission.startTime = Date.now();

    await kv.set(`lobby:${code}:mission:${playerId}`, mission);
  }

  return c.json({ success: true, mission });
});

// Catch (Cramé)
app.post(`${routePrefix}/mission-catch`, async (c) => {
  const { code, victimId, catcherId, historyIndex } = await c.req.json();
  const victimMission = await kv.get(`lobby:${code}:mission:${victimId}`);
  const players = await kv.get(`lobby:${code}:players`);

  if (victimMission.history[historyIndex].status === 'success') {
    // Change status to caught
    victimMission.history[historyIndex].status = 'caught';
    victimMission.history[historyIndex].caughtBy = catcherId;

    // Update scores: victim -1, catcher +1
    const vIdx = players.findIndex(p => p.id === victimId);
    const cIdx = players.findIndex(p => p.id === catcherId);
    
    players[vIdx].score -= 1;
    players[cIdx].score += 1;

    await kv.set(`lobby:${code}:mission:${victimId}`, victimMission);
    await kv.set(`lobby:${code}:players`, players);
  }

  return c.json({ success: true });
});

// End Game
app.post(`${routePrefix}/end-game`, async (c) => {
  const { code, playerId } = await c.req.json();
  const players = await kv.get(`lobby:${code}:players`);
  const lobby = await kv.get(`lobby:${code}`);

  const player = players.find(p => p.id === playerId);
  if (!player?.isHost) return c.json({ error: "Seul l'hôte peut arrêter" }, 403);

  lobby.status = 'finished';
  await kv.set(`lobby:${code}`, lobby);

  return c.json({ success: true });
});

Deno.serve(app.fetch);
