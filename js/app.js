/* ============================================================
   OPPIDUM BET — Nuova Stagione Serie C (Girone 6 - C.R. Sardegna)
   - Girone 6 Ufficiale (10 squadre, calendario in uscita)
   - Dati scorsa stagione mantenuti SOLO nel motore AI interno
   - Login semplice con partenza a 100 Crediti per tutti
   - Rosa Nuova Stagione (con Atzeni, Faret, Pittotti e Olla;
     esclusi Fortini e Frau)
   - Gestione Presenze per partita + Classifica Scommettitori
   ============================================================ */

const STORAGE_KEYS = {
  USERS: "oppidum_season_users_v6",
  CURRENT_USER: "oppidum_season_current_user_v6",
  BETS: "oppidum_season_bets_v6",
  MATCHES: "oppidum_season_matches_v6",
  APPEARANCES_REF: "oppidum_season_hist_apps_v6"
};

const STARTING_CREDITS = 100;

// ============================================================
// 1. SOCIETÀ DEL CAMPIONATO & RIFERIMENTO AI INTERNO
// ============================================================
const GIRONE_6_TEAMS = [
  "ANACONDA PALLANUOTO",
  "ANTARES N e PN LATINA",
  "AQUADEMIA",
  "BABEL",
  "CENTUMCELLAE PALLANUOTO",
  "LAZIO PALLANUOTO",
  "OPPIDUM SPORT CAGLIARI",
  "R.N. CAGLIARI",
  "VILLA AURELIA S.C.",
  "ZERO9 TEAM"
];

const HISTORICAL_AI_REFERENCE = {
  // Parametri di forza calcolati sulle 18 giornate della scorsa stagione + Girone 6
  teamsStrength: {
    "Bellator Frusino":        { gf: 277, ga: 185, note: "Avversaria di vertice · Attacco molto prolifico" },
    "De Virtute Roma":         { gf: 263, ga: 192, note: "Formazione capitolina solida e ben strutturata" },
    "RN Cagliari":             { gf: 214, ga: 162, note: "Derby cittadino di Cagliari · Sfida ad alta intensità" },
    "R.N. CAGLIARI":           { gf: 214, ga: 162, note: "Derby cittadino di Cagliari · Sfida ad alta intensità" },
    "Castelli Romani":         { gf: 217, ga: 207, note: "Compagine laziale dal ritmo elevato" },
    "Aqvaroma":                { gf: 207, ga: 196, note: "Squadra romana ostica ed equilibrata" },
    "RN Roma Vis Nova":        { gf: 219, ga: 227, note: "Sfida aperta contro la formazione romana" },
    "Anaconda PN":             { gf: 204, ga: 210, note: "Incontro equilibrato e combattuto su ogni pallone" },
    "ANACONDA PALLANUOTO":     { gf: 204, ga: 210, note: "Incontro equilibrato e combattuto su ogni pallone" },
    "Imperium":                { gf: 179, ga: 220, note: "Match importante contro la formazione laziale" },
    "Promogest Quartu SE":     { gf: 172, ga: 285, note: "Derby sardo · Sfida sentita in vasca" },
    "LAZIO PALLANUOTO":        { gf: 225, ga: 185, note: "Formazione capitolina storica e organizzata" },
    "CENTUMCELLAE PALLANUOTO": { gf: 218, ga: 190, note: "Compagine di Civitavecchia solida e veloce" },
    "ZERO9 TEAM":              { gf: 210, ga: 195, note: "Squadra romana dai ritmi elevati" },
    "VILLA AURELIA S.C.":      { gf: 202, ga: 198, note: "Incontro combattuto su ogni pallone" },
    "ANTARES N e PN LATINA":   { gf: 198, ga: 205, note: "Sfida ostica contro la formazione di Latina" },
    "BABEL":                   { gf: 195, ga: 208, note: "Partita aperta contro il club romano" },
    "AQUADEMIA":               { gf: 190, ga: 212, note: "Match importante per muovere la classifica" },
    "Oppidum S. Cagliari":     { gf: 149, ga: 247, note: "Oppidum Sport Cagliari · Piscina Terramaini" },
    "OPPIDUM SPORT CAGLIARI":  { gf: 149, ga: 247, note: "Oppidum Sport Cagliari · Piscina Terramaini" }
  },
  // Rosa Ufficiale Nuova Stagione (19 giocatori: 2 portieri + 17 movimento)
  roster: [
    { id: "atzeni",     name: "ATZENI",     role: "Portiere",    isGk: true,  histGoals: 0,  histApps: 18, note: "Portiere" },
    { id: "faret",      name: "FARET",      role: "Portiere",    isGk: true,  histGoals: 0,  histApps: 18, note: "Portiere" },
    { id: "melis",      name: "MELIS",      role: "Attaccante",  isGk: false, histGoals: 34, histApps: 18, note: "Attaccante" },
    { id: "piras",      name: "PIRAS",      role: "Centrovasca", isGk: false, histGoals: 24, histApps: 18, note: "Attaccante / Centrovasca" },
    { id: "de_giudici", name: "DE GIUDICI", role: "Universale",  isGk: false, histGoals: 18, histApps: 16, note: "Attaccante / Universale" },
    { id: "sacco",      name: "SACCO",      role: "Centrovasca", isGk: false, histGoals: 12, histApps: 16, note: "Centrovasca / Difensore" },
    { id: "ballestri",  name: "BALLESTRI",  role: "Centroboa",   isGk: false, histGoals: 10, histApps: 15, note: "Centroboa" },
    { id: "petretto",   name: "PETRETTO",   role: "Difensore",   isGk: false, histGoals: 7,  histApps: 15, note: "Difensore / Centrovasca" },
    { id: "erriu",      name: "ERRIU",      role: "Esterno",     isGk: false, histGoals: 6,  histApps: 14, note: "Esterno / Attaccante" },
    { id: "cannas",     name: "CANNAS",     role: "Universale",  isGk: false, histGoals: 5,  histApps: 14, note: "Universale" },
    { id: "pilia_fl",   name: "PILIA FL",   role: "Centrovasca", isGk: false, histGoals: 3,  histApps: 12, note: "Centrovasca" },
    { id: "troncia",    name: "TRONCIA",    role: "Difensore",   isGk: false, histGoals: 3,  histApps: 12, note: "Difensore" },
    { id: "pieroni",    name: "PIERONI",    role: "Esterno",     isGk: false, histGoals: 2,  histApps: 10, note: "Esterno" },
    { id: "pilia_fb",   name: "PILIA FB",   role: "Difensore",   isGk: false, histGoals: 1,  histApps: 10, note: "Difensore" },
    { id: "morzetti",   name: "MORZETTI",   role: "Universale",  isGk: false, histGoals: 0,  histApps: 8,  note: "Universale" },
    { id: "murtas",     name: "MURTAS",     role: "Universale",  isGk: false, histGoals: 0,  histApps: 8,  note: "Universale" },
    { id: "orru",       name: "ORRU'",      role: "Universale",  isGk: false, histGoals: 0,  histApps: 8,  note: "Universale" },
    { id: "pittotti",   name: "PITTOTTI",   role: "Universale",  isGk: false, histGoals: 0,  histApps: 1,  note: "Universale" },
    { id: "olla",       name: "OLLA",       role: "Universale",  isGk: false, histGoals: 0,  histApps: 0,  note: "Universale" }
  ]
};

// ---------- STATO GLOBALE ----------
let appState = {
  selectedMatchId: null,
  activeMarketCategory: "all", // all | main | scorers | gk | goliardic
  betSlip: []
};

// ---------- UTILITY ----------
function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function showToast(msg) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  }, 3400);
}

// ============================================================
// 2. SISTEMA DI LOGIN SEMPLICE & CREDITI (100 CREDITI INIZIALI)
// ============================================================
function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (raw) {
    try {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return list;
    } catch (e) {}
  }
  const initialUsers = [
    { id: "u_1", name: "Scommettitore 1", credits: 145, wins: 2, losses: 0, totalStaked: 30, totalWon: 75 },
    { id: "u_2", name: "Scommettitore 2", credits: 120, wins: 1, losses: 1, totalStaked: 25, totalWon: 45 },
    { id: "u_3", name: "Scommettitore 3", credits: 100, wins: 0, losses: 0, totalStaked: 0,  totalWon: 0  },
    { id: "u_4", name: "Scommettitore 4", credits: 90,  wins: 0, losses: 1, totalStaked: 10, totalWon: 0  },
    { id: "u_5", name: "Scommettitore 5", credits: 80,  wins: 0, losses: 1, totalStaked: 20, totalWon: 0  }
  ];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  return initialUsers;
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getCurrentUser() {
  const users = getUsers();
  const savedId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (savedId) {
    const found = users.find(u => u.id === savedId);
    if (found) return found;
  }
  return null;
}

function setCurrentUser(userId) {
  if (!userId) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, userId);
  }
  renderAuthHeader();
  renderLeaderboardTab();
}

function openLoginModal() {
  const modal = document.getElementById("loginModal");
  if (!modal) return;
  renderQuickLoginUsersList();
  modal.style.display = "flex";
  document.getElementById("loginUsernameInput")?.focus();
}

function closeLoginModal() {
  const modal = document.getElementById("loginModal");
  if (modal) modal.style.display = "none";
}

function handleSimpleLogin(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("loginUsernameInput");
  const name = (input?.value || "").trim();
  if (!name) {
    showToast("⚠️ Inserisci il tuo nome o soprannome per entrare!");
    return;
  }

  const users = getUsers();
  let user = users.find(u => u.name.toLowerCase() === name.toLowerCase());

  if (!user) {
    user = {
      id: uid("u"),
      name,
      credits: STARTING_CREDITS,
      wins: 0,
      losses: 0,
      totalStaked: 0,
      totalWon: 0
    };
    users.push(user);
    saveUsers(users);
    showToast(`🎉 Benvenuto <strong>${esc(user.name)}</strong>! Account creato con <strong>${STARTING_CREDITS} Crediti</strong> iniziali!`);
  } else {
    showToast(`👋 Bentornato <strong>${esc(user.name)}</strong>! Saldo: <strong>${user.credits} Crediti</strong>.`);
  }

  setCurrentUser(user.id);
  if (input) input.value = "";
  closeLoginModal();
}

function quickLoginAs(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) return;
  setCurrentUser(user.id);
  closeLoginModal();
  showToast(`👋 Accesso effettuato come <strong>${esc(user.name)}</strong> (${user.credits} Crediti)`);
}

function renderQuickLoginUsersList() {
  const box = document.getElementById("existingUsersQuickList");
  if (!box) return;
  const users = getUsers();
  if (!users.length) {
    box.innerHTML = "";
    return;
  }
  box.innerHTML = `
    <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">Oppure entra con un clic su un profilo già registrato:</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${users.map(u => `
        <button type="button" class="btn btn-outline btn-sm" onclick="quickLoginAs('${esc(u.id)}')">
          👤 ${esc(u.name)} <span style="color:var(--gold);margin-left:4px;">(${u.credits} Cr.)</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderAuthHeader() {
  const user = getCurrentUser();
  const container = document.getElementById("authUserWidget");
  if (!container) return;

  if (!user) {
    container.innerHTML = `
      <button type="button" class="btn btn-gold btn-sm" onclick="openLoginModal()">
        🔑 Accedi / Registrati (100 Crediti)
      </button>
    `;
  } else {
    container.innerHTML = `
      <div class="wallet-bar">
        <span style="font-weight:800;font-size:0.86rem;">👤 ${esc(user.name)}</span>
        <span class="wallet-balance">${user.credits} Crediti 🪙</span>
        <button type="button" class="btn-icon-sm" onclick="openLoginModal()" title="Cambia Utente">Cambia</button>
      </div>
    `;
  }
}

// ============================================================
// 3. MOTORE AI DI POISSON BASATO SULLO STORICO + PRESENZE
// ============================================================
function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function probToOdd(prob, margin = 1.06, minOdd = 1.12, maxOdd = 25.0) {
  const safeP = Math.max(0.025, Math.min(0.92, prob));
  const raw = 1 / (safeP * margin);
  return Number(Math.max(minOdd, Math.min(maxOdd, raw)).toFixed(2));
}

function getHistoricalAppearancesMap() {
  const raw = localStorage.getItem(STORAGE_KEYS.APPEARANCES_REF);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  const map = {};
  HISTORICAL_AI_REFERENCE.roster.forEach(p => {
    map[p.id] = p.histApps;
  });
  return map;
}

// Statistiche della NUOVA STAGIONE calcolate dalle partite giocate/refertate
function computeNewSeasonPlayerStats() {
  const matches = getSeasonMatches();
  const playedMatches = matches.filter(m => m.status === "settled");
  const histApps = getHistoricalAppearancesMap();

  return HISTORICAL_AI_REFERENCE.roster.map(p => {
    let newSeasonApps = 0;
    let newSeasonGoals = 0;

    playedMatches.forEach(m => {
      const presentIds = m.presentPlayerIds || [];
      const goalsMap = m.playerGoals || {};
      if (presentIds.includes(p.id)) {
        newSeasonApps++;
        newSeasonGoals += Number(goalsMap[p.id] || 0);
      }
    });

    return {
      ...p,
      histApps: histApps[p.id] ?? p.histApps,
      newSeasonApps,
      newSeasonGoals
    };
  });
}

function generateAiOddsForMatch(opponentName, isHome = true, boostOppidum = 1.15, presentPlayerIds = null) {
  const refTeams = HISTORICAL_AI_REFERENCE.teamsStrength;
  const oppRef = refTeams[opponentName];
  const avgLeagueGoals = 11.8;

  let lambdaOppidum = 9.6;
  let lambdaOpponent = 11.2;

  if (oppRef) {
    const rivalAtk = (oppRef.gf / 18) / avgLeagueGoals;
    const rivalDef = (oppRef.ga / 18) / avgLeagueGoals;
    lambdaOppidum = (9.4 * rivalDef) * (isHome ? 1.10 : 0.94) * boostOppidum;
    lambdaOpponent = (11.2 * rivalAtk * 0.94) * (isHome ? 0.92 : 1.07);
  } else {
    lambdaOppidum = (isHome ? 10.4 : 9.2) * boostOppidum;
    lambdaOpponent = isHome ? 9.8 : 11.0;
  }

  lambdaOppidum = Math.max(6.0, Math.min(16.5, lambdaOppidum));
  lambdaOpponent = Math.max(6.0, Math.min(17.5, lambdaOpponent));

  let pOppWin = 0, pDraw = 0, pRivWin = 0;
  for (let gUs = 0; gUs <= 26; gUs++) {
    const pUs = poissonPmf(gUs, lambdaOppidum);
    for (let gThem = 0; gThem <= 26; gThem++) {
      const pThem = poissonPmf(gThem, lambdaOpponent);
      const j = pUs * pThem;
      if (gUs > gThem) pOppWin += j;
      else if (gUs === gThem) pDraw += j;
      else pRivWin += j;
    }
  }

  pDraw = Math.max(0.09, Math.min(0.16, pDraw * 1.25));
  const rem = 1 - pDraw;
  const sumW = pOppWin + pRivWin || 1;
  pOppWin = (pOppWin / sumW) * rem;
  pRivWin = (pRivWin / sumW) * rem;

  const p1 = isHome ? pOppWin : pRivWin;
  const pX = pDraw;
  const p2 = isHome ? pRivWin : pOppWin;

  const totalLine = Math.round(lambdaOppidum + lambdaOpponent) - 0.5;
  const oppidumLine = Math.round(lambdaOppidum) - 0.5;
  const opponentLine = Math.round(lambdaOpponent) - 0.5;
  const handicapLine = Number((Math.round((lambdaOpponent - lambdaOppidum) * 2) / 2 + 0.5).toFixed(1));

  const playerStats = computeNewSeasonPlayerStats();
  const activeFieldPlayers = playerStats.filter(p =>
    !p.isGk && (!presentPlayerIds || presentPlayerIds.includes(p.id))
  );

  const playerWeights = activeFieldPlayers.map(p => {
    const totGoals = p.histGoals + (p.newSeasonGoals * 1.5);
    const totApps = Math.max(1, p.histApps + p.newSeasonApps);
    const goalsPerApp = totGoals / totApps;
    const baseRate = goalsPerApp > 0 ? goalsPerApp : (p.id === "olla" ? 0.35 : 0.16);
    return { player: p, weight: baseRate };
  });

  const sumWeights = playerWeights.reduce((s, x) => s + x.weight, 0) || 1;

  const scorerMarkets = playerWeights.map(({ player, weight }) => {
    const playerLambda = Math.max(0.10, lambdaOppidum * (weight / sumWeights));
    const p1Plus = 1 - Math.exp(-playerLambda);
    const p2Plus = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda));
    const p3Plus = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda) + poissonPmf(2, playerLambda));

    return {
      playerId: player.id,
      name: player.name,
      role: player.role,
      newSeasonGoals: player.newSeasonGoals,
      newSeasonApps: player.newSeasonApps,
      expectedGoals: Number(playerLambda.toFixed(2)),
      odd1Plus: probToOdd(p1Plus, 1.06, 1.15, 8.50),
      odd2Plus: probToOdd(p2Plus, 1.06, 1.50, 16.00),
      odd3Plus: probToOdd(p3Plus, 1.05, 2.30, 25.00)
    };
  }).sort((a, b) => a.odd1Plus - b.odd1Plus);

  const gkSaveLine = Math.max(8.5, Math.round(lambdaOpponent * 0.85) - 0.5);
  const goalkeeperMarkets = [
    { id: "gk_atzeni_saves", label: `🧤 ATZENI Over ${gkSaveLine} parate`, sub: "Specialista tra i pali", odd: 1.85 },
    { id: "gk_faret_saves",  label: `🧤 FARET Over ${gkSaveLine} parate`, sub: "Muro di Terramaini", odd: 1.85 },
    { id: "gk_rigore",       label: "🧤 ATZENI o FARET para almeno un rigore (5m)", sub: "Boato della panchina", odd: 2.75 },
    { id: "gk_under_gol",    label: `🧱 Difesa Oppidum subisce Under ${opponentLine} gol`, sub: "Partita blindata", odd: 1.90 },
    { id: "gk_clean_q",      label: "🔒 Porta inviolata in almeno un quarto (8')", sub: "Saracinesca abbassata", odd: 3.40 },
    { id: "gk_assist",       label: "🚀 Assist diretto di ATZENI o FARET in controfuga", sub: "Lancio sul bomber", odd: 4.50 }
  ];

  const goliardicMarkets = [
    { id: "gol_olla_esordio", label: "🆕 OLLA segna in questa partita!", sub: "Speciale nuovo acquisto della stagione", odd: 2.90 },
    { id: "gol_pittotti_gol", label: "💥 PITTOTTI sblocca il tabellino e segna!", sub: "Primo gol ufficiale con birra pagata", odd: 4.20 },
    { id: "gol_cannas_urlo",  label: "📢 Mister Chicco Cannas perde la voce entro il 2° tempo", sub: "Classico di Terramaini", odd: 1.45 },
    { id: "gol_melis_lob",    label: "🤽 MELIS segna con palombella ignorante", sub: "Tocco morbido sotto l'incrocio", odd: 2.30 },
    { id: "gol_proteste",     label: "🟥 Almeno un'espulsione per proteste in partita", sub: "Tensione agonistica da Girone 6", odd: 1.75 },
    { id: "gol_ichnusa",      label: "🍺 Cassa di Ichnusa portata nello spogliatoio a fine gara", sub: "Vittoria morale garantita", odd: 1.35 }
  ];

  return {
    lambdaOppidum: Number(lambdaOppidum.toFixed(1)),
    lambdaOpponent: Number(lambdaOpponent.toFixed(1)),
    prob1: Math.round(p1 * 100),
    probX: Math.round(pX * 100),
    prob2: Math.round(p2 * 100),
    rivalNote: oppRef?.note || "Sfida del Girone 6 — C.R. Sardegna",
    mainMarkets: {
      odd1: probToOdd(p1, 1.06),
      oddX: probToOdd(pX, 1.05),
      odd2: probToOdd(p2, 1.06),
      odd1X: probToOdd(p1 + pX, 1.06, 1.08),
      oddX2: probToOdd(pX + p2, 1.06, 1.08),
      odd12: probToOdd(p1 + p2, 1.06, 1.05),
      totalLine,
      oddOverTotal: 1.85,
      oddUnderTotal: 1.85,
      oppidumLine,
      oddOverOppidum: 1.85,
      oddUnderOppidum: 1.85,
      handicapLine,
      oddHandicapOppidum: 1.85
    },
    scorerMarkets,
    goalkeeperMarkets,
    goliardicMarkets
  };
}

// ============================================================
// 4. SFIDE DEL GIRONE 6 (IN ATTESA DEL CALENDARIO UFFICIALE)
// ============================================================
function getAllRosterIds() {
  return HISTORICAL_AI_REFERENCE.roster.map(p => p.id);
}

function getSeasonMatches() {
  const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {}
  }
  const allIds = getAllRosterIds();
  const exampleMatches = [
    {
      id: "ex_match_1",
      title: "Partita di Esempio 1 — Serie C",
      date: "Calendario in uscita · Piscina Terramaini",
      opponent: "Promogest Quartu SE",
      isHome: true,
      boostOppidum: 1.15,
      status: "open",
      scoreUs: null,
      scoreThem: null,
      presentPlayerIds: [...allIds],
      playerGoals: {},
      analysis: generateAiOddsForMatch("Promogest Quartu SE", true, 1.15, allIds)
    },
    {
      id: "ex_match_2",
      title: "Partita di Esempio 2 — Serie C",
      date: "Calendario in uscita · Piscina Terramaini",
      opponent: "RN Cagliari",
      isHome: true,
      boostOppidum: 1.15,
      status: "open",
      scoreUs: null,
      scoreThem: null,
      presentPlayerIds: [...allIds],
      playerGoals: {},
      analysis: generateAiOddsForMatch("RN Cagliari", true, 1.15, allIds)
    }
  ];
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(exampleMatches));
  return exampleMatches;
}

function saveSeasonMatches(matches) {
  localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
}

function getBetSlips() {
  const raw = localStorage.getItem(STORAGE_KEYS.BETS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return [];
}

function saveBetSlips(slips) {
  localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(slips));
}

// Calcola la classifica live dalle partite refertate della nuova stagione
function computeGirone6Table() {
  const table = {};
  GIRONE_6_TEAMS.forEach(name => {
    table[name] = { name, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  });

  const settled = getSeasonMatches().filter(m => m.status === "settled");
  settled.forEach(m => {
    const oppName = "Oppidum S. Cagliari";
    const rivName = m.opponent;
    if (!table[rivName]) {
      table[rivName] = { name: rivName, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    }
    const us = table[oppName];
    const them = table[rivName];
    const gUs = Number(m.scoreUs || 0);
    const gThem = Number(m.scoreThem || 0);

    us.played++; them.played++;
    us.gf += gUs; us.ga += gThem;
    them.gf += gThem; them.ga += gUs;

    if (gUs > gThem) { us.w++; us.pts += 3; them.l++; }
    else if (gUs < gThem) { them.w++; them.pts += 3; us.l++; }
    else { us.d++; them.d++; us.pts += 1; them.pts += 1; }
  });

  return Object.values(table).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if ((b.gf - b.ga) !== (a.gf - a.ga)) return (b.gf - b.ga) - (a.gf - a.ga);
    return a.name.localeCompare(b.name);
  });
}

// ---------- NAVIGAZIONE TABS ----------
function switchTab(tabId) {
  document.querySelectorAll(".tab-panel").forEach(el => {
    el.classList.toggle("active", el.id === `tab-${tabId}`);
  });
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  const container = document.getElementById("mainWorkspace");
  if (container) {
    const showSidebar = (tabId === "betting");
    container.classList.toggle("full-width", !showSidebar);
    const sidebar = document.getElementById("betslipSidebar");
    if (sidebar) sidebar.style.display = showSidebar ? "block" : "none";
  }
}

// ============================================================
// 5. RENDERING TAB 1: PALINSESTO & SCOMMESSE GIRONE 6
// ============================================================
function renderBettingTab() {
  const allMatches = getSeasonMatches();
  const openMatches = allMatches.filter(m => m.status === "open");

  const catTabs = document.querySelector(".market-category-tabs");

  if (!openMatches.length) {
    document.getElementById("matchSelectorBar").innerHTML = "";
    document.getElementById("featuredMatchBox").innerHTML = `
      <div style="text-align:center;padding:28px 16px;">
        <div style="font-size:2.4rem;margin-bottom:10px;">📅</div>
        <h4 style="font-family:'Space Grotesk',sans-serif;font-size:1.25rem;margin-bottom:8px;">
          In attesa del Calendario Ufficiale — Serie C Girone 6
        </h4>
        <p class="panel-sub" style="max-width:540px;margin:0 auto;">
          Le partite e le relative quote calcolate dall'AI saranno disponibili non appena verrà pubblicato il calendario ufficiale della stagione.
        </p>
      </div>
    `;
    document.getElementById("marketsContainer").innerHTML = "";
    if (catTabs) catTabs.style.display = "none";
    return;
  }

  if (catTabs) catTabs.style.display = "flex";

  if (!appState.selectedMatchId || !openMatches.some(m => m.id === appState.selectedMatchId)) {
    appState.selectedMatchId = openMatches[0].id;
  }

  const activeMatch = openMatches.find(m => m.id === appState.selectedMatchId) || openMatches[0];
  const an = activeMatch.analysis;

  document.getElementById("matchSelectorBar").innerHTML = openMatches.map(m => {
    const homeTeam = m.isHome ? "OPPIDUM CAGLIARI" : m.opponent;
    const awayTeam = m.isHome ? m.opponent : "OPPIDUM CAGLIARI";
    return `
      <button type="button" class="match-pill ${m.id === activeMatch.id ? "active" : ""}" onclick="selectMatch('${esc(m.id)}')">
        <div class="mp-date">
          <span>${esc(m.opponent)}</span>
          <span>${m.isHome ? "🏠 CASA" : "✈️ FUORI"}</span>
        </div>
        <div class="mp-teams">${esc(homeTeam)} vs ${esc(awayTeam)}</div>
        <div class="mp-meta">1: <strong>${m.analysis.mainMarkets.odd1.toFixed(2)}</strong> · X: <strong>${m.analysis.mainMarkets.oddX.toFixed(2)}</strong> · 2: <strong>${m.analysis.mainMarkets.odd2.toFixed(2)}</strong></div>
      </button>
    `;
  }).join("");

  const homeName = activeMatch.isHome ? "OPPIDUM SPORT CAGLIARI" : activeMatch.opponent;
  const awayName = activeMatch.isHome ? activeMatch.opponent : "OPPIDUM SPORT CAGLIARI";
  const presentCount = (activeMatch.presentPlayerIds || []).length;

  document.getElementById("featuredMatchBox").innerHTML = `
    <div class="fm-top">
      <span>🏆 Serie C — Girone 6 (C.R. Sardegna) · ${esc(activeMatch.title)}</span>
      <span>📅 ${esc(activeMatch.date)} · 🤽 ${presentCount} Giocatori Presenti</span>
    </div>
    <div class="fm-teams">
      <div>
        <div class="fm-team-name">${esc(homeName)}</div>
        <div class="fm-team-sub">${activeMatch.isHome ? "Piscina Terramaini · Rossoblù" : "Squadra Ospitante"}</div>
      </div>
      <div class="fm-vs">VS</div>
      <div>
        <div class="fm-team-name">${esc(awayName)}</div>
        <div class="fm-team-sub">${activeMatch.isHome ? "Avversaria Girone 6" : "Oppidum in Trasferta"}</div>
      </div>
    </div>
    <div class="ai-oracle-box">
      <div class="ai-oracle-header">
        <span>🤖 Oracolo AI — Analisi Sfida Girone 6</span>
        <span>Gol Stimati AI: <strong>Oppidum ${an.lambdaOppidum}</strong> — <strong>${esc(activeMatch.opponent)} ${an.lambdaOpponent}</strong></span>
      </div>
      <div style="font-size:0.82rem;color:#cbd5e1;">📌 ${esc(an.rivalNote || "Sfida ufficiale Girone 6 C.R. Sardegna")}</div>
      <div class="ai-prob-bar">
        <div class="ai-prob-1" style="width:${an.prob1}%"></div>
        <div class="ai-prob-x" style="width:${an.probX}%"></div>
        <div class="ai-prob-2" style="width:${an.prob2}%"></div>
      </div>
      <div class="ai-prob-legend">
        <span>1 (${esc(homeName)}): <strong>${an.prob1}%</strong></span>
        <span>X (Pareggio): <strong>${an.probX}%</strong></span>
        <span>2 (${esc(awayName)}): <strong>${an.prob2}%</strong></span>
      </div>
    </div>
  `;

  renderMarketsForMatch(activeMatch);
}

function selectMatch(matchId) {
  appState.selectedMatchId = matchId;
  renderBettingTab();
}

function setMarketCategory(cat) {
  appState.activeMarketCategory = cat;
  document.querySelectorAll(".market-cat-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.cat === cat);
  });
  const matches = getSeasonMatches();
  const activeMatch = matches.find(m => m.id === appState.selectedMatchId) || matches[0];
  if (activeMatch) renderMarketsForMatch(activeMatch);
}

function isPickSelected(matchId, marketKey) {
  return appState.betSlip.some(item => item.matchId === matchId && item.marketKey === marketKey);
}

function oddButtonHtml(match, marketKey, label, sub, odd) {
  const sel = isPickSelected(match.id, marketKey) ? "selected" : "";
  const matchTitle = match.isHome
    ? `Oppidum vs ${match.opponent}`
    : `${match.opponent} vs Oppidum`;
  return `
    <button type="button" class="odd-btn ${sel}"
      onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', '${esc(marketKey)}', '${esc(label)}', ${Number(odd)})">
      <div>
        <span class="odd-label">${esc(label)}</span>
        ${sub ? `<span class="odd-sub">${esc(sub)}</span>` : ""}
      </div>
      <span class="odd-val">${Number(odd).toFixed(2)}</span>
    </button>
  `;
}

function renderMarketsForMatch(match) {
  const cat = appState.activeMarketCategory;
  const an = match.analysis;
  const mm = an.mainMarkets;
  const homeName = match.isHome ? "Oppidum" : match.opponent;
  const awayName = match.isHome ? match.opponent : "Oppidum";

  let html = "";

  if (cat === "all" || cat === "main") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🤽 Esito Finale 1X2 &amp; Doppia Chance</div>
          <span class="market-badge">Quote AI Girone 6</span>
        </div>
        <div class="odds-grid">
          ${oddButtonHtml(match, "1X2_1", `1 — Vince ${homeName}`, `Prob. AI ${an.prob1}%`, mm.odd1)}
          ${oddButtonHtml(match, "1X2_X", `X — Pareggio`, `Prob. AI ${an.probX}%`, mm.oddX)}
          ${oddButtonHtml(match, "1X2_2", `2 — Vince ${awayName}`, `Prob. AI ${an.prob2}%`, mm.odd2)}
          ${oddButtonHtml(match, "DC_1X", `1X — ${homeName} o Pareggio`, "Doppia Chance", mm.odd1X)}
          ${oddButtonHtml(match, "DC_X2", `X2 — Pareggio o ${awayName}`, "Doppia Chance", mm.oddX2)}
          ${oddButtonHtml(match, "DC_12", `12 — Nessun Pareggio`, "Doppia Chance", mm.odd12)}
        </div>
      </div>

      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🔢 Over / Under Gol &amp; Handicap</div>
          <span class="market-badge">Linea AI: ${mm.totalLine} gol</span>
        </div>
        <div class="odds-grid">
          ${oddButtonHtml(match, "OU_TOT_OVER", `Over ${mm.totalLine} Gol Totali`, "Partita ricca di reti", mm.oddOverTotal)}
          ${oddButtonHtml(match, "OU_TOT_UNDER", `Under ${mm.totalLine} Gol Totali`, "Partita tattica", mm.oddUnderTotal)}
          ${oddButtonHtml(match, "OU_OPP_OVER", `Oppidum Over ${mm.oppidumLine} Gol`, `Soglia gol Oppidum`, mm.oddOverOppidum)}
          ${oddButtonHtml(match, "OU_OPP_UNDER", `Oppidum Under ${mm.oppidumLine} Gol`, `Soglia gol Oppidum`, mm.oddUnderOppidum)}
          ${oddButtonHtml(match, "HCP_OPP", `Oppidum Handicap (${mm.handicapLine >= 0 ? "+" + mm.handicapLine : mm.handicapLine})`, "Vittoria con Handicap", mm.oddHandicapOppidum)}
        </div>
      </div>
    `;
  }

  if (cat === "all" || cat === "scorers") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🎯 Quote Marcatori Oppidum</div>
          <span class="market-badge">1+ Gol · Doppietta · Tripletta</span>
        </div>
        <div class="odds-grid scorers-grid">
          ${an.scorerMarkets.map(sc => {
            const sel1 = isPickSelected(match.id, `SC_${sc.playerId}_1`) ? "selected" : "";
            const sel2 = isPickSelected(match.id, `SC_${sc.playerId}_2`) ? "selected" : "";
            const sel3 = isPickSelected(match.id, `SC_${sc.playerId}_3`) ? "selected" : "";
            const matchTitle = match.isHome ? `Oppidum vs ${match.opponent}` : `${match.opponent} vs Oppidum`;
            return `
              <div class="scorer-market-row">
                <div class="scorer-info">
                  <span class="scorer-name">🤽 ${esc(sc.name)}</span>
                  <span class="scorer-stat-pill">${sc.newSeasonGoals} gol · ${sc.newSeasonApps} pres.</span>
                </div>
                <div class="scorer-odds-mini">
                  <button type="button" class="odd-btn ${sel1}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_1', '${esc(sc.name)} Segna 1+', ${sc.odd1Plus})">
                    <span class="odd-label">Segna 1+</span>
                    <span class="odd-val">${sc.odd1Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel2}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_2', '${esc(sc.name)} 2+ Gol', ${sc.odd2Plus})">
                    <span class="odd-label">2+ Gol</span>
                    <span class="odd-val">${sc.odd2Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel3}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_3', '${esc(sc.name)} 3+ Gol', ${sc.odd3Plus})">
                    <span class="odd-label">3+ Gol</span>
                    <span class="odd-val">${sc.odd3Plus.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  if (cat === "all" || cat === "gk") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🧤 Speciale Portieri</div>
          <span class="market-badge">Parate &amp; Rigori</span>
        </div>
        <div class="odds-grid">
          ${an.goalkeeperMarkets.map(gk =>
            oddButtonHtml(match, gk.id, gk.label, gk.sub, gk.odd)
          ).join("")}
        </div>
      </div>
    `;
  }

  if (cat === "all" || cat === "goliardic") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🍺 Quote Goliardiche &amp; Spogliatoio</div>
          <span class="market-badge">Solo per veri intenditori</span>
        </div>
        <div class="odds-grid">
          ${an.goliardicMarkets.map(gm =>
            oddButtonHtml(match, gm.id, gm.label, gm.sub, gm.odd)
          ).join("")}
        </div>
      </div>
    `;
  }

  document.getElementById("marketsContainer").innerHTML = html;
}

// ============================================================
// 6. SCHEDINA INTERATTIVA (BET SLIP)
// ============================================================
function toggleBetPick(matchId, matchTitle, marketKey, label, odd) {
  const idx = appState.betSlip.findIndex(i => i.matchId === matchId && i.marketKey === marketKey);
  if (idx >= 0) {
    appState.betSlip.splice(idx, 1);
  } else {
    appState.betSlip.push({
      id: uid("pick"),
      matchId,
      matchTitle,
      marketKey,
      label,
      odd: Number(odd)
    });
  }
  renderBettingTab();
  renderBetSlip();
}

function removeBetPick(pickId) {
  appState.betSlip = appState.betSlip.filter(i => i.id !== pickId);
  renderBettingTab();
  renderBetSlip();
}

function clearBetSlip() {
  appState.betSlip = [];
  renderBettingTab();
  renderBetSlip();
}

function setQuickStake(amount) {
  const input = document.getElementById("betStakeInput");
  if (input) {
    input.value = amount;
    updateBetSlipMath();
  }
}

function renderBetSlip() {
  const countEl = document.getElementById("betslipCount");
  const bodyEl = document.getElementById("betslipBody");
  if (!countEl || !bodyEl) return;

  countEl.textContent = appState.betSlip.length;

  if (!appState.betSlip.length) {
    bodyEl.innerHTML = `
      <div class="betslip-empty">
        <div style="font-size:2rem;margin-bottom:6px;">🎫</div>
        Clicca sulle quote della partita per creare la tua schedina!
      </div>
    `;
    return;
  }

  const stakeInput = document.getElementById("betStakeInput");
  const currentStake = stakeInput ? Math.max(1, parseInt(stakeInput.value, 10) || 10) : 10;
  const totalOdd = appState.betSlip.reduce((acc, item) => acc * item.odd, 1);
  const potentialWin = Math.round(currentStake * totalOdd);

  bodyEl.innerHTML = `
    <div class="betslip-items">
      ${appState.betSlip.map(item => `
        <div class="bs-item">
          <div class="bs-item-top">
            <span>🤽 ${esc(item.matchTitle)}</span>
            <button type="button" class="bs-remove" onclick="removeBetPick('${esc(item.id)}')">✕</button>
          </div>
          <div class="bs-pick">
            <span>${esc(item.label)}</span>
            <span class="bs-odd">${item.odd.toFixed(2)}</span>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="betslip-summary">
      <div class="field">
        <label for="betStakeInput">Puntata (Crediti 🪙)</label>
        <input type="number" id="betStakeInput" min="1" max="1000" value="${currentStake}" oninput="updateBetSlipMath()" />
      </div>
      <div class="stake-quick-btns">
        <button type="button" class="stake-q-btn" onclick="setQuickStake(5)">5 Cr.</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(10)">10 Cr.</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(25)">25 Cr.</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(50)">50 Cr.</button>
      </div>
      <div class="bs-row">
        <span>Quota Totale (${appState.betSlip.length > 1 ? "Multipla" : "Singola"}):</span>
        <span class="bs-total-odd" id="bsTotalOddVal">${totalOdd.toFixed(2)}</span>
      </div>
      <div class="bs-row">
        <span>Vincita Potenziale:</span>
        <span class="bs-payout" id="bsPayoutVal">${potentialWin} Crediti</span>
      </div>
      <button type="button" class="btn btn-gold btn-block" onclick="placeBetSlip()">
        🔥 Gioca Schedina!
      </button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <button type="button" class="btn btn-whatsapp btn-sm" onclick="shareCurrentSlipWhatsApp()">
          📲 WhatsApp
        </button>
        <button type="button" class="btn btn-outline btn-sm" onclick="clearBetSlip()">
          🗑️ Svuota
        </button>
      </div>
    </div>
  `;
}

function updateBetSlipMath() {
  const stakeInput = document.getElementById("betStakeInput");
  const currentStake = stakeInput ? Math.max(1, parseInt(stakeInput.value, 10) || 1) : 10;
  const totalOdd = appState.betSlip.reduce((acc, item) => acc * item.odd, 1);
  const potentialWin = Math.round(currentStake * totalOdd);
  const oddEl = document.getElementById("bsTotalOddVal");
  const payEl = document.getElementById("bsPayoutVal");
  if (oddEl) oddEl.textContent = totalOdd.toFixed(2);
  if (payEl) payEl.textContent = `${potentialWin} Crediti`;
}

function placeBetSlip() {
  if (!appState.betSlip.length) return;
  const currentUser = getCurrentUser();
  if (!currentUser) {
    openLoginModal();
    showToast("🔑 Fai prima l'accesso rapido con il tuo nome per giocare la schedina!");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.id === currentUser.id);
  const stakeInput = document.getElementById("betStakeInput");
  const stake = stakeInput ? Math.max(1, parseInt(stakeInput.value, 10) || 10) : 10;

  if (user.credits < stake) {
    showToast(`⚠️ Crediti insufficienti (${user.credits} Cr. disponibili)!`);
    return;
  }

  const totalOdd = Number(appState.betSlip.reduce((acc, item) => acc * item.odd, 1).toFixed(2));
  const potentialPayout = Math.round(stake * totalOdd);

  user.credits -= stake;
  user.totalStaked = (user.totalStaked || 0) + stake;
  saveUsers(users);

  const slips = getBetSlips();
  slips.unshift({
    id: uid("slip"),
    userId: user.id,
    userName: user.name,
    createdAt: new Date().toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    picks: [...appState.betSlip],
    stake,
    totalOdd,
    potentialPayout,
    status: "open"
  });
  saveBetSlips(slips);

  appState.betSlip = [];
  renderAuthHeader();
  renderBettingTab();
  renderBetSlip();
  renderLeaderboardTab();
  showToast(`🎉 Schedina giocata da <strong>${esc(user.name)}</strong>! Vincita potenziale: <strong>${potentialPayout} Crediti</strong>`);
}

function shareCurrentSlipWhatsApp() {
  if (!appState.betSlip.length) return;
  const user = getCurrentUser();
  const stake = parseInt(document.getElementById("betStakeInput")?.value, 10) || 10;
  const totalOdd = appState.betSlip.reduce((acc, item) => acc * item.odd, 1);
  const win = Math.round(stake * totalOdd);

  const lines = [
    `🤽‍♂️ *OPPIDUM BET — SCHEDINA DI ${(user?.name || "SCOMMETTITORE").toUpperCase()}* 🪙`,
    ...appState.betSlip.map(p => `• ${p.matchTitle}: *${p.label}* (@${p.odd.toFixed(2)})`),
    `📈 Quota Totale: *${totalOdd.toFixed(2)}*`,
    `🪙 Puntata: *${stake} Crediti* → Vincita Potenziale: *${win} Crediti*`
  ];
  window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

// ============================================================
// 7. TAB 2: CLASSIFICA SCOMMETTITORI & SCHEDINE
// ============================================================
function settleSlipStatus(slipId, newStatus) {
  const slips = getBetSlips();
  const slip = slips.find(s => s.id === slipId);
  if (!slip || slip.status !== "open") return;

  const users = getUsers();
  const user = users.find(u => u.id === slip.userId);

  slip.status = newStatus;
  if (newStatus === "won") {
    if (user) {
      user.credits += slip.potentialPayout;
      user.wins = (user.wins || 0) + 1;
      user.totalWon = (user.totalWon || 0) + slip.potentialPayout;
    }
    showToast(`🏆 Schedina VINTA! +${slip.potentialPayout} Crediti a ${esc(slip.userName)}!`);
  } else if (newStatus === "lost") {
    if (user) {
      user.losses = (user.losses || 0) + 1;
    }
    showToast(`❌ Schedina segnata come persa.`);
  }

  saveBetSlips(slips);
  saveUsers(users);
  renderAuthHeader();
  renderLeaderboardTab();
}

function giveBonusCredits(userId, amount = 50) {
  const users = getUsers();
  const u = users.find(x => x.id === userId);
  if (!u) return;
  u.credits += amount;
  saveUsers(users);
  renderAuthHeader();
  renderLeaderboardTab();
  showToast(`🪙 +${amount} Crediti assegnati a <strong>${esc(u.name)}</strong>!`);
}

function renderLeaderboardTab() {
  const users = getUsers();
  const sorted = [...users].sort((a, b) => b.credits - a.credits);
  const lbBody = document.getElementById("bettorsLeaderboardBody");
  if (lbBody) {
    if (!sorted.length) {
      lbBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center;padding:24px;color:var(--text-muted);">
            Nessuno scommettitore ancora registrato. Clicca su <strong>Accedi e Gioca</strong> per entrare in classifica con 100 Crediti!
          </td>
        </tr>
      `;
    } else {
      lbBody.innerHTML = sorted.map((u, idx) => {
        const medal = idx === 0 ? "🥇 1°" : idx === 1 ? "🥈 2°" : idx === 2 ? "🥉 3°" : `${idx + 1}°`;
        const net = u.credits - STARTING_CREDITS;
        const netStr = net > 0 ? `+${net}` : `${net}`;
        return `
          <tr>
            <td style="font-weight:900;font-size:1rem;">${medal}</td>
            <td><strong>👤 ${esc(u.name)}</strong></td>
            <td style="color:var(--gold);font-weight:900;font-size:1.05rem;">${u.credits} Crediti 🪙</td>
            <td style="color:${net >= 0 ? '#34d399' : '#f87171'};font-weight:800;">${netStr}</td>
            <td style="color:#34d399;font-weight:700;">${u.wins || 0}</td>
            <td style="color:#f87171;font-weight:700;">${u.losses || 0}</td>
          </tr>
        `;
      }).join("");
    }
  }

  const slips = getBetSlips();
  const slipsBox = document.getElementById("allSlipsHistoryBox");
  if (!slipsBox) return;

  if (!slips.length) {
    slipsBox.innerHTML = `<p class="panel-sub">Nessuna schedina ancora giocata in questa stagione. Fai il login e punta i tuoi 100 Crediti!</p>`;
    return;
  }

  slipsBox.innerHTML = slips.map(s => {
    const statusBadge = s.status === "open"
      ? `<span class="badge badge-open">⏳ IN CORSO</span>`
      : s.status === "won"
        ? `<span class="badge badge-won">🏆 VINTA (+${s.potentialPayout} Cr.)</span>`
        : `<span class="badge badge-lost">❌ PERSA (-${s.stake} Cr.)</span>`;

    return `
      <div class="market-block" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <strong>👤 ${esc(s.userName)}</strong>
            <span class="panel-sub" style="margin-left:8px;">🕒 ${esc(s.createdAt)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${statusBadge}
            ${s.status === "open" ? `
              <button type="button" class="btn btn-sm" style="background:#10b981;color:#052e16;padding:4px 10px;" onclick="settleSlipStatus('${esc(s.id)}', 'won')">✅ Vinta</button>
              <button type="button" class="btn btn-sm" style="background:#ef4444;color:#fff;padding:4px 10px;" onclick="settleSlipStatus('${esc(s.id)}', 'lost')">❌ Persa</button>
            ` : ""}
          </div>
        </div>
        <div style="font-size:0.84rem;color:#cbd5e1;margin-bottom:8px;">
          ${s.picks.map(p => `<div>• <em>${esc(p.matchTitle)}</em>: <strong>${esc(p.label)}</strong> (<span style="color:var(--gold)">@${p.odd.toFixed(2)}</span>)</div>`).join("")}
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:6px;">
          <span>Puntata: <strong>${s.stake} Crediti</strong> · Quota: <strong>${s.totalOdd.toFixed(2)}</strong></span>
          <span>Vincita Potenziale: <strong style="color:var(--gold)">${s.potentialPayout} Crediti</strong></span>
        </div>
      </div>
    `;
  }).join("");
}

// ============================================================
// 8. TAB 3: ROSA NUOVA STAGIONE, GIRONE 6 & REGISTRO PRESENZE
// ============================================================
function renderRosterAndPresenzeTab() {
  const playerStats = computeNewSeasonPlayerStats();
  const matches = getSeasonMatches();

  // 0. Tabella Girone 6 C.R. Sardegna
  const g6Body = document.getElementById("girone6StandingsBody");
  if (g6Body) {
    const standings = computeGirone6Table();
    g6Body.innerHTML = standings.map((t, i) => {
      const isOpp = t.name.toUpperCase().includes("OPPIDUM");
      const diff = t.gf - t.ga;
      return `
        <tr style="${isOpp ? 'background:rgba(200,16,46,0.25);font-weight:700;' : ''}">
          <td><strong>${i + 1}</strong></td>
          <td>
            <strong>${esc(t.name)}</strong>
            ${isOpp ? `<span class="badge badge-gk" style="margin-left:6px;">LA NOSTRA SQUADRA</span>` : ""}
          </td>
          <td style="font-weight:900;color:var(--gold);">${t.pts}</td>
          <td>${t.played}</td>
          <td>${t.w}</td>
          <td>${t.d}</td>
          <td>${t.l}</td>
          <td>${t.gf}</td>
          <td>${t.ga}</td>
          <td>${diff > 0 ? "+" + diff : diff}</td>
        </tr>
      `;
    }).join("");
  }

  // 1. Griglia Rosa Ufficiale Nuova Stagione (19 giocatori)
  const rosterGrid = document.getElementById("rosterCardsGrid");
  if (rosterGrid) {
    rosterGrid.innerHTML = playerStats.map(p => {
      const cardClass = p.isGk ? "gk-card" : "";
      const roleBadge = p.isGk
        ? `<span class="badge badge-gk">🧤 PORTIERE</span>`
        : (p.id === "olla"
          ? `<span class="badge badge-active">🆕 NUOVO INNESTO</span>`
          : `<span class="badge badge-active">🤽 ROSA ATTUALE</span>`);

      return `
        <div class="player-card ${cardClass}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <strong style="font-size:1.05rem;">${esc(p.name)}</strong>
            ${roleBadge}
          </div>
          <div class="panel-sub">${esc(p.role)} · ${esc(p.note)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:8px;border-top:1px solid var(--border);font-size:0.82rem;">
            <span>Presenze Stagione: <strong style="color:var(--oppidum-sky);font-size:0.95rem;">${p.newSeasonApps}</strong></span>
            ${p.isGk
              ? `<span style="color:var(--gold);font-weight:800;">Parate / Porta</span>`
              : `<span>Gol Stagione: <strong style="color:var(--gold);font-size:0.95rem;">${p.newSeasonGoals}</strong></span>`
            }
          </div>
        </div>
      `;
    }).join("");
  }

  // 2. Matrice Presenze & Gol per Partita della Nuova Stagione
  const headEl = document.getElementById("presenzeMatrixHead");
  const bodyEl = document.getElementById("presenzeMatrixBody");
  if (!headEl || !bodyEl) return;

  headEl.innerHTML = `
    <tr>
      <th>GIOCATORE</th>
      <th>RUOLO</th>
      ${matches.map((m, idx) => `
        <th title="${esc(m.title)}: vs ${esc(m.opponent)} (${esc(m.date)})">
          ${esc(m.opponent.split(" ")[0])}
          <div style="font-size:0.65rem;color:${m.status === 'settled' ? '#34d399' : 'var(--gold)'};">
            ${m.status === "settled" ? `${m.scoreUs}-${m.scoreThem}` : "Conv."}
          </div>
        </th>
      `).join("")}
      <th class="total-col">PRES. GARE</th>
      <th class="total-col">GOL</th>
    </tr>
  `;

  bodyEl.innerHTML = playerStats.map(p => {
    return `
      <tr>
        <td><strong>${esc(p.name)}</strong></td>
        <td style="font-size:0.75rem;color:var(--text-muted);">${esc(p.role)}</td>
        ${matches.map(m => {
          const isPresent = (m.presentPlayerIds || []).includes(p.id);
          const goals = Number((m.playerGoals || {})[p.id] || 0);
          return `
            <td>
              <label style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;" title="Spunta se ${esc(p.name)} ha giocato / è presente contro ${esc(m.opponent)}">
                <input type="checkbox" ${isPresent ? "checked" : ""}
                  onchange="togglePlayerPresenceInMatch('${esc(m.id)}', '${esc(p.id)}', this.checked)" />
                ${!p.isGk && isPresent ? `
                  <input type="number" min="0" max="15" value="${goals}"
                    style="width:42px;padding:2px 4px;font-size:0.75rem;text-align:center;"
                    title="Gol segnati da ${esc(p.name)}"
                    onchange="updatePlayerGoalsInMatch('${esc(m.id)}', '${esc(p.id)}', this.value)" />
                ` : `<span style="font-size:0.7rem;color:var(--text-muted);">${isPresent ? "Sì" : "No"}</span>`}
              </label>
            </td>
          `;
        }).join("")}
        <td class="total-col">${p.newSeasonApps}</td>
        <td class="total-col">${p.newSeasonGoals}</td>
      </tr>
    `;
  }).join("");
}

function togglePlayerPresenceInMatch(matchId, playerId, isPresent) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  const set = new Set(m.presentPlayerIds || []);
  if (isPresent) set.add(playerId);
  else {
    set.delete(playerId);
    if (m.playerGoals) delete m.playerGoals[playerId];
  }
  m.presentPlayerIds = Array.from(set);
  m.analysis = generateAiOddsForMatch(m.opponent, m.isHome, m.boostOppidum || 1.15, m.presentPlayerIds);

  saveSeasonMatches(matches);
  renderRosterAndPresenzeTab();
  renderBettingTab();
  showToast(`✅ Presenze aggiornate per <strong>vs ${esc(m.opponent)}</strong>!`);
}

function updatePlayerGoalsInMatch(matchId, playerId, goalsVal) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  if (!m.playerGoals) m.playerGoals = {};
  m.playerGoals[playerId] = Math.max(0, parseInt(goalsVal, 10) || 0);
  saveSeasonMatches(matches);
  renderRosterAndPresenzeTab();
}

// ============================================================
// 9. TAB 4: CREA PARTITA, GESTISCI QUOTE AI E REFERTA RISULTATO
// ============================================================
function renderOracleTab() {
  const matches = getSeasonMatches();
  const activeMatch = matches.find(m => m.id === appState.selectedMatchId) || matches[0];

  const listEl = document.getElementById("oracleMatchesList");
  if (listEl) {
    listEl.innerHTML = matches.map(m => `
      <div class="market-block" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-weight:800;font-size:1rem;">
            ${esc(m.title)} — ${m.isHome ? "🏠 OPPIDUM vs " + esc(m.opponent) : "✈️ " + esc(m.opponent) + " vs OPPIDUM"}
            ${m.status === "settled" ? `<span class="badge badge-won" style="margin-left:6px;">FINALE: ${m.scoreUs}-${m.scoreThem}</span>` : `<span class="badge badge-open" style="margin-left:6px;">QUOTE APERTE</span>`}
          </div>
          <div class="panel-sub">
            📅 ${esc(m.date)} · Presenti: <strong>${(m.presentPlayerIds || []).length}/19</strong> · Quote 1X2: <strong>${m.analysis.mainMarkets.odd1.toFixed(2)} / ${m.analysis.mainMarkets.oddX.toFixed(2)} / ${m.analysis.mainMarkets.odd2.toFixed(2)}</strong>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-navy btn-sm" onclick="selectMatchForCustomOdds('${esc(m.id)}')">✏️ Modifica Data / Quote / Risultato</button>
          <button type="button" class="btn btn-whatsapp btn-sm" onclick="shareMatchOddsWhatsApp('${esc(m.id)}')">📲 Condividi Quote</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="deleteSeasonMatch('${esc(m.id)}')">🗑️</button>
        </div>
      </div>
    `).join("");
  }

  if (activeMatch) {
    renderCustomOddsEditor(activeMatch);
  }
}

function createNewAiMatch(e) {
  e.preventDefault();
  const opponentSel = document.getElementById("newMatchOpponent").value;
  const customOpp = document.getElementById("newMatchCustomOpponent").value.trim();
  const opponent = opponentSel === "CUSTOM" ? (customOpp || "Avversario Serie C") : opponentSel;
  const isHome = document.getElementById("newMatchVenue").value === "home";
  const dateStr = document.getElementById("newMatchDate").value.trim() || "Data da definire (Girone 6)";
  const titleStr = document.getElementById("newMatchComp").value.trim() || "Girone 6 — C.R. Sardegna";
  const boost = parseFloat(document.getElementById("newMatchBoost").value) || 1.15;

  const allIds = getAllRosterIds();
  const analysis = generateAiOddsForMatch(opponent, isHome, boost, allIds);
  const matches = getSeasonMatches();

  const newMatch = {
    id: uid("g6_match"),
    title: titleStr,
    date: dateStr,
    opponent,
    isHome,
    boostOppidum: boost,
    status: "open",
    scoreUs: null,
    scoreThem: null,
    presentPlayerIds: [...allIds],
    playerGoals: {},
    analysis
  };

  matches.unshift(newMatch);
  saveSeasonMatches(matches);
  appState.selectedMatchId = newMatch.id;

  renderBettingTab();
  renderOracleTab();
  renderRosterAndPresenzeTab();
  showToast(`🤖 Partita <strong>OPPIDUM vs ${esc(opponent)}</strong> creata e quote calcolate dall'AI!`);
}

function selectMatchForCustomOdds(matchId) {
  appState.selectedMatchId = matchId;
  renderOracleTab();
  renderBettingTab();
  document.getElementById("customOddsEditorSection")?.scrollIntoView({ behavior: "smooth" });
}

function deleteSeasonMatch(matchId) {
  const matches = getSeasonMatches().filter(m => m.id !== matchId);
  saveSeasonMatches(matches);
  if (appState.selectedMatchId === matchId) {
    appState.selectedMatchId = matches[0]?.id || null;
  }
  renderBettingTab();
  renderOracleTab();
  renderRosterAndPresenzeTab();
  showToast("🗑️ Partita rimossa.");
}

function renderCustomOddsEditor(match) {
  const container = document.getElementById("customOddsEditorBody");
  if (!container) return;
  const mm = match.analysis.mainMarkets;

  container.innerHTML = `
    <div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <div>
        <span class="badge badge-gk">${esc(match.title)}</span>
        <strong style="margin-left:8px;font-size:1.05rem;">
          ${match.isHome ? "OPPIDUM SPORT CAGLIARI vs " + esc(match.opponent) : esc(match.opponent) + " vs OPPIDUM SPORT CAGLIARI"}
        </strong>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="recalculateAiForMatch('${esc(match.id)}')">
        🔄 Ricalcola Quote con AI
      </button>
    </div>

    <div class="form-grid">
      <div class="field">
        <label>Data / Giornata (Appena esce il calendario)</label>
        <input type="text" id="editMatchDate" value="${esc(match.date)}" />
      </div>
      <div class="field">
        <label>Casa / Trasferta</label>
        <select id="editMatchIsHome">
          <option value="home" ${match.isHome ? "selected" : ""}>🏠 In Casa (Piscina Terramaini)</option>
          <option value="away" ${!match.isHome ? "selected" : ""}>✈️ In Trasferta</option>
        </select>
      </div>
      <div class="field">
        <label>Quota 1 (${match.isHome ? "Oppidum" : esc(match.opponent)})</label>
        <input type="number" step="0.05" id="editOdd1" value="${mm.odd1}" />
      </div>
      <div class="field">
        <label>Quota X (Pareggio)</label>
        <input type="number" step="0.05" id="editOddX" value="${mm.oddX}" />
      </div>
      <div class="field">
        <label>Quota 2 (${match.isHome ? esc(match.opponent) : "Oppidum"})</label>
        <input type="number" step="0.05" id="editOdd2" value="${mm.odd2}" />
      </div>
      <div class="field">
        <label>Linea Over/Under Gol Totali</label>
        <input type="number" step="0.5" id="editTotalLine" value="${mm.totalLine}" />
      </div>
      <div class="field">
        <label>Linea Over/Under Gol Oppidum</label>
        <input type="number" step="0.5" id="editOppidumLine" value="${mm.oppidumLine}" />
      </div>
    </div>
    <button type="button" class="btn btn-primary btn-sm" onclick="saveManualMainOdds('${esc(match.id)}')">
      💾 Salva Data &amp; Quote Modificate
    </button>

    <hr style="border:none;border-top:1px solid var(--border);margin:18px 0;" />

    <h4 style="margin-bottom:10px;font-size:0.95rem;">➕ Aggiungi Quota Goliardica / Speciale per questa Partita</h4>
    <div class="form-grid">
      <div class="field">
        <label>Titolo Scommessa</label>
        <input type="text" id="customGoliardicLabel" placeholder="es. 'Olla segna una doppietta all'esordio'" />
      </div>
      <div class="field">
        <label>Dettaglio</label>
        <input type="text" id="customGoliardicSub" placeholder="es. 'Quota speciale spogliatoio'" />
      </div>
      <div class="field">
        <label>Quota</label>
        <input type="number" step="0.10" id="customGoliardicOdd" value="3.50" />
      </div>
    </div>
    <button type="button" class="btn btn-gold btn-sm" onclick="addCustomGoliardicOdd('${esc(match.id)}')">
      🍺 Aggiungi Quota al Palinsesto
    </button>

    <hr style="border:none;border-top:1px solid var(--border);margin:18px 0;" />

    <h4 style="margin-bottom:10px;font-size:0.95rem;">🏁 Referta Risultato Finale Partita (Aggiorna Classifica Girone 6 &amp; Presenze)</h4>
    <div class="form-grid">
      <div class="field">
        <label>Gol OPPIDUM SPORT CAGLIARI</label>
        <input type="number" min="0" max="40" id="settleScoreUs" value="${match.scoreUs ?? 10}" />
      </div>
      <div class="field">
        <label>Gol ${esc(match.opponent)}</label>
        <input type="number" min="0" max="40" id="settleScoreThem" value="${match.scoreThem ?? 9}" />
      </div>
    </div>
    <button type="button" class="btn btn-navy btn-sm" onclick="recordMatchResult('${esc(match.id)}')">
      ✅ Salva Risultato Ufficiale &amp; Aggiorna Classifica Girone 6
    </button>
  `;
}

function saveManualMainOdds(matchId) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  const newDate = document.getElementById("editMatchDate")?.value.trim();
  const newIsHome = document.getElementById("editMatchIsHome")?.value === "home";
  if (newDate) m.date = newDate;
  m.isHome = newIsHome;

  m.analysis.mainMarkets.odd1 = parseFloat(document.getElementById("editOdd1").value) || m.analysis.mainMarkets.odd1;
  m.analysis.mainMarkets.oddX = parseFloat(document.getElementById("editOddX").value) || m.analysis.mainMarkets.oddX;
  m.analysis.mainMarkets.odd2 = parseFloat(document.getElementById("editOdd2").value) || m.analysis.mainMarkets.odd2;
  m.analysis.mainMarkets.totalLine = parseFloat(document.getElementById("editTotalLine").value) || m.analysis.mainMarkets.totalLine;
  m.analysis.mainMarkets.oppidumLine = parseFloat(document.getElementById("editOppidumLine").value) || m.analysis.mainMarkets.oppidumLine;

  saveSeasonMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast("✅ Data e quote aggiornate!");
}

function recalculateAiForMatch(matchId) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;
  const newIsHome = document.getElementById("editMatchIsHome")
    ? document.getElementById("editMatchIsHome").value === "home"
    : m.isHome;
  m.isHome = newIsHome;
  m.analysis = generateAiOddsForMatch(m.opponent, m.isHome, m.boostOppidum || 1.15, m.presentPlayerIds);
  saveSeasonMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast("🤖 Quote ricalcolate dall'AI!");
}

function addCustomGoliardicOdd(matchId) {
  const label = document.getElementById("customGoliardicLabel")?.value.trim();
  const sub = document.getElementById("customGoliardicSub")?.value.trim() || "Quota speciale spogliatoio";
  const odd = parseFloat(document.getElementById("customGoliardicOdd")?.value) || 2.5;
  if (!label) {
    showToast("⚠️ Inserisci il testo della scommessa!");
    return;
  }

  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  m.analysis.goliardicMarkets.unshift({
    id: uid("gol_custom"),
    label: `🔥 ${label}`,
    sub,
    odd: Number(odd.toFixed(2))
  });

  saveSeasonMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast(`🍺 Nuova quota "${esc(label)}" (@${odd.toFixed(2)}) aggiunta!`);
}

function recordMatchResult(matchId) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  const scoreUs = parseInt(document.getElementById("settleScoreUs")?.value, 10) || 0;
  const scoreThem = parseInt(document.getElementById("settleScoreThem")?.value, 10) || 0;

  m.scoreUs = scoreUs;
  m.scoreThem = scoreThem;
  m.status = "settled";

  saveSeasonMatches(matches);
  renderBettingTab();
  renderOracleTab();
  renderRosterAndPresenzeTab();
  showToast(`🏁 Risultato <strong>OPPIDUM ${scoreUs} - ${scoreThem} ${esc(m.opponent)}</strong> registrato! Classifica Girone 6 e Presenze aggiornate.`);
}

function shareMatchOddsWhatsApp(matchId) {
  const matches = getSeasonMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;
  const an = m.analysis;
  const mm = an.mainMarkets;
  const topScorers = an.scorerMarkets.slice(0, 6);

  const text = [
    `🤽‍♂️ *OPPIDUM BET — QUOTE GIRONE 6 (C.R. SARDEGNA)* 🔴🔵`,
    `🏆 *${m.isHome ? "OPPIDUM CAGLIARI vs " + m.opponent : m.opponent + " vs OPPIDUM CAGLIARI"}*`,
    `📅 ${m.date}`,
    ``,
    `📊 *ESITO 1X2:*`,
    `• 1: *${mm.odd1.toFixed(2)}* | X: *${mm.oddX.toFixed(2)}* | 2: *${mm.odd2.toFixed(2)}*`,
    `• Over/Under ${mm.totalLine} gol: *1.85*`,
    `• Oppidum Over ${mm.oppidumLine} gol: *${mm.oddOverOppidum.toFixed(2)}*`,
    ``,
    `🎯 *QUOTE MARCATORI OPPIDUM (1+ Gol):*`,
    ...topScorers.map(s => `• ${s.name}: *${s.odd1Plus.toFixed(2)}*`),
    ``,
    `🧤 *SPECIALE PORTIERI (ATZENI & FARET):*`,
    `• Para un rigore (5m): *2.75*`,
    `• Porta inviolata in un quarto: *3.40*`,
    ``,
    `👉 Accedi con il tuo nome (100 Crediti iniziali) su: https://stilippo.github.io/oppidum-betting/`
  ].join("\n");

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

// ---------- INIZIALIZZAZIONE ----------
window.addEventListener("DOMContentLoaded", () => {
  renderAuthHeader();
  renderBettingTab();
  renderBetSlip();
  renderLeaderboardTab();
  renderRosterAndPresenzeTab();
  renderOracleTab();
});
