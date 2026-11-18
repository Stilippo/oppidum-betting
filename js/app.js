/* ============================================================
   OPPIDUM BET — Serie C Girone 6 (C.R. Sardegna)
   - Blocco automatico scommesse al fischio d'inizio (kickoffIso)
   - Classifica provvisoria, Calendario e Statistiche Giocatori
   - Scommettitore 1..5 e 2 partite di esempio con quote AI
   ============================================================ */

const STORAGE_KEYS = {
  USERS: "oppidum_season_users_v17",
  CURRENT_USER: "oppidum_season_current_user_v17",
  BETS: "oppidum_season_bets_v17",
  MATCHES: "oppidum_season_matches_v17",
  APPEARANCES_REF: "oppidum_season_hist_apps_v17"
};

const CLOUD_SYNC_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a1ef0b06e131f8";
const STARTING_CREDITS = 100;
const MIN_VALID_ODD = 1.08; // Esclude quote troppo vicine a 1.00 (< 1.08)

// ============================================================
// 1. GIRONE 6 — C.R. SARDEGNA (QUESTA STAGIONE)
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
  // Rosa Ufficiale Nuova Stagione (19 giocatori):
  // - Portieri: Atzeni, Faret
  // - Centroboa: Piras, Ballestri, Pittotti
  // - Difensori: Pilia FL (Capitano), Morzetti, Pieroni
  // - Esterni / Fasce: De Giudici (Vice Capitano) e tutti gli altri
  roster: [
    { id: "atzeni",     name: "ATZENI",     role: "Portiere",  isGk: true,  histGoals: 0,  histFouls: 1,  histApps: 18, note: "Portiere" },
    { id: "faret",      name: "FARET",      role: "Portiere",  isGk: true,  histGoals: 0,  histFouls: 1,  histApps: 18, note: "Portiere" },
    { id: "melis",      name: "MELIS",      role: "Fascia",    isGk: false, histGoals: 34, histFouls: 16, histApps: 18, note: "Giocatore di Fascia" },
    { id: "piras",      name: "PIRAS",      role: "Centroboa", isGk: false, histGoals: 24, histFouls: 22, histApps: 18, note: "Centroboa" },
    { id: "de_giudici", name: "DE GIUDICI", role: "Fascia",    isGk: false, histGoals: 18, histFouls: 15, histApps: 16, note: "Vice Capitano · Fascia", leadership: "Vice Capitano" },
    { id: "sacco",      name: "SACCO",      role: "Fascia",    isGk: false, histGoals: 12, histFouls: 18, histApps: 16, note: "Giocatore di Fascia" },
    { id: "ballestri",  name: "BALLESTRI",  role: "Centroboa", isGk: false, histGoals: 10, histFouls: 19, histApps: 15, note: "Centroboa" },
    { id: "petretto",   name: "PETRETTO",   role: "Fascia",    isGk: false, histGoals: 7,  histFouls: 14, histApps: 15, note: "Giocatore di Fascia" },
    { id: "erriu",      name: "ERRIU",      role: "Fascia",    isGk: false, histGoals: 6,  histFouls: 12, histApps: 14, note: "Giocatore di Fascia" },
    { id: "cannas",     name: "CANNAS",     role: "Fascia",    isGk: false, histGoals: 5,  histFouls: 13, histApps: 14, note: "Giocatore di Fascia" },
    { id: "pilia_fl",   name: "PILIA FL",   role: "Difensore", isGk: false, histGoals: 3,  histFouls: 21, histApps: 12, note: "Capitano · Difensore", leadership: "Capitano" },
    { id: "troncia",    name: "TRONCIA",    role: "Fascia",    isGk: false, histGoals: 3,  histFouls: 11, histApps: 12, note: "Giocatore di Fascia" },
    { id: "pieroni",    name: "PIERONI",    role: "Difensore", isGk: false, histGoals: 2,  histFouls: 16, histApps: 10, note: "Difensore" },
    { id: "pilia_fb",   name: "PILIA FB",   role: "Fascia",    isGk: false, histGoals: 1,  histApps: 10, histFouls: 9,  note: "Giocatore di Fascia" },
    { id: "morzetti",   name: "MORZETTI",   role: "Difensore", isGk: false, histGoals: 0,  histFouls: 13, histApps: 8,  note: "Difensore" },
    { id: "murtas",     name: "MURTAS",     role: "Fascia",    isGk: false, histGoals: 0,  histFouls: 7,  histApps: 8,  note: "Giocatore di Fascia" },
    { id: "orru",       name: "ORRU'",      role: "Fascia",    isGk: false, histGoals: 0,  histFouls: 7,  histApps: 8,  note: "Giocatore di Fascia" },
    { id: "pittotti",   name: "PITTOTTI",   role: "Centroboa", isGk: false, histGoals: 0,  histFouls: 1,  histApps: 1,  note: "Centroboa" },
    { id: "olla",       name: "OLLA",       role: "Fascia",    isGk: false, histGoals: 0,  histFouls: 0,  histApps: 0,  note: "Giocatore di Fascia" }
  ],
  officialCalendar: []
};

// ---------- STATO GLOBALE ----------
let appState = {
  selectedMatchId: null,
  activeMarketCategory: "all", // all | main | scorers | exclusions | gk | goliardic
  selectedHistoryMatchday: "ALL",
  betSlip: [],
  // Selezione dinamica utente per Over/Under, Gol Esatti (min 1) e Handicap Negativi
  customSelections: {
    ouMatchLine: null,
    ouHomeLine: null,
    ouAwayLine: null,
    exactMatchGoals: null,
    exactHomeGoals: null,
    exactAwayGoals: null,
    hcpHomeNegLine: -1.5,
    hcpAwayNegLine: -1.5,
    playerExactGoals: {} // { [playerId]: 1, 2, 3... }
  }
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
  }, 3600);
}

// ============================================================
// 2. CONTROLLO FISCHIO D'INIZIO (BLOCCO SCOMMESSE POST-INIZIO)
// ============================================================
function isMatchBettingClosed(match) {
  if (!match) return true;
  if (match.status === "settled" || match.status === "closed") return true;
  if (match.kickoffIso) {
    const kickoffMs = new Date(match.kickoffIso).getTime();
    if (!isNaN(kickoffMs) && Date.now() >= kickoffMs) {
      return true;
    }
  }
  return false;
}

function formatKickoffCountdown(kickoffIso) {
  if (!kickoffIso) return "Fischio d'inizio da definire";
  const kickoffMs = new Date(kickoffIso).getTime();
  if (isNaN(kickoffMs)) return "Fischio d'inizio da definire";

  const diff = kickoffMs - Date.now();
  const formattedDate = new Date(kickoffMs).toLocaleString("it-IT", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  if (diff <= 0) {
    return `🔒 SCOMMESSE CHIUSE · Fischio d'inizio superato (${formattedDate})`;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return `⏳ Chiude al fischio d'inizio (${formattedDate}) · Tempo rimasto: ${days}g ${hours}h ${mins}m ${secs}s`;
}

// ============================================================
// 3. SISTEMA DI LOGIN SEMPLICE & CREDITI (100 CREDITI INIZIALI)
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
  pushSharedStateToCloud();
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
    <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:8px;">Oppure entra con un clic su un profilo esistente:</div>
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
// 4. MOTORE AI DI POISSON BASATO SULLO STORICO + PRESENZE
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

function computeNewSeasonPlayerStats(matchesOverride = null) {
  let playedMatches = [];
  if (Array.isArray(matchesOverride)) {
    playedMatches = matchesOverride.filter(m => m.status === "settled");
  } else {
    const raw = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          playedMatches = parsed.filter(m => m.status === "settled");
        }
      } catch (e) {}
    }
  }
  const histApps = getHistoricalAppearancesMap();

  return HISTORICAL_AI_REFERENCE.roster.map(p => {
    let newSeasonApps = 0;
    let newSeasonGoals = 0;
    let newSeasonFouls = 0;
    let newSeasonOuts = 0;
    const foulHistory = [];

    playedMatches.forEach((m, idx) => {
      const presentIds = m.presentPlayerIds || [];
      const goalsMap = m.playerGoals || {};
      const foulsMap = m.playerFouls || {};
      if (presentIds.includes(p.id)) {
        newSeasonApps++;
        newSeasonGoals += Number(goalsMap[p.id] || 0);
        const f = Math.min(3, Math.max(0, Number(foulsMap[p.id] || 0)));
        newSeasonFouls += f;
        if (f === 3) newSeasonOuts++;
        foulHistory.push(`G${m.matchday || (idx + 1)}: ${f}`);
      }
    });

    return {
      ...p,
      histApps: histApps[p.id] ?? p.histApps,
      newSeasonApps,
      newSeasonGoals,
      newSeasonFouls,
      newSeasonOuts,
      foulHistory
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

  const lambdaHome = isHome ? lambdaOppidum : lambdaOpponent;
  const lambdaAway = isHome ? lambdaOpponent : lambdaOppidum;
  const lambdaTotal = lambdaHome + lambdaAway;

  // Distribuzione Gaussiana/Overdispersed calibrata sulla Pallanuoto (varianza più ampia del Poisson puro)
  // permette di avere molte più opzioni di range Over/Under giocabili (da 10.5 a 35.5 sul match e da 3.5 a 20.5 sulle squadre)
  const normalCdf = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - p : p;
  };

  const overProbWaterPolo = (mean, line, spreadFactor = 2.05) => {
    const sigma = Math.sqrt(mean) * spreadFactor;
    const z = (line - mean) / sigma;
    return Math.max(0.005, Math.min(0.995, 1 - normalCdf(z)));
  };

  // Costruisce tutti i range Over/Under validi (molte più opzioni!), escludendo solo quote < 1.08
  const buildValidOuRanges = (lam, minK, maxK, spreadFactor = 2.05) => {
    const list = [];
    for (let k = minK; k <= maxK; k++) {
      const line = k + 0.5;
      const pOver = overProbWaterPolo(lam, line, spreadFactor);
      const pUnder = 1 - pOver;
      const rawOddOver = Number((1 / (pOver * 1.045)).toFixed(2));
      const rawOddUnder = Number((1 / (pUnder * 1.045)).toFixed(2));
      if (rawOddOver >= MIN_VALID_ODD && rawOddUnder >= MIN_VALID_ODD && rawOddOver <= 25 && rawOddUnder <= 25) {
        list.push({
          line,
          oddOver: rawOddOver,
          oddUnder: rawOddUnder
        });
      }
    }
    return list;
  };

  // 1) Ampio range Over/Under Tutto il Match (circa 22-26 linee selezionabili!)
  const ouTotalLines = buildValidOuRanges(lambdaTotal, 8, 38, 2.15);
  // 2) Ampio range Over/Under Squadra Casa (circa 15-18 linee selezionabili!)
  const ouHomeLines = buildValidOuRanges(lambdaHome, 2, 23, 2.05);
  // 3) Ampio range Over/Under Squadra Trasferta (circa 15-18 linee selezionabili!)
  const ouAwayLines = buildValidOuRanges(lambdaAway, 2, 23, 2.05);

  // 4) Handicap SOLO NEGATIVI (-1.5, -2.5, -3.5, -4.5, -5.5, -6.5, -7.5, -8.5, -9.5, -10.5)
  // Per vincere una scommessa con Handicap, la squadra scelta deve vincere con almeno 2, 3, 4... gol di scarto!
  const diffSigma = Math.sqrt(lambdaHome + lambdaAway) * 1.65;
  const handicapNegativeLines = [];
  for (let margin = 1; margin <= 10; margin++) {
    const negLine = -(margin + 0.5); // -1.5, -2.5, ..., -10.5
    const neededDiff = margin + 0.5; // deve vincere di almeno margin+1 gol
    const zHome = (neededDiff - (lambdaHome - lambdaAway)) / diffSigma;
    const zAway = (neededDiff - (lambdaAway - lambdaHome)) / diffSigma;
    const pHomeWinByMargin = Math.max(0.015, Math.min(0.88, 1 - normalCdf(zHome)));
    const pAwayWinByMargin = Math.max(0.015, Math.min(0.88, 1 - normalCdf(zAway)));

    const oddHomeNeg = Number(Math.max(MIN_VALID_ODD, Math.min(28.0, 1 / (pHomeWinByMargin * 1.05))).toFixed(2));
    const oddAwayNeg = Number(Math.max(MIN_VALID_ODD, Math.min(28.0, 1 / (pAwayWinByMargin * 1.05))).toFixed(2));

    handicapNegativeLines.push({
      negLine, // es. -1.5
      negLineStr: negLine.toFixed(1), // "-1.5"
      minGoalsDiff: margin + 1, // es. 2 gol di scarto
      oddHomeNeg,
      oddAwayNeg
    });
  }

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
    const playerLambda = Math.max(0.12, lambdaOppidum * (weight / sumWeights));
    const p1Plus = 1 - Math.exp(-playerLambda);
    const p2Plus = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda));
    const p3Plus = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda) + poissonPmf(2, playerLambda));

    return {
      playerId: player.id,
      name: player.name,
      role: player.role,
      leadership: player.leadership || "",
      newSeasonGoals: player.newSeasonGoals,
      newSeasonApps: player.newSeasonApps,
      expectedGoals: Number(playerLambda.toFixed(2)),
      odd1Plus: probToOdd(p1Plus, 1.06, 1.15, 8.50),
      odd2Plus: probToOdd(p2Plus, 1.06, 1.50, 16.00),
      odd3Plus: probToOdd(p3Plus, 1.05, 2.30, 25.00)
    };
  }).sort((a, b) => a.odd1Plus - b.odd1Plus);

  // Calcolo Quote Espulsioni (Falli Personali: Esatti "Solo 1", "Solo 2", "3 Falli" + Soglie "0", "1+", "2+")
  const rivalIntensity = Math.min(1.18, Math.max(0.90, lambdaOpponent / 11.0));
  const exclusionMarkets = activeFieldPlayers.map(p => {
    let baseFoulLambda = 0.88; // Giocatori di Fascia
    if (p.role === "Difensore") baseFoulLambda = 1.58; // Marcatori del centroboa avversario
    else if (p.role === "Centroboa") baseFoulLambda = 1.22; // Lotta ai 2 metri

    const foulLambda = baseFoulLambda * rivalIntensity;
    const pExact0 = poissonPmf(0, foulLambda);
    const pExact1 = poissonPmf(1, foulLambda);
    const pExact2 = poissonPmf(2, foulLambda);
    const pFoul1Plus = 1 - pExact0;
    const pFoul2Plus = 1 - (pExact0 + pExact1);
    const pFoul3 = 1 - (pExact0 + pExact1 + pExact2);

    return {
      playerId: p.id,
      name: p.name,
      role: p.role,
      leadership: p.leadership || "",
      oddExact0: probToOdd(pExact0, 1.06, 1.35, 6.50),
      oddExact1: probToOdd(pExact1, 1.06, 2.10, 4.20),
      oddExact2: probToOdd(pExact2, 1.06, 2.85, 6.80),
      oddFoul1: probToOdd(pFoul1Plus, 1.06, 1.18, 3.50),
      oddFoul2: probToOdd(pFoul2Plus, 1.06, 1.75, 6.50),
      oddFoul3: probToOdd(pFoul3, 1.05, 2.90, 14.00)
    };
  }).sort((a, b) => a.oddFoul3 - b.oddFoul3);

  const gkSaveLine = Math.max(8.5, Math.round(lambdaOpponent * 0.85) - 0.5);
  // Rimosso "Difesa Oppidum subisce Under X.5 gol" dalla sezione portieri
  const goalkeeperMarkets = [
    { id: "gk_atzeni_goal",  label: "⚽ Gol di ATZENI in partita!", sub: "Tiro da porta a porta o salita sul finale", odd: 15.00 },
    { id: "gk_faret_goal",   label: "⚽ Gol di FARET in partita!",  sub: "Tiro da porta a porta o salita sul finale", odd: 15.00 },
    { id: "gk_atzeni_saves", label: `🧤 ATZENI Over ${gkSaveLine} parate`, sub: "Specialista tra i pali", odd: 1.85 },
    { id: "gk_faret_saves",  label: `🧤 FARET Over ${gkSaveLine} parate`, sub: "Muro di Terramaini", odd: 1.85 },
    { id: "gk_rigore",       label: "🧤 ATZENI o FARET para almeno un rigore (5m)", sub: "Boato della panchina", odd: 2.75 },
    { id: "gk_clean_q",      label: "🔒 Porta inviolata in almeno un quarto (8')", sub: "Saracinesca abbassata", odd: 3.40 },
    { id: "gk_assist",       label: "🚀 Assist diretto di ATZENI o FARET in controfuga", sub: "Lancio sul bomber", odd: 4.50 }
  ];

  const goliardicMarkets = [
    { id: "gol_olla_esordio", label: "🆕 OLLA segna in questa partita!", sub: "Quota speciale nuovo innesto", odd: 2.90 },
    { id: "gol_pittotti_gol", label: "💥 PITTOTTI sblocca il tabellino e segna!", sub: "Primo gol stagionale", odd: 4.20 },
    { id: "gol_cannas_urlo",  label: "📢 Mister Chicco Cannas perde la voce entro il 2° tempo", sub: "Classico di Terramaini", odd: 1.45 },
    { id: "gol_melis_lob",    label: "🤽 MELIS segna con palombella ignorante", sub: "Tocco morbido sotto l'incrocio", odd: 2.30 },
    { id: "gol_proteste",     label: "🟥 Almeno un'espulsione per proteste in partita", sub: "Tensione agonistica in vasca", odd: 1.75 },
    { id: "gol_ichnusa",      label: "🍺 Cassa di Ichnusa portata nello spogliatoio a fine gara", sub: "Terzo tempo assicurato", odd: 1.35 }
  ];

  return {
    lambdaOppidum: Number(lambdaOppidum.toFixed(1)),
    lambdaOpponent: Number(lambdaOpponent.toFixed(1)),
    lambdaHome: Number(lambdaHome.toFixed(1)),
    lambdaAway: Number(lambdaAway.toFixed(1)),
    lambdaTotal: Number(lambdaTotal.toFixed(1)),
    prob1: Math.round(p1 * 100),
    probX: Math.round(pX * 100),
    prob2: Math.round(p2 * 100),
    rivalNote: oppRef?.note || "Sfida di campionato Serie C",
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
      oddHandicapOppidum: 1.85,
      ouTotalLines,
      ouHomeLines,
      ouAwayLines,
      handicapNegativeLines
    },
    scorerMarkets,
    exclusionMarkets,
    goalkeeperMarkets,
    goliardicMarkets
  };
}

// ============================================================
// 5. PARTITE (CON ORARIO FISCHIO D'INIZIO) E CLASSIFICA
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
      matchday: 1,
      title: "1ª Giornata — Girone 6 (C.R. Sardegna)",
      date: "Sabato 28 Nov 2026 · Ore 15:00",
      kickoffIso: "2026-11-28T15:00:00+01:00",
      opponent: "ANACONDA PALLANUOTO",
      isHome: true,
      boostOppidum: 1.15,
      status: "open",
      scoreUs: null,
      scoreThem: null,
      presentPlayerIds: [...allIds],
      playerGoals: {},
      analysis: generateAiOddsForMatch("ANACONDA PALLANUOTO", true, 1.15, allIds)
    },
    {
      id: "ex_match_2",
      matchday: 2,
      title: "2ª Giornata — Girone 6 (C.R. Sardegna)",
      date: "Sabato 5 Dic 2026 · Ore 16:30",
      kickoffIso: "2026-12-05T16:30:00+01:00",
      opponent: "R.N. CAGLIARI",
      isHome: true,
      boostOppidum: 1.15,
      status: "open",
      scoreUs: null,
      scoreThem: null,
      presentPlayerIds: [...allIds],
      playerGoals: {},
      analysis: generateAiOddsForMatch("R.N. CAGLIARI", true, 1.15, allIds)
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
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {}
  }
  const initialSlips = [
    {
      id: "slip_ex_1",
      userId: "u_1",
      userName: "Scommettitore 1",
      matchday: 1,
      matchdayLabel: "1ª Giornata — OPPIDUM SPORT CAGLIARI vs ANACONDA PALLANUOTO",
      createdAt: "18 nov, 14:30",
      picks: [
        { matchId: "ex_match_1", matchday: 1, matchTitle: "1ª Giornata: Oppidum vs ANACONDA PALLANUOTO", marketKey: "1X2_1", label: "1 · Oppidum", odd: 2.15 },
        { matchId: "ex_match_1", matchday: 1, matchTitle: "1ª Giornata: Oppidum vs ANACONDA PALLANUOTO", marketKey: "SC_melis_2", label: "MELIS 2+ Gol", odd: 1.85 }
      ],
      stake: 15,
      totalOdd: 3.98,
      potentialPayout: 60,
      status: "open"
    },
    {
      id: "slip_ex_2",
      userId: "u_2",
      userName: "Scommettitore 2",
      matchday: 1,
      matchdayLabel: "1ª Giornata — OPPIDUM SPORT CAGLIARI vs ANACONDA PALLANUOTO",
      createdAt: "18 nov, 14:45",
      picks: [
        { matchId: "ex_match_1", matchday: 1, matchTitle: "1ª Giornata: Oppidum vs ANACONDA PALLANUOTO", marketKey: "gk_rigore", label: "🧤 ATZENI o FARET para almeno un rigore (5m)", odd: 2.75 }
      ],
      stake: 10,
      totalOdd: 2.75,
      potentialPayout: 28,
      status: "open"
    },
    {
      id: "slip_ex_3",
      userId: "u_3",
      userName: "Scommettitore 3",
      matchday: 2,
      matchdayLabel: "2ª Giornata — OPPIDUM SPORT CAGLIARI vs R.N. CAGLIARI",
      createdAt: "18 nov, 15:00",
      picks: [
        { matchId: "ex_match_2", matchday: 2, matchTitle: "2ª Giornata: Oppidum vs R.N. CAGLIARI", marketKey: "DC_1X", label: "1X (Oppidum/Par.)", odd: 1.65 },
        { matchId: "ex_match_2", matchday: 2, matchTitle: "2ª Giornata: Oppidum vs R.N. CAGLIARI", marketKey: "SC_piras_1", label: "PIRAS Segna 1+", odd: 1.38 }
      ],
      stake: 10,
      totalOdd: 2.28,
      potentialPayout: 23,
      status: "open"
    }
  ];
  localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(initialSlips));
  return initialSlips;
}

function saveBetSlips(slips) {
  localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(slips));
  pushSharedStateToCloud();
}

function computeGirone6Table() {
  const table = {};
  GIRONE_6_TEAMS.forEach(name => {
    table[name] = { name, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
  });

  const settled = getSeasonMatches().filter(m => m.status === "settled");
  settled.forEach(m => {
    const oppName = "OPPIDUM SPORT CAGLIARI";
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

// ---------- NAVIGAZIONE TABS & SCHEDINA MOBILE ----------
function switchTab(tabId) {
  closeMobileBetSlip();
  document.querySelectorAll(".tab-panel").forEach(el => {
    el.classList.toggle("active", el.id === `tab-${tabId}`);
  });
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".mob-nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mobtab === tabId);
  });
  const container = document.getElementById("mainWorkspace");
  if (container) {
    const showSidebar = (tabId === "betting");
    container.classList.toggle("full-width", !showSidebar);
    const sidebar = document.getElementById("betslipSidebar");
    if (sidebar && window.innerWidth > 960) {
      sidebar.style.display = showSidebar ? "block" : "none";
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openMobileBetSlip() {
  const sidebar = document.getElementById("betslipSidebar");
  if (sidebar) {
    sidebar.classList.add("mobile-open");
  }
}

function closeMobileBetSlip() {
  const sidebar = document.getElementById("betslipSidebar");
  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }
}

// ============================================================
// 6. RENDERING TAB 1: PALINSESTO & SCOMMESSE (CON CUT-OFF)
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
          In attesa del Calendario Ufficiale — Serie C
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
  const closed = isMatchBettingClosed(activeMatch);

  document.getElementById("matchSelectorBar").innerHTML = openMatches.map(m => {
    const homeTeam = m.isHome ? "Oppidum S. Cagliari" : m.opponent;
    const awayTeam = m.isHome ? m.opponent : "Oppidum S. Cagliari";
    const isClosed = isMatchBettingClosed(m);
    return `
      <button type="button" class="match-pill ${m.id === activeMatch.id ? "active" : ""}" onclick="selectMatch('${esc(m.id)}')">
        <div class="mp-date">
          <span>${esc(m.title)}</span>
          <span>${isClosed ? "🔒 CHIUSA" : (m.isHome ? "🏠 CASA" : "✈️ FUORI")}</span>
        </div>
        <div class="mp-teams">${esc(homeTeam)} vs ${esc(awayTeam)}</div>
        <div class="mp-meta">1: <strong>${m.analysis.mainMarkets.odd1.toFixed(2)}</strong> · X: <strong>${m.analysis.mainMarkets.oddX.toFixed(2)}</strong> · 2: <strong>${m.analysis.mainMarkets.odd2.toFixed(2)}</strong></div>
      </button>
    `;
  }).join("");

  const homeName = activeMatch.isHome ? "Oppidum S. Cagliari" : activeMatch.opponent;
  const awayName = activeMatch.isHome ? activeMatch.opponent : "Oppidum S. Cagliari";

  document.getElementById("featuredMatchBox").innerHTML = `
    <div class="fm-top">
      <span>🏆 ${esc(activeMatch.title)}</span>
      <span id="liveKickoffBanner" style="color:${closed ? '#f87171' : 'var(--gold)'};font-weight:700;">
        ${formatKickoffCountdown(activeMatch.kickoffIso)}
      </span>
    </div>
    <div class="fm-teams">
      <div>
        <div class="fm-team-name">${esc(homeName)}</div>
        <div class="fm-team-sub">${activeMatch.isHome ? "Piscina Terramaini · Rossoblù" : "Squadra Ospitante"}</div>
      </div>
      <div class="fm-vs">${closed ? "🔒" : "VS"}</div>
      <div>
        <div class="fm-team-name">${esc(awayName)}</div>
        <div class="fm-team-sub">${activeMatch.isHome ? "Squadra Ospite" : "Oppidum in Trasferta"}</div>
      </div>
    </div>
    <div class="ai-oracle-box">
      <div class="ai-oracle-header">
        <span>🤖 Analisi Pre-Partita Oracolo AI</span>
        <span>Gol Stimati AI: <strong>Oppidum ${an.lambdaOppidum}</strong> — <strong>${esc(activeMatch.opponent)} ${an.lambdaOpponent}</strong></span>
      </div>
      <div style="font-size:0.82rem;color:#cbd5e1;">📌 ${esc(an.rivalNote || "Sfida di campionato Serie C")}</div>
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

// Aggiorna il countdown del fischio d'inizio ogni secondo
setInterval(() => {
  const banner = document.getElementById("liveKickoffBanner");
  if (!banner) return;
  const openMatches = getSeasonMatches().filter(m => m.status === "open");
  const activeMatch = openMatches.find(m => m.id === appState.selectedMatchId) || openMatches[0];
  if (activeMatch) {
    banner.textContent = formatKickoffCountdown(activeMatch.kickoffIso);
  }
}, 1000);

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
  const closed = isMatchBettingClosed(match);
  const matchTitle = match.isHome
    ? `Oppidum vs ${match.opponent}`
    : `${match.opponent} vs Oppidum`;
  return `
    <button type="button" class="odd-btn ${sel}" ${closed ? "disabled style='opacity:0.45;cursor:not-allowed;'" : ""}
      onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', '${esc(marketKey)}', '${esc(label)}', ${Number(odd)})">
      <div>
        <span class="odd-label">${esc(label)}</span>
        ${sub ? `<span class="odd-sub">${esc(sub)}</span>` : ""}
      </div>
      <span class="odd-val">${Number(odd).toFixed(2)}</span>
    </button>
  `;
}

// Calcola la quota per un numero ESATTO di gol (k >= 1, mai 0) con Poisson
function computeExactGoalsOdd(lambda, kGoals) {
  const k = Math.max(1, parseInt(kGoals, 10) || 1);
  const p = poissonPmf(k, lambda);
  const rawOdd = 1 / (Math.max(0.002, p) * 1.05);
  return Number(Math.max(MIN_VALID_ODD, Math.min(35.0, rawOdd)).toFixed(2));
}

function updateCustomMarketSelection(key, val, matchId, playerId = null) {
  if (key === "playerExactGoals" && playerId) {
    let n = parseInt(val, 10);
    if (isNaN(n) || n < 1) n = 1; // Minimo 1 gol, mai 0
    if (n > 15) n = 15;
    appState.customSelections.playerExactGoals[playerId] = n;
  } else if (key.startsWith("exact")) {
    let n = parseInt(val, 10);
    if (isNaN(n) || n < 1) n = 1; // Mai zero! Minimo 1 gol
    if (n > 45) n = 45;
    appState.customSelections[key] = n;
  } else {
    appState.customSelections[key] = parseFloat(val);
  }
  const matches = getSeasonMatches();
  const activeMatch = matches.find(m => m.id === (matchId || appState.selectedMatchId)) || matches[0];
  if (activeMatch) renderMarketsForMatch(activeMatch);
}

function renderMarketsForMatch(match) {
  const cat = appState.activeMarketCategory;
  const an = match.analysis;
  const mm = an.mainMarkets;
  const closed = isMatchBettingClosed(match);
  const homeName = match.isHome ? "Oppidum" : match.opponent;
  const awayName = match.isHome ? match.opponent : "Oppidum";

  const lamHome = an.lambdaHome || (match.isHome ? an.lambdaOppidum : an.lambdaOpponent);
  const lamAway = an.lambdaAway || (match.isHome ? an.lambdaOpponent : an.lambdaOppidum);
  const lamTot  = an.lambdaTotal || (lamHome + lamAway);

  const ouTotList  = mm.ouTotalLines || [];
  const ouHomeList = mm.ouHomeLines || [];
  const ouAwayList = mm.ouAwayLines || [];
  const hcpNegList = mm.handicapNegativeLines || [];

  const cs = appState.customSelections;
  if (!cs.ouMatchLine || !ouTotList.some(r => r.line === cs.ouMatchLine)) {
    cs.ouMatchLine = ouTotList[Math.floor(ouTotList.length / 2)]?.line || mm.totalLine;
  }
  if (!cs.ouHomeLine || !ouHomeList.some(r => r.line === cs.ouHomeLine)) {
    cs.ouHomeLine = ouHomeList[Math.floor(ouHomeList.length / 2)]?.line || mm.oppidumLine;
  }
  if (!cs.ouAwayLine || !ouAwayList.some(r => r.line === cs.ouAwayLine)) {
    cs.ouAwayLine = ouAwayList[Math.floor(ouAwayList.length / 2)]?.line || 10.5;
  }
  if (!cs.hcpHomeNegLine || !hcpNegList.some(r => r.negLine === cs.hcpHomeNegLine)) {
    cs.hcpHomeNegLine = -1.5;
  }
  if (!cs.hcpAwayNegLine || !hcpNegList.some(r => r.negLine === cs.hcpAwayNegLine)) {
    cs.hcpAwayNegLine = -1.5;
  }
  if (!cs.exactMatchGoals || cs.exactMatchGoals < 1) cs.exactMatchGoals = Math.max(1, Math.round(lamTot));
  if (!cs.exactHomeGoals  || cs.exactHomeGoals < 1)  cs.exactHomeGoals  = Math.max(1, Math.round(lamHome));
  if (!cs.exactAwayGoals  || cs.exactAwayGoals < 1)  cs.exactAwayGoals  = Math.max(1, Math.round(lamAway));

  const selTotRow  = ouTotList.find(r => r.line === cs.ouMatchLine)  || ouTotList[0]  || { line: mm.totalLine, oddOver: 1.85, oddUnder: 1.85 };
  const selHomeRow = ouHomeList.find(r => r.line === cs.ouHomeLine) || ouHomeList[0] || { line: mm.oppidumLine, oddOver: 1.85, oddUnder: 1.85 };
  const selAwayRow = ouAwayList.find(r => r.line === cs.ouAwayLine) || ouAwayList[0] || { line: 10.5, oddOver: 1.85, oddUnder: 1.85 };
  const selHcpHome = hcpNegList.find(r => r.negLine === cs.hcpHomeNegLine) || hcpNegList[0] || { negLine: -1.5, negLineStr: "-1.5", minGoalsDiff: 2, oddHomeNeg: 2.40, oddAwayNeg: 2.10 };
  const selHcpAway = hcpNegList.find(r => r.negLine === cs.hcpAwayNegLine) || hcpNegList[0] || { negLine: -1.5, negLineStr: "-1.5", minGoalsDiff: 2, oddHomeNeg: 2.40, oddAwayNeg: 2.10 };

  const oddExactMatch = computeExactGoalsOdd(lamTot, cs.exactMatchGoals);
  const oddExactHome  = computeExactGoalsOdd(lamHome, cs.exactHomeGoals);
  const oddExactAway  = computeExactGoalsOdd(lamAway, cs.exactAwayGoals);

  let html = "";

  if (closed) {
    html += `
      <div class="market-block" style="border-color:#ef4444;background:rgba(239,68,68,0.12);">
        <strong style="color:#fca5a5;">🔒 Fischio d'inizio superato:</strong> le scommesse per questa partita sono chiuse e non vengono più conteggiate.
      </div>
    `;
  }

  if (cat === "all" || cat === "main") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🤽 Esito Finale 1X2 &amp; Doppia Chance</div>
          <span class="market-badge">Valide fino al fischio d'inizio</span>
        </div>
        <div class="odds-grid">
          ${oddButtonHtml(match, "1X2_1", `1 · ${homeName}`, `Prob. AI ${an.prob1}%`, mm.odd1)}
          ${oddButtonHtml(match, "1X2_X", `X · Pareggio`, `Prob. AI ${an.probX}%`, mm.oddX)}
          ${oddButtonHtml(match, "1X2_2", `2 · ${awayName}`, `Prob. AI ${an.prob2}%`, mm.odd2)}
          ${oddButtonHtml(match, "DC_1X", `1X (${homeName}/Par.)`, "Doppia Chance", mm.odd1X)}
          ${oddButtonHtml(match, "DC_X2", `X2 (Par./${awayName})`, "Doppia Chance", mm.oddX2)}
          ${oddButtonHtml(match, "DC_12", `12 (No Pareggio)`, "Doppia Chance", mm.odd12)}
        </div>
      </div>

      <!-- 1. OVER / UNDER DINAMICO: TUTTO IL MATCH + CASA + TRASFERTA -->
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🔢 Over / Under Gol — Seleziona il Range (Match · Casa · Trasferta)</div>
          <span class="market-badge">${ouTotList.length} soglie Match · ${ouHomeList.length} soglie Squadra</span>
        </div>

        <!-- A) Tutto il Match -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <strong style="font-size:0.86rem;color:var(--gold);">🤽 Somma Gol Tutto il Match (${esc(homeName)} + ${esc(awayName)})</strong>
            <div style="display:flex;align-items:center;gap:8px;">
              <label for="selOuMatch" style="font-size:0.76rem;color:var(--text-muted);">Scegli Soglia (${ouTotList.length} opzioni):</label>
              <select id="selOuMatch" style="width:auto;padding:6px 10px;font-weight:800;"
                onchange="updateCustomMarketSelection('ouMatchLine', this.value, '${esc(match.id)}')">
                ${ouTotList.map(r => `
                  <option value="${r.line}" ${r.line === selTotRow.line ? "selected" : ""}>
                    Linea ${r.line} gol (Over @${r.oddOver.toFixed(2)} / Under @${r.oddUnder.toFixed(2)})
                  </option>
                `).join("")}
              </select>
            </div>
          </div>
          <div class="odds-grid two-cols">
            ${oddButtonHtml(match, `OU_MATCH_OVER_${selTotRow.line}`, `Over ${selTotRow.line} Gol Match`, `Almeno ${Math.ceil(selTotRow.line)} gol totali`, selTotRow.oddOver)}
            ${oddButtonHtml(match, `OU_MATCH_UNDER_${selTotRow.line}`, `Under ${selTotRow.line} Gol Match`, `Massimo ${Math.floor(selTotRow.line)} gol totali`, selTotRow.oddUnder)}
          </div>
        </div>

        <!-- B) Squadra Casa -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <strong style="font-size:0.86rem;color:#34d399;">🏠 Gol Squadra Casa: ${esc(homeName)}</strong>
            <div style="display:flex;align-items:center;gap:8px;">
              <label for="selOuHome" style="font-size:0.76rem;color:var(--text-muted);">Scegli Soglia (${ouHomeList.length} opzioni):</label>
              <select id="selOuHome" style="width:auto;padding:6px 10px;font-weight:800;"
                onchange="updateCustomMarketSelection('ouHomeLine', this.value, '${esc(match.id)}')">
                ${ouHomeList.map(r => `
                  <option value="${r.line}" ${r.line === selHomeRow.line ? "selected" : ""}>
                    Linea ${r.line} gol (Over @${r.oddOver.toFixed(2)} / Under @${r.oddUnder.toFixed(2)})
                  </option>
                `).join("")}
              </select>
            </div>
          </div>
          <div class="odds-grid two-cols">
            ${oddButtonHtml(match, `OU_HOME_OVER_${selHomeRow.line}`, `Casa Over ${selHomeRow.line} (${homeName})`, `Almeno ${Math.ceil(selHomeRow.line)} gol`, selHomeRow.oddOver)}
            ${oddButtonHtml(match, `OU_HOME_UNDER_${selHomeRow.line}`, `Casa Under ${selHomeRow.line} (${homeName})`, `Massimo ${Math.floor(selHomeRow.line)} gol`, selHomeRow.oddUnder)}
          </div>
        </div>

        <!-- C) Squadra Trasferta -->
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <strong style="font-size:0.86rem;color:var(--oppidum-sky);">✈️ Gol Squadra Trasferta: ${esc(awayName)}</strong>
            <div style="display:flex;align-items:center;gap:8px;">
              <label for="selOuAway" style="font-size:0.76rem;color:var(--text-muted);">Scegli Soglia (${ouAwayList.length} opzioni):</label>
              <select id="selOuAway" style="width:auto;padding:6px 10px;font-weight:800;"
                onchange="updateCustomMarketSelection('ouAwayLine', this.value, '${esc(match.id)}')">
                ${ouAwayList.map(r => `
                  <option value="${r.line}" ${r.line === selAwayRow.line ? "selected" : ""}>
                    Linea ${r.line} gol (Over @${r.oddOver.toFixed(2)} / Under @${r.oddUnder.toFixed(2)})
                  </option>
                `).join("")}
              </select>
            </div>
          </div>
          <div class="odds-grid two-cols">
            ${oddButtonHtml(match, `OU_AWAY_OVER_${selAwayRow.line}`, `Trasferta Over ${selAwayRow.line} (${awayName})`, `Almeno ${Math.ceil(selAwayRow.line)} gol`, selAwayRow.oddOver)}
            ${oddButtonHtml(match, `OU_AWAY_UNDER_${selAwayRow.line}`, `Trasferta Under ${selAwayRow.line} (${awayName})`, `Massimo ${Math.floor(selAwayRow.line)} gol`, selAwayRow.oddUnder)}
          </div>
        </div>
      </div>

      <!-- 2. NUMERO ESATTO DI GOL SQUADRA / MATCH (SCELTO DALL'UTENTE, MINIMO 1, MAI ZERO) -->
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🎯 Numero Esatto di Gol — Match &amp; Squadre (Minimo 1 · No 0)</div>
          <span class="market-badge">Inserisci il numero esatto di gol</span>
        </div>

        <div class="odds-grid scorers-grid">
          <div class="scorer-market-row">
            <div class="scorer-info">
              <span class="scorer-name">🤽 Gol Esatti Tutto il Match</span>
              <span class="scorer-stat-pill">Attesi ~${Math.round(lamTot)}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
              <label style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">Numero Gol (min 1):</label>
              <input type="number" min="1" max="45" value="${cs.exactMatchGoals}"
                style="padding:6px 10px;font-weight:800;text-align:center;"
                onchange="updateCustomMarketSelection('exactMatchGoals', this.value, '${esc(match.id)}')" />
            </div>
            ${oddButtonHtml(match, `EXACT_GOALS_MATCH_${cs.exactMatchGoals}`, `Match: Esattamente ${cs.exactMatchGoals} Gol`, "Somma esatta gol a fine gara", oddExactMatch)}
          </div>

          <div class="scorer-market-row">
            <div class="scorer-info">
              <span class="scorer-name">🏠 Gol Esatti ${esc(homeName)}</span>
              <span class="scorer-stat-pill">Casa (~${Math.round(lamHome)})</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
              <label style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">Numero Gol (min 1):</label>
              <input type="number" min="1" max="30" value="${cs.exactHomeGoals}"
                style="padding:6px 10px;font-weight:800;text-align:center;"
                onchange="updateCustomMarketSelection('exactHomeGoals', this.value, '${esc(match.id)}')" />
            </div>
            ${oddButtonHtml(match, `EXACT_GOALS_HOME_${cs.exactHomeGoals}`, `${homeName}: Esattamente ${cs.exactHomeGoals} Gol`, "Numero esatto gol squadra Casa", oddExactHome)}
          </div>

          <div class="scorer-market-row">
            <div class="scorer-info">
              <span class="scorer-name">✈️ Gol Esatti ${esc(awayName)}</span>
              <span class="scorer-stat-pill">Trasferta (~${Math.round(lamAway)})</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin:4px 0;">
              <label style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">Numero Gol (min 1):</label>
              <input type="number" min="1" max="30" value="${cs.exactAwayGoals}"
                style="padding:6px 10px;font-weight:800;text-align:center;"
                onchange="updateCustomMarketSelection('exactAwayGoals', this.value, '${esc(match.id)}')" />
            </div>
            ${oddButtonHtml(match, `EXACT_GOALS_AWAY_${cs.exactAwayGoals}`, `${awayName}: Esattamente ${cs.exactAwayGoals} Gol`, "Numero esatto gol squadra Trasferta", oddExactAway)}
          </div>
        </div>
      </div>

      <!-- 3. HANDICAP GOL — SOLO NEGATIVI (-1.5 .. -10.5) SIA PER CASA CHE PER TRASFERTA -->
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">⚖️ Handicap Gol (Solo Handicap Negativi · Vittoria con Scarto)</div>
          <span class="market-badge">Da -1.5 a -10.5 gol</span>
        </div>

        <div class="odds-grid two-cols">
          <!-- Handicap Negativo Squadra Casa -->
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
              <strong style="font-size:0.84rem;color:var(--gold);">🏠 Handicap ${esc(homeName)} (Casa)</strong>
              <select style="width:auto;padding:5px 8px;font-weight:800;"
                onchange="updateCustomMarketSelection('hcpHomeNegLine', this.value, '${esc(match.id)}')">
                ${hcpNegList.map(r => `
                  <option value="${r.negLine}" ${r.negLine === selHcpHome.negLine ? "selected" : ""}>
                    ${r.negLineStr} (Vince di ${r.minGoalsDiff}+ gol) → @${r.oddHomeNeg.toFixed(2)}
                  </option>
                `).join("")}
              </select>
            </div>
            ${oddButtonHtml(match, `HCP_HOME_NEG_${selHcpHome.negLine}`, `1 Handicap ${homeName} (${selHcpHome.negLineStr})`, `Vince con almeno ${selHcpHome.minGoalsDiff} gol di scarto`, selHcpHome.oddHomeNeg)}
          </div>

          <!-- Handicap Negativo Squadra Trasferta -->
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
              <strong style="font-size:0.84rem;color:var(--oppidum-sky);">✈️ Handicap ${esc(awayName)} (Trasferta)</strong>
              <select style="width:auto;padding:5px 8px;font-weight:800;"
                onchange="updateCustomMarketSelection('hcpAwayNegLine', this.value, '${esc(match.id)}')">
                ${hcpNegList.map(r => `
                  <option value="${r.negLine}" ${r.negLine === selHcpAway.negLine ? "selected" : ""}>
                    ${r.negLineStr} (Vince di ${r.minGoalsDiff}+ gol) → @${r.oddAwayNeg.toFixed(2)}
                  </option>
                `).join("")}
              </select>
            </div>
            ${oddButtonHtml(match, `HCP_AWAY_NEG_${selHcpAway.negLine}`, `2 Handicap ${awayName} (${selHcpAway.negLineStr})`, `Vince con almeno ${selHcpAway.minGoalsDiff} gol di scarto`, selHcpAway.oddAwayNeg)}
          </div>
        </div>
      </div>
    `;
  }

  if (cat === "all" || cat === "scorers") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🎯 Quote Marcatori Oppidum (1+ / 2+ / 3+ Gol &amp; Gol Esatti Giocatore)</div>
          <span class="market-badge">Scegli anche il numero esatto di gol di ogni giocatore</span>
        </div>
        <div class="odds-grid scorers-grid">
          ${an.scorerMarkets.map(sc => {
            const sel1 = isPickSelected(match.id, `SC_${sc.playerId}_1`) ? "selected" : "";
            const sel2 = isPickSelected(match.id, `SC_${sc.playerId}_2`) ? "selected" : "";
            const sel3 = isPickSelected(match.id, `SC_${sc.playerId}_3`) ? "selected" : "";
            const matchTitle = match.isHome ? `Oppidum vs ${match.opponent}` : `${match.opponent} vs Oppidum`;
            const disAttr = closed ? "disabled style='opacity:0.45;cursor:not-allowed;'" : "";

            // Numero esatto di gol scelto per questo giocatore (default: 1 gol, min 1)
            const chosenExact = Math.max(1, parseInt(cs.playerExactGoals[sc.playerId], 10) || 1);
            const oddExactPlayer = computeExactGoalsOdd(sc.expectedGoals || 0.45, chosenExact);
            const selExactP = isPickSelected(match.id, `SC_EXACT_${sc.playerId}_${chosenExact}`) ? "selected" : "";

            return `
              <div class="scorer-market-row">
                <div class="scorer-info">
                  <span class="scorer-name">🤽 ${esc(sc.name)}</span>
                  <span class="scorer-stat-pill">${esc(sc.role)} · xG ${sc.expectedGoals}</span>
                </div>
                <div style="font-size:0.68rem;color:var(--text-muted);font-weight:700;">Almeno N Gol (1+ / 2+ / 3+):</div>
                <div class="scorer-odds-mini">
                  <button type="button" class="odd-btn ${sel1}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_1', '${esc(sc.name)} Segna 1+ Gol', ${sc.odd1Plus})">
                    <span class="odd-label">Segna 1+</span>
                    <span class="odd-val">${sc.odd1Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel2}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_2', '${esc(sc.name)} 2+ Gol', ${sc.odd2Plus})">
                    <span class="odd-label">2+ Gol</span>
                    <span class="odd-val">${sc.odd2Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel3}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_3', '${esc(sc.name)} 3+ Gol', ${sc.odd3Plus})">
                    <span class="odd-label">3+ Gol</span>
                    <span class="odd-val">${sc.odd3Plus.toFixed(2)}</span>
                  </button>
                </div>

                <!-- GOL ESATTI DEL GIOCATORE IN PARTITA -->
                <div style="border-top:1px dashed var(--border);padding-top:6px;margin-top:4px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:6px;">
                    <span style="font-size:0.7rem;color:var(--gold);font-weight:700;">🎯 Gol Esatti in Partita (min 1):</span>
                    <input type="number" min="1" max="15" value="${chosenExact}"
                      style="width:58px;padding:4px 6px;font-weight:800;text-align:center;font-size:0.82rem;"
                      onchange="updateCustomMarketSelection('playerExactGoals', this.value, '${esc(match.id)}', '${esc(sc.playerId)}')" />
                  </div>
                  <button type="button" class="odd-btn ${selExactP}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_EXACT_${sc.playerId}_${chosenExact}', '${esc(sc.name)}: Esattamente ${chosenExact} Gol', ${oddExactPlayer})">
                    <span class="odd-label">Esattamente ${chosenExact} Gol</span>
                    <span class="odd-val">${oddExactPlayer.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  if (cat === "all" || cat === "exclusions") {
    const exList = an.exclusionMarkets || [];
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🟥 Espulsioni — Falli Personali (Esatti o Almeno)</div>
          <span class="market-badge">Solo 1 · Solo 2 · 3 Falli (Out) · 0 / 1+ / 2+</span>
        </div>
        <div class="odds-grid scorers-grid">
          ${exList.map(ex => {
            const selEx1 = isPickSelected(match.id, `EX_EXACT_${ex.playerId}_1`) ? "selected" : "";
            const selEx2 = isPickSelected(match.id, `EX_EXACT_${ex.playerId}_2`) ? "selected" : "";
            const selEx3 = isPickSelected(match.id, `EX_${ex.playerId}_3`) ? "selected" : "";
            const selEx0 = isPickSelected(match.id, `EX_EXACT_${ex.playerId}_0`) ? "selected" : "";
            const sel1Plus = isPickSelected(match.id, `EX_${ex.playerId}_1`) ? "selected" : "";
            const sel2Plus = isPickSelected(match.id, `EX_${ex.playerId}_2`) ? "selected" : "";
            const matchTitle = match.isHome ? `Oppidum vs ${match.opponent}` : `${match.opponent} vs Oppidum`;
            const disAttr = closed ? "disabled style='opacity:0.45;cursor:not-allowed;'" : "";
            const oddEx1 = ex.oddExact1 || 2.50;
            const oddEx2 = ex.oddExact2 || 3.40;
            const oddEx0 = ex.oddExact0 || 2.20;
            return `
              <div class="scorer-market-row">
                <div class="scorer-info">
                  <span class="scorer-name">🟥 ${esc(ex.name)}</span>
                  <span class="scorer-stat-pill">${esc(ex.role)}</span>
                </div>
                <div style="font-size:0.68rem;color:var(--gold);font-weight:700;margin-top:2px;">Numero Esatto di Falli:</div>
                <div class="scorer-odds-mini">
                  <button type="button" class="odd-btn ${selEx1}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_EXACT_${ex.playerId}_1', '${esc(ex.name)}: Solo 1 Fallo (Esatto)', ${oddEx1})">
                    <span class="odd-label">Solo 1</span>
                    <span class="odd-val">${oddEx1.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${selEx2}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_EXACT_${ex.playerId}_2', '${esc(ex.name)}: Solo 2 Falli (Esatto)', ${oddEx2})">
                    <span class="odd-label">Solo 2</span>
                    <span class="odd-val">${oddEx2.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${selEx3}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_${ex.playerId}_3', '${esc(ex.name)}: 3 Falli (Definitiva)', ${ex.oddFoul3})">
                    <span class="odd-label">3 Falli (Out)</span>
                    <span class="odd-val">${ex.oddFoul3.toFixed(2)}</span>
                  </button>
                </div>
                <div style="font-size:0.68rem;color:var(--text-muted);font-weight:700;margin-top:2px;">Soglie Falli (0 / Almeno):</div>
                <div class="scorer-odds-mini">
                  <button type="button" class="odd-btn ${selEx0}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_EXACT_${ex.playerId}_0', '${esc(ex.name)}: 0 Falli (Netto)', ${oddEx0})">
                    <span class="odd-label">0 Falli</span>
                    <span class="odd-val">${oddEx0.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel1Plus}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_${ex.playerId}_1', '${esc(ex.name)}: Almeno 1 Fallo (1+)', ${ex.oddFoul1})">
                    <span class="odd-label">1+ Fallo</span>
                    <span class="odd-val">${ex.oddFoul1.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel2Plus}" ${disAttr}
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'EX_${ex.playerId}_2', '${esc(ex.name)}: Almeno 2 Falli (2+)', ${ex.oddFoul2})">
                    <span class="odd-label">2+ Falli</span>
                    <span class="odd-val">${ex.oddFoul2.toFixed(2)}</span>
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
        <div class="odds-grid list-mobile">
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
        <div class="odds-grid list-mobile">
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
// 7. SCHEDINA INTERATTIVA (CON VERIFICA FISCHIO D'INIZIO)
// ============================================================
function toggleBetPick(matchId, matchTitle, marketKey, label, odd) {
  const matches = getSeasonMatches();
  const match = matches.find(m => m.id === matchId);
  if (isMatchBettingClosed(match)) {
    showToast("⛔ Scommesse chiuse per questa partita: il fischio d'inizio è già passato!");
    return;
  }

  const matchday = match?.matchday || 1;
  const fullTitle = `${matchday}ª Giornata: ${matchTitle}`;

  const idx = appState.betSlip.findIndex(i => i.matchId === matchId && i.marketKey === marketKey);
  if (idx >= 0) {
    appState.betSlip.splice(idx, 1);
  } else {
    appState.betSlip.push({
      id: uid("pick"),
      matchId,
      matchday,
      matchTitle: fullTitle,
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
  const mobCountEl = document.getElementById("mobSlipCount");
  const bodyEl = document.getElementById("betslipBody");
  if (mobCountEl) mobCountEl.textContent = appState.betSlip.length;
  if (!countEl || !bodyEl) return;

  countEl.textContent = appState.betSlip.length;

  if (!appState.betSlip.length) {
    bodyEl.innerHTML = `
      <div class="betslip-empty">
        <div style="font-size:2rem;margin-bottom:6px;">🎫</div>
        Clicca sulle quote della partita per comporre la tua schedina (valida fino al fischio d'inizio).
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
    closeMobileBetSlip();
    openLoginModal();
    showToast("🔑 Fai prima l'accesso rapido con il tuo nome per giocare la schedina!");
    return;
  }

  // Verifica rigorosa che NESSUNA partita nella schedina abbia già superato il fischio d'inizio
  const matches = getSeasonMatches();
  for (const pick of appState.betSlip) {
    const m = matches.find(x => x.id === pick.matchId);
    if (isMatchBettingClosed(m)) {
      showToast(`⛔ Scommessa non conteggiata: la partita "${esc(pick.matchTitle)}" è già iniziata!`);
      appState.betSlip = appState.betSlip.filter(x => x.matchId !== pick.matchId);
      renderBettingTab();
      renderBetSlip();
      return;
    }
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
  const nowIso = new Date().toISOString();

  // Determina la giornata di riferimento della schedina
  const primaryMatchday = appState.betSlip[0]?.matchday || 1;
  const refMatch = matches.find(m => m.matchday === primaryMatchday) || matches[0];
  const matchdayLabel = refMatch
    ? `${primaryMatchday}ª Giornata — ${refMatch.isHome ? "Oppidum vs " + refMatch.opponent : refMatch.opponent + " vs Oppidum"}`
    : `${primaryMatchday}ª Giornata`;

  user.credits -= stake;
  user.totalStaked = (user.totalStaked || 0) + stake;
  saveUsers(users);

  const slips = getBetSlips();
  slips.unshift({
    id: uid("slip"),
    userId: user.id,
    userName: user.name,
    matchday: primaryMatchday,
    matchdayLabel,
    placedAtIso: nowIso,
    createdAt: new Date().toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    picks: [...appState.betSlip],
    stake,
    totalOdd,
    potentialPayout,
    status: "open"
  });
  saveBetSlips(slips);

  appState.betSlip = [];
  closeMobileBetSlip();
  renderAuthHeader();
  renderBettingTab();
  renderBetSlip();
  renderLeaderboardTab();
  showToast(`✅ Schedina registrata nella <strong>${primaryMatchday}ª Giornata</strong> per <strong>${esc(user.name)}</strong>!`);
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
// 8. TAB 2: CLASSIFICA SCOMMETTITORI & SCHEDINE GIORNATA PER GIORNATA
// ============================================================
function setHistoryMatchdayFilter(md) {
  appState.selectedHistoryMatchday = md;
  renderLeaderboardTab();
}

function renderLeaderboardTab() {
  const users = getUsers();
  const sorted = [...users].sort((a, b) => b.credits - a.credits);
  const lbBody = document.getElementById("bettorsLeaderboardBody");
  if (lbBody) {
    lbBody.innerHTML = sorted.map((u, idx) => {
      const medal = idx === 0 ? "🥇 1°" : idx === 1 ? "🥈 2°" : idx === 2 ? "🥉 3°" : `${idx + 1}°`;
      const net = u.credits - STARTING_CREDITS;
      const netStr = net > 0 ? `+${net}` : `${net}`;
      return `
        <tr>
          <td style="font-weight:900;">${medal}</td>
          <td><strong>👤 ${esc(u.name)}</strong></td>
          <td style="color:var(--gold);font-weight:900;">${u.credits} Cr.</td>
          <td style="color:${net >= 0 ? '#34d399' : '#f87171'};font-weight:800;">${netStr}</td>
          <td class="hide-mobile" style="color:#34d399;font-weight:700;">${u.wins || 0}</td>
          <td class="hide-mobile" style="color:#f87171;font-weight:700;">${u.losses || 0}</td>
        </tr>
      `;
    }).join("");
  }

  const slips = getBetSlips();
  const matches = getSeasonMatches();
  const slipsBox = document.getElementById("allSlipsHistoryBox");
  if (!slipsBox) return;

  // Raccoglie tutte le giornate presenti (dalle partite e dalle schedine)
  const matchdaySet = new Set();
  matches.forEach(m => { if (m.matchday) matchdaySet.add(Number(m.matchday)); });
  slips.forEach(s => { if (s.matchday) matchdaySet.add(Number(s.matchday)); });
  const allMatchdays = Array.from(matchdaySet).sort((a, b) => a - b);

  // Barra filtro Giornata per Giornata
  const activeFilter = appState.selectedHistoryMatchday;
  const filterBarHtml = `
    <div class="market-category-tabs" style="margin-bottom:16px;">
      <button type="button" class="market-cat-btn ${activeFilter === 'ALL' ? 'active' : ''}" onclick="setHistoryMatchdayFilter('ALL')">
        📅 Tutte le Giornate (${slips.length})
      </button>
      ${allMatchdays.map(md => {
        const count = slips.filter(s => Number(s.matchday || 1) === md).length;
        return `
          <button type="button" class="market-cat-btn ${Number(activeFilter) === md ? 'active' : ''}" onclick="setHistoryMatchdayFilter(${md})">
            🤽 ${md}ª Giornata (${count})
          </button>
        `;
      }).join("")}
    </div>
  `;

  if (!slips.length) {
    slipsBox.innerHTML = filterBarHtml + `<p class="panel-sub">Nessuna schedina ancora giocata. Fai il login e piazza la tua giocata prima del fischio d'inizio!</p>`;
    return;
  }

  const daysToShow = activeFilter === "ALL"
    ? allMatchdays
    : allMatchdays.filter(md => md === Number(activeFilter));

  const groupedHtml = daysToShow.map(md => {
    const mdSlips = slips.filter(s => Number(s.matchday || 1) === md);
    const mdMatch = matches.find(m => Number(m.matchday) === md);
    const headerLabel = mdMatch
      ? `${md}ª Giornata — ${mdMatch.isHome ? "Oppidum S. Cagliari vs " + mdMatch.opponent : mdMatch.opponent + " vs Oppidum S. Cagliari"}`
      : (mdSlips[0]?.matchdayLabel || `${md}ª Giornata`);

    if (!mdSlips.length) {
      return `
        <div class="market-block" style="margin-bottom:14px;">
          <div class="market-block-header">
            <div class="market-block-title">📅 ${esc(headerLabel)}</div>
            <span class="market-badge">0 schedine</span>
          </div>
          <p class="panel-sub">Nessuna scommessa registrata per questa giornata.</p>
        </div>
      `;
    }

    return `
      <div class="market-block" style="margin-bottom:16px;border-color:var(--border-strong);">
        <div class="market-block-header" style="border-bottom:1px solid var(--border);padding-bottom:10px;margin-bottom:12px;">
          <div class="market-block-title" style="color:var(--gold);font-size:1rem;">
            📅 ${esc(headerLabel)}
          </div>
          <span class="market-badge">${mdSlips.length} ${mdSlips.length === 1 ? "schedina giocata" : "schedine giocate"}</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;">
          ${mdSlips.map(s => {
            const statusBadge = s.status === "open"
              ? `<span class="badge badge-open">✅ IN CORSO</span>`
              : s.status === "won"
                ? `<span class="badge badge-won">🏆 VINTA (+${s.potentialPayout} Cr.)</span>`
                : `<span class="badge badge-lost">❌ PERSA (-${s.stake} Cr.)</span>`;

            return `
              <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                  <div>
                    <strong>👤 ${esc(s.userName)}</strong>
                    <span class="panel-sub" style="margin-left:6px;">🕒 ${esc(s.createdAt)}</span>
                  </div>
                  <div>${statusBadge}</div>
                </div>
                <div style="font-size:0.82rem;color:#cbd5e1;margin-bottom:8px;display:flex;flex-direction:column;gap:3px;">
                  ${s.picks.map(p => `<div>• <strong>${esc(p.label)}</strong> <span style="color:var(--gold);font-weight:700;">@${p.odd.toFixed(2)}</span></div>`).join("")}
                </div>
                <div style="font-size:0.78rem;color:var(--text-muted);display:flex;justify-content:space-between;flex-wrap:wrap;gap:4px;border-top:1px solid var(--border);padding-top:6px;">
                  <span>Puntata: <strong>${s.stake} Cr.</strong> · Quota Totale: <strong>${s.totalOdd.toFixed(2)}</strong></span>
                  <span>Vincita Potenziale: <strong style="color:var(--gold)">${s.potentialPayout} Crediti</strong></span>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");

  slipsBox.innerHTML = filterBarHtml + groupedHtml;
}

// ============================================================
// 9. TAB 3: CLASSIFICA PROVVISORIA, CALENDARIO & STATISTICHE ROSA
// ============================================================
function renderRosterAndPresenzeTab() {
  const playerStats = computeNewSeasonPlayerStats();

  // 1. Classifica Provvisoria delle Squadre
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
          </td>
          <td style="font-weight:900;color:var(--gold);">${t.pts}</td>
          <td>${t.played}</td>
          <td class="hide-mobile">${t.w}</td>
          <td class="hide-mobile">${t.d}</td>
          <td class="hide-mobile">${t.l}</td>
          <td class="hide-mobile">${t.gf}</td>
          <td class="hide-mobile">${t.ga}</td>
          <td>${diff > 0 ? "+" + diff : diff}</td>
        </tr>
      `;
    }).join("");
  }

  // 2. Calendario Campionato (adesso in attesa di pubblicazione, pronto per le 18 giornate)
  const calContainer = document.getElementById("seasonCalendarContainer");
  if (calContainer) {
    const cal = HISTORICAL_AI_REFERENCE.officialCalendar || [];
    if (!cal.length) {
      calContainer.innerHTML = `
        <div class="market-block" style="text-align:center;padding:20px 14px;">
          <div style="font-size:1.8rem;margin-bottom:6px;">🗓️</div>
          <h4 style="font-family:'Space Grotesk',sans-serif;font-size:1.05rem;margin-bottom:6px;">
            Calendario Ufficiale in fase di pubblicazione
          </h4>
          <p class="panel-sub" style="max-width:560px;margin:0 auto 14px;">
            Non appena la federazione pubblicherà il calendario ufficiale delle 18 giornate (Andata e Ritorno), tutte le date e gli orari del fischio d'inizio compariranno in questa sezione.
          </p>
          <div class="hero-kpis" style="max-width:560px;margin:0 auto;">
            <div class="kpi-box" style="text-align:center;">
              <div class="kpi-val" style="font-size:1.05rem;">1ª - 9ª Giornata</div>
              <div class="kpi-lbl">Girone d'Andata</div>
            </div>
            <div class="kpi-box" style="text-align:center;">
              <div class="kpi-val" style="font-size:1.05rem;">10ª - 18ª Giornata</div>
              <div class="kpi-lbl">Girone di Ritorno</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 3. Tabella Completa Statistiche Giocatori + Schede Giocatori
  const referenceOdds = generateAiOddsForMatch("ANACONDA PALLANUOTO", true, 1.15, getAllRosterIds());
  const scorerMap = new Map(referenceOdds.scorerMarkets.map(s => [s.playerId, s]));
  const exclMap = new Map((referenceOdds.exclusionMarkets || []).map(e => [e.playerId, e]));

  const statsTableBody = document.getElementById("rosterStatsTableBody");
  if (statsTableBody) {
    statsTableBody.innerHTML = playerStats.map((p, idx) => {
      const sc = scorerMap.get(p.id);
      const ex = exclMap.get(p.id);
      const baseOddStr = p.isGk
        ? "Gol @15.0 · Rig. @2.75"
        : `Gol @${sc ? sc.odd1Plus.toFixed(2) : "—"} · 1+F @${ex ? ex.oddFoul1.toFixed(2) : "—"}`;
      const capBadge = p.leadership === "Capitano"
        ? ` <span class="badge badge-gk" title="Capitano">© CAP</span>`
        : p.leadership === "Vice Capitano"
          ? ` <span class="badge badge-open" title="Vice Capitano">VICE CAP</span>`
          : "";
      const foulLogStr = p.foulHistory && p.foulHistory.length
        ? `<div style="font-size:0.68rem;color:var(--text-muted);">${p.foulHistory.join(" · ")}</div>`
        : "";

      return `
        <tr>
          <td class="hide-mobile"><strong>${idx + 1}</strong></td>
          <td><strong>${esc(p.name)}</strong>${capBadge}</td>
          <td><span class="badge ${p.isGk ? 'badge-gk' : 'badge-active'}">${esc(p.role)}</span></td>
          <td style="font-weight:700;color:var(--oppidum-sky);">${p.newSeasonApps}</td>
          <td style="font-weight:800;color:var(--gold);">${p.newSeasonGoals}</td>
          <td style="font-weight:700;color:#f87171;">
            ${p.newSeasonFouls || 0} falli
            ${p.newSeasonOuts ? `<span class="badge badge-lost" style="margin-left:4px;">${p.newSeasonOuts} Out</span>` : ""}
            ${foulLogStr}
          </td>
          <td style="color:#cbd5e1;font-size:0.78rem;">
            ${p.isGk ? "—" : `<strong>${p.histGoals}</strong> gol`}
          </td>
          <td class="hide-mobile" style="font-weight:800;color:var(--gold);font-size:0.78rem;">${baseOddStr}</td>
        </tr>
      `;
    }).join("");
  }

  const rosterGrid = document.getElementById("rosterCardsGrid");
  if (rosterGrid) {
    rosterGrid.innerHTML = playerStats.map(p => {
      const sc = scorerMap.get(p.id);
      const ex = exclMap.get(p.id);
      const cardClass = p.isGk ? "gk-card" : "";
      const roleBadge = p.isGk
        ? `<span class="badge badge-gk">🧤 PORTIERE</span>`
        : `<span class="badge badge-active">🤽 ${esc(p.role.toUpperCase())}</span>`;
      const capBadge = p.leadership === "Capitano"
        ? `<span class="badge badge-gk" style="margin-left:5px;">© CAPITANO</span>`
        : p.leadership === "Vice Capitano"
          ? `<span class="badge badge-open" style="margin-left:5px;">VICE CAPITANO</span>`
          : "";
      const seasonFoulHistory = p.foulHistory && p.foulHistory.length
        ? p.foulHistory.join(" · ")
        : "Nessuna gara giocata in stagione";

      return `
        <div class="player-card ${cardClass}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;">
            <div>
              <strong style="font-size:1.02rem;">${esc(p.name)}</strong>
              ${capBadge}
            </div>
            ${roleBadge}
          </div>
          <div class="panel-sub" style="display:flex;flex-direction:column;gap:3px;">
            <div>⚽ <strong>Stagione:</strong> ${p.newSeasonGoals} gol · <strong style="color:#fca5a5;">${p.newSeasonFouls || 0} falli</strong> (${p.newSeasonApps} pres.)</div>
            ${!p.isGk ? `<div>📚 <strong>Storico Gol:</strong> ${p.histGoals} gol</div>` : ""}
            <div style="font-size:0.72rem;color:var(--text-muted);">🟥 Storico falli stagione: ${esc(seasonFoulHistory)}</div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:8px;border-top:1px solid var(--border);font-size:0.78rem;">
            ${p.isGk
              ? `<span>⚽ Gol Portiere: <strong style="color:var(--gold);">@15.00</strong></span><span>🧤 Rigore: <strong style="color:var(--gold);">@2.75</strong></span>`
              : `<span>🎯 Gol: <strong style="color:var(--gold);">@${sc ? sc.odd1Plus.toFixed(2) : "—"}</strong></span>
                 <span>🟥 1+ Fallo: <strong style="color:#fca5a5;">@${ex ? ex.oddFoul1.toFixed(2) : "—"}</strong></span>`
            }
          </div>
        </div>
      `;
    }).join("");
  }
}

// ============================================================
// 10. SINCRONIZZAZIONE CLOUD CONDIVISA (TUTTI VEDONO TUTTO)
// ============================================================
async function pullSharedStateFromCloud() {
  try {
    const res = await fetch(CLOUD_SYNC_URL, { cache: "no-store" });
    if (!res.ok) return;
    const payload = await res.json();
    const data = payload?.data;
    if (!data) return;

    if (Array.isArray(data.users) && data.users.length) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
    }
    if (Array.isArray(data.slips)) {
      localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(data.slips));
    }
    renderAuthHeader();
    renderLeaderboardTab();
  } catch (e) {
    // Fallback silenzioso su storage locale se offline
  }
}

async function pushSharedStateToCloud() {
  try {
    const users = getUsers();
    const slips = getBetSlips();
    await fetch(CLOUD_SYNC_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "oppidum-bet-state",
        data: {
          users,
          slips,
          updatedAt: new Date().toISOString()
        }
      })
    });
  } catch (e) {}
}

// ---------- INIZIALIZZAZIONE ----------
window.addEventListener("DOMContentLoaded", () => {
  renderAuthHeader();
  renderBettingTab();
  renderBetSlip();
  renderLeaderboardTab();
  renderRosterAndPresenzeTab();
  pullSharedStateFromCloud();
  // Aggiorna automaticamente classifica e schedine ogni 20 secondi
  setInterval(pullSharedStateFromCloud, 20000);
});
