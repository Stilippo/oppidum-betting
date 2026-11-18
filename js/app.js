/* ============================================================
   OPPIDUM BET — Il Bookmaker Goliardico di Terramaini
   Motore AI Poisson, Gestione Partite Future, Quote, Schedina,
   Classifica Serie C Girone 5 e Tabella Marcatori 18 Giornate
   ============================================================ */

const STORAGE_KEYS = {
  USERS: "oppidum_bet_users_v2",
  BETS: "oppidum_bet_slips_v2",
  UPCOMING: "oppidum_bet_upcoming_v2",
  ACTIVE_USER: "oppidum_bet_active_user_v2"
};

// ---------- DATASET UFFICIALE STAGIONE 2026 (SERIE C GIR. 5) ----------
const SEASON_DATA = {
  team: {
    name: "Oppidum Sport Cagliari",
    shortName: "Oppidum S. Cagliari",
    league: "Serie C Maschile — Girone 5 (C.R. Sardegna)",
    pool: "Piscina \"G. Sicbaldi\" Terramaini — Cagliari",
    coach: "Chicco Cannas",
    assistantCoach: "Federico Romeo"
  },
  opponentsOrder: [
    { idx: 0,  code: "VIS", name: "RN Roma Vis Nova", leg: "Andata", day: 1, home: false, scoreUs: 7,  scoreThem: 16 },
    { idx: 1,  code: "ANA", name: "Anaconda PN", leg: "Andata", day: 2, home: true,  scoreUs: 9,  scoreThem: 11 },
    { idx: 2,  code: "AQU", name: "Aqvaroma", leg: "Andata", day: 3, home: false, scoreUs: 6,  scoreThem: 15 },
    { idx: 3,  code: "IMP", name: "Imperium", leg: "Andata", day: 4, home: true,  scoreUs: 7,  scoreThem: 9  },
    { idx: 4,  code: "BEL", name: "Bellator Frusino", leg: "Andata", day: 5, home: true,  scoreUs: 6,  scoreThem: 19 },
    { idx: 5,  code: "DEV", name: "De Virtute Roma", leg: "Andata", day: 6, home: true,  scoreUs: 8,  scoreThem: 16 },
    { idx: 6,  code: "CR",  name: "Castelli Romani", leg: "Andata", day: 7, home: false, scoreUs: 8,  scoreThem: 16 },
    { idx: 7,  code: "RN",  name: "RN Cagliari", leg: "Andata", day: 8, home: false, scoreUs: 6,  scoreThem: 13 },
    { idx: 8,  code: "PG",  name: "Promogest Quartu SE", leg: "Andata", day: 9, home: true,  scoreUs: 10, scoreThem: 13 },
    { idx: 9,  code: "VIS", name: "RN Roma Vis Nova", leg: "Ritorno", day: 10, home: true,  scoreUs: 11, scoreThem: 14 },
    { idx: 10, code: "ANA", name: "Anaconda PN", leg: "Ritorno", day: 11, home: false, scoreUs: 13, scoreThem: 13 },
    { idx: 11, code: "AQU", name: "Aqvaroma", leg: "Ritorno", day: 12, home: true,  scoreUs: 8,  scoreThem: 14 },
    { idx: 12, code: "IMP", name: "Imperium", leg: "Ritorno", day: 13, home: false, scoreUs: 5,  scoreThem: 13 },
    { idx: 13, code: "BEL", name: "Bellator Frusino", leg: "Ritorno", day: 14, home: false, scoreUs: 10, scoreThem: 13 },
    { idx: 14, code: "DEV", name: "De Virtute Roma", leg: "Ritorno", day: 15, home: false, scoreUs: 5,  scoreThem: 17 },
    { idx: 15, code: "CR",  name: "Castelli Romani", leg: "Ritorno", day: 16, home: true,  scoreUs: 12, scoreThem: 15 },
    { idx: 16, code: "RN",  name: "RN Cagliari", leg: "Ritorno", day: 17, home: true,  scoreUs: 8,  scoreThem: 11 },
    { idx: 17, code: "PG",  name: "Promogest Quartu SE", leg: "Ritorno", day: 18, home: false, scoreUs: 10, scoreThem: 9  }
  ],
  players: [
    // PORTIERI (Aggiunti alla rosa attuale)
    { id: "atzeni", name: "ATZENI", role: "Portiere", active: true, isGoalkeeper: true, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], total: 0, badge: "🧤 Saracinesca #1" },
    { id: "faret",  name: "FARET",  role: "Portiere", active: true, isGoalkeeper: true, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], total: 0, badge: "🧤 Muro di Terramaini" },
    // GIOCATORI DI MOVIMENTO ATTIVI
    { id: "melis",      name: "MELIS",      role: "Attaccante / Bomber", active: true, isGoalkeeper: false, goalsByMatch: [1,2,0,1,3,0,2,0,2,1,4,3,1,4,3,1,3,3], total: 34, badge: "👑 Capocannoniere" },
    { id: "piras",      name: "PIRAS",      role: "Attaccante / Centrovasca", active: true, isGoalkeeper: false, goalsByMatch: [1,2,1,2,0,2,1,2,2,2,2,1,0,1,0,1,1,3], total: 24, badge: "🔥 Cecchino" },
    { id: "de_giudici", name: "DE GIUDICI", role: "Attaccante / Universale", active: true, isGoalkeeper: false, goalsByMatch: [0,0,2,1,0,1,0,0,1,1,4,2,0,0,0,2,2,2], total: 18, badge: "🚀 Uomo da Ritorno" },
    { id: "sacco",      name: "SACCO",      role: "Centrovasca / Difensore", active: true, isGoalkeeper: false, goalsByMatch: [0,0,1,0,0,0,0,1,0,1,2,0,2,1,1,2,0,1], total: 12, badge: "⚡ Regista" },
    { id: "ballestri",  name: "BALLESTRI",  role: "Centroboa / Attaccante", active: true, isGoalkeeper: false, goalsByMatch: [3,0,0,0,1,0,0,1,2,0,0,0,1,1,0,1,0,0], total: 10, badge: "💪 Boa d'Assalto" },
    { id: "petretto",   name: "PETRETTO",   role: "Difensore / Centrovasca", active: true, isGoalkeeper: false, goalsByMatch: [0,1,0,1,0,2,0,0,0,1,0,0,0,0,0,1,1,0], total: 7,  badge: "🛡️ Roccia" },
    { id: "erriu",      name: "ERRIU",      role: "Esterno / Attaccante", active: true, isGoalkeeper: false, goalsByMatch: [0,1,0,0,0,1,0,0,0,0,0,0,0,3,0,0,1,0], total: 6,  badge: "🎩 Hat-trick vs Bellator" },
    { id: "cannas",     name: "CANNAS",     role: "Universale", active: true, isGoalkeeper: false, goalsByMatch: [0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0], total: 5,  badge: "🎯 Esperienza" },
    { id: "pilia_fl",   name: "PILIA FL",   role: "Centrovasca", active: true, isGoalkeeper: false, goalsByMatch: [0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0], total: 3,  badge: "🌊 Cuore Rossoblù" },
    { id: "troncia",    name: "TRONCIA",    role: "Difensore", active: true, isGoalkeeper: false, goalsByMatch: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0], total: 3,  badge: "🔨 Gol Pesanti" },
    { id: "pieroni",    name: "PIERONI",    role: "Esterno", active: true, isGoalkeeper: false, goalsByMatch: [0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0], total: 2,  badge: "⚡ Incursore" },
    { id: "pilia_fb",   name: "PILIA FB",   role: "Difensore", active: true, isGoalkeeper: false, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0], total: 1,  badge: "🛡️ Baluardo" },
    { id: "morzetti",   name: "MORZETTI",   role: "Universale", active: true, isGoalkeeper: false, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], total: 0,  badge: "💎 Quota Bonus 1° Gol" },
    { id: "murtas",     name: "MURTAS",     role: "Universale", active: true, isGoalkeeper: false, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], total: 0,  badge: "💎 Quota Bonus 1° Gol" },
    { id: "orru",       name: "ORRU'",      role: "Universale", active: true, isGoalkeeper: false, goalsByMatch: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], total: 0,  badge: "💎 Quota Bonus 1° Gol" },
    // EX GIOCATORI (Non più in rosa attuale, mantenuti nello storico 2026)
    { id: "fortini",    name: "FORTINI",    role: "Ex Giocatore (Non più in rosa)", active: false, isGoalkeeper: false, goalsByMatch: [1,1,0,1,2,1,3,1,1,4,0,1,0,0,0,3,0,1], total: 20, badge: "📦 Ex Rosa 2026" },
    { id: "frau",       name: "FRAU",       role: "Ex Giocatore (Non più in rosa)", active: false, isGoalkeeper: false, goalsByMatch: [0,0,2,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0], total: 4,  badge: "📦 Ex Rosa 2026" }
  ],
  teamTotalsByMatch: [7, 9, 6, 7, 6, 8, 8, 6, 10, 11, 13, 8, 5, 10, 5, 12, 8, 10],
  matchdays: [
    { day: 1, matches: [
      { date: "17 gen 2026", home: "Bellator Frusino", away: "De Virtute Roma", sh: 12, sa: 10 },
      { date: "24 gen 2026", home: "Promogest Quartu SE", away: "Aqvaroma", sh: 4, sa: 12 },
      { date: "24 gen 2026", home: "RN Cagliari", away: "Anaconda PN", sh: 11, sa: 10 },
      { date: "24 gen 2026", home: "RN Roma Vis Nova", away: "Oppidum S. Cagliari", sh: 16, sa: 7 },
      { date: "24 gen 2026", home: "Imperium", away: "Castelli Romani", sh: 6, sa: 12 }
    ]},
    { day: 2, matches: [
      { date: "21 gen 2026", home: "Bellator Frusino", away: "Aqvaroma", sh: 18, sa: 11 },
      { date: "31 gen 2026", home: "Castelli Romani", away: "RN Cagliari", sh: 8, sa: 7 },
      { date: "31 gen 2026", home: "RN Roma Vis Nova", away: "Promogest Quartu SE", sh: 14, sa: 12 },
      { date: "31 gen 2026", home: "Oppidum S. Cagliari", away: "Anaconda PN", sh: 9, sa: 11 },
      { date: "31 gen 2026", home: "De Virtute Roma", away: "Imperium", sh: 10, sa: 9 }
    ]},
    { day: 3, matches: [
      { date: "7 feb 2026", home: "De Virtute Roma", away: "Promogest Quartu SE", sh: 20, sa: 3 },
      { date: "7 feb 2026", home: "RN Cagliari", away: "RN Roma Vis Nova", sh: 10, sa: 12 },
      { date: "7 feb 2026", home: "Anaconda PN", away: "Castelli Romani", sh: 14, sa: 13 },
      { date: "8 feb 2026", home: "Aqvaroma", away: "Oppidum S. Cagliari", sh: 15, sa: 6 },
      { date: "11 feb 2026", home: "Bellator Frusino", away: "Imperium", sh: 22, sa: 8 }
    ]},
    { day: 4, matches: [
      { date: "14 feb 2026", home: "De Virtute Roma", away: "RN Cagliari", sh: 11, sa: 8 },
      { date: "14 feb 2026", home: "Bellator Frusino", away: "Promogest Quartu SE", sh: 15, sa: 7 },
      { date: "14 feb 2026", home: "Oppidum S. Cagliari", away: "Imperium", sh: 7, sa: 9 },
      { date: "14 feb 2026", home: "RN Roma Vis Nova", away: "Castelli Romani", sh: 10, sa: 15 },
      { date: "14 feb 2026", home: "Anaconda PN", away: "Aqvaroma", sh: 10, sa: 9 }
    ]},
    { day: 5, matches: [
      { date: "21 feb 2026", home: "RN Cagliari", away: "Imperium", sh: 14, sa: 6 },
      { date: "21 feb 2026", home: "Oppidum S. Cagliari", away: "Bellator Frusino", sh: 6, sa: 19 },
      { date: "21 feb 2026", home: "Aqvaroma", away: "RN Roma Vis Nova", sh: 12, sa: 10 },
      { date: "21 feb 2026", home: "Anaconda PN", away: "De Virtute Roma", sh: 10, sa: 13 },
      { date: "22 feb 2026", home: "Castelli Romani", away: "Promogest Quartu SE", sh: 17, sa: 8 }
    ]},
    { day: 6, matches: [
      { date: "28 feb 2026", home: "Castelli Romani", away: "Bellator Frusino", sh: 9, sa: 13 },
      { date: "28 feb 2026", home: "Oppidum S. Cagliari", away: "De Virtute Roma", sh: 8, sa: 16 },
      { date: "28 feb 2026", home: "RN Roma Vis Nova", away: "Anaconda PN", sh: 6, sa: 13 },
      { date: "1 mar 2026", home: "Aqvaroma", away: "RN Cagliari", sh: 8, sa: 8 },
      { date: "1 mar 2026", home: "Imperium", away: "Promogest Quartu SE", sh: 12, sa: 4 }
    ]},
    { day: 7, matches: [
      { date: "4 mar 2026", home: "Promogest Quartu SE", away: "RN Cagliari", sh: 12, sa: 14 },
      { date: "7 mar 2026", home: "RN Roma Vis Nova", away: "Imperium", sh: 8, sa: 7 },
      { date: "7 mar 2026", home: "Bellator Frusino", away: "Anaconda PN", sh: 16, sa: 10 },
      { date: "7 mar 2026", home: "De Virtute Roma", away: "Aqvaroma", sh: 12, sa: 11 },
      { date: "8 mar 2026", home: "Castelli Romani", away: "Oppidum S. Cagliari", sh: 16, sa: 8 }
    ]},
    { day: 8, matches: [
      { date: "14 mar 2026", home: "RN Cagliari", away: "Oppidum S. Cagliari", sh: 13, sa: 6 },
      { date: "14 mar 2026", home: "Anaconda PN", away: "Promogest Quartu SE", sh: 18, sa: 13 },
      { date: "14 mar 2026", home: "Aqvaroma", away: "Imperium", sh: 8, sa: 10 },
      { date: "14 mar 2026", home: "De Virtute Roma", away: "Castelli Romani", sh: 15, sa: 14 },
      { date: "17 mar 2026", home: "Bellator Frusino", away: "RN Roma Vis Nova", sh: 15, sa: 9 }
    ]},
    { day: 9, matches: [
      { date: "21 mar 2026", home: "Oppidum S. Cagliari", away: "Promogest Quartu SE", sh: 10, sa: 13 },
      { date: "21 mar 2026", home: "RN Roma Vis Nova", away: "De Virtute Roma", sh: 11, sa: 21 },
      { date: "21 mar 2026", home: "Castelli Romani", away: "Aqvaroma", sh: 14, sa: 11 },
      { date: "21 mar 2026", home: "Imperium", away: "Anaconda PN", sh: 8, sa: 11 },
      { date: "22 mar 2026", home: "Bellator Frusino", away: "RN Cagliari", sh: 5, sa: 9 }
    ]},
    { day: 10, matches: [
      { date: "28 mar 2026", home: "Aqvaroma", away: "Promogest Quartu SE", sh: 16, sa: 14 },
      { date: "28 mar 2026", home: "Oppidum S. Cagliari", away: "RN Roma Vis Nova", sh: 11, sa: 14 },
      { date: "28 mar 2026", home: "Anaconda PN", away: "RN Cagliari", sh: 8, sa: 12 },
      { date: "28 mar 2026", home: "Castelli Romani", away: "Imperium", sh: 8, sa: 10 },
      { date: "28 mar 2026", home: "De Virtute Roma", away: "Bellator Frusino", sh: 10, sa: 12 }
    ]},
    { day: 11, matches: [
      { date: "11 apr 2026", home: "RN Cagliari", away: "Castelli Romani", sh: 10, sa: 6 },
      { date: "11 apr 2026", home: "Promogest Quartu SE", away: "RN Roma Vis Nova", sh: 13, sa: 21 },
      { date: "11 apr 2026", home: "Anaconda PN", away: "Oppidum S. Cagliari", sh: 13, sa: 13 },
      { date: "11 apr 2026", home: "Imperium", away: "De Virtute Roma", sh: 13, sa: 19 },
      { date: "12 apr 2026", home: "Aqvaroma", away: "Bellator Frusino", sh: 11, sa: 12 }
    ]},
    { day: 12, matches: [
      { date: "18 apr 2026", home: "Promogest Quartu SE", away: "De Virtute Roma", sh: 13, sa: 20 },
      { date: "18 apr 2026", home: "RN Roma Vis Nova", away: "RN Cagliari", sh: 7, sa: 6 },
      { date: "18 apr 2026", home: "Oppidum S. Cagliari", away: "Aqvaroma", sh: 8, sa: 14 },
      { date: "18 apr 2026", home: "Castelli Romani", away: "Anaconda PN", sh: 11, sa: 9 },
      { date: "18 apr 2026", home: "Imperium", away: "Bellator Frusino", sh: 13, sa: 15 }
    ]},
    { day: 13, matches: [
      { date: "19 apr 2026", home: "Castelli Romani", away: "RN Roma Vis Nova", sh: 14, sa: 15 },
      { date: "25 apr 2026", home: "Imperium", away: "Oppidum S. Cagliari", sh: 13, sa: 5 },
      { date: "25 apr 2026", home: "RN Cagliari", away: "De Virtute Roma", sh: 11, sa: 13 },
      { date: "26 apr 2026", home: "Aqvaroma", away: "Anaconda PN", sh: 12, sa: 8 },
      { date: "26 apr 2026", home: "Promogest Quartu SE", away: "Bellator Frusino", sh: 13, sa: 21 }
    ]},
    { day: 14, matches: [
      { date: "28 apr 2026", home: "RN Roma Vis Nova", away: "Aqvaroma", sh: 11, sa: 13 },
      { date: "2 mag 2026", home: "Promogest Quartu SE", away: "Castelli Romani", sh: 14, sa: 15 },
      { date: "2 mag 2026", home: "Bellator Frusino", away: "Oppidum S. Cagliari", sh: 13, sa: 10 },
      { date: "5 mag 2026", home: "De Virtute Roma", away: "Anaconda PN", sh: 10, sa: 8 },
      { date: "24 mag 2026", home: "Imperium", away: "RN Cagliari", sh: 10, sa: 16 }
    ]},
    { day: 15, matches: [
      { date: "9 mag 2026", home: "De Virtute Roma", away: "Oppidum S. Cagliari", sh: 17, sa: 5 },
      { date: "9 mag 2026", home: "RN Cagliari", away: "Aqvaroma", sh: 15, sa: 11 },
      { date: "9 mag 2026", home: "Bellator Frusino", away: "Castelli Romani", sh: 20, sa: 9 },
      { date: "9 mag 2026", home: "Anaconda PN", away: "RN Roma Vis Nova", sh: 13, sa: 17 },
      { date: "28 mag 2026", home: "Promogest Quartu SE", away: "Imperium", sh: 12, sa: 16 }
    ]},
    { day: 16, matches: [
      { date: "16 mag 2026", home: "Aqvaroma", away: "De Virtute Roma", sh: 9, sa: 13 },
      { date: "16 mag 2026", home: "Imperium", away: "RN Roma Vis Nova", sh: 11, sa: 15 },
      { date: "16 mag 2026", home: "Oppidum S. Cagliari", away: "Castelli Romani", sh: 12, sa: 15 },
      { date: "16 mag 2026", home: "RN Cagliari", away: "Promogest Quartu SE", sh: 23, sa: 4 },
      { date: "16 mag 2026", home: "Anaconda PN", away: "Bellator Frusino", sh: 8, sa: 15 }
    ]},
    { day: 17, matches: [
      { date: "23 mag 2026", home: "Promogest Quartu SE", away: "Anaconda PN", sh: 8, sa: 19 },
      { date: "23 mag 2026", home: "RN Roma Vis Nova", away: "Bellator Frusino", sh: 11, sa: 16 },
      { date: "23 mag 2026", home: "Oppidum S. Cagliari", away: "RN Cagliari", sh: 8, sa: 11 },
      { date: "23 mag 2026", home: "Imperium", away: "Aqvaroma", sh: 10, sa: 10 },
      { date: "24 mag 2026", home: "Castelli Romani", away: "De Virtute Roma", sh: 14, sa: 12 }
    ]},
    { day: 18, matches: [
      { date: "30 mag 2026", home: "Promogest Quartu SE", away: "Oppidum S. Cagliari", sh: 9, sa: 10 },
      { date: "30 mag 2026", home: "De Virtute Roma", away: "RN Roma Vis Nova", sh: 15, sa: 12 },
      { date: "30 mag 2026", home: "Aqvaroma", away: "Castelli Romani", sh: 13, sa: 7 },
      { date: "30 mag 2026", home: "RN Cagliari", away: "Bellator Frusino", sh: 13, sa: 13 },
      { date: "30 mag 2026", home: "Anaconda PN", away: "Imperium", sh: 9, sa: 11 }
    ]}
  ]
};

// ---------- STATO DELL'APPLICAZIONE ----------
let appState = {
  selectedMatchId: null,
  activeMarketCategory: "all", // all | main | scorers | gk | goliardic
  betSlip: [],
  showExPlayersInRoster: true,
  matchdayFilterTeam: "ALL"
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

// ---------- CALCOLO CLASSIFICA SERIE C E STATISTICHE SQUADRE ----------
function computeLeagueTable() {
  const teams = {};
  const ensureTeam = (name) => {
    if (!teams[name]) {
      teams[name] = {
        name, played: 0, w: 0, d: 0, l: 0,
        gf: 0, ga: 0, pts: 0,
        homeGf: 0, homeGa: 0, homePlayed: 0,
        awayGf: 0, awayGa: 0, awayPlayed: 0
      };
    }
  };

  SEASON_DATA.matchdays.forEach(md => {
    md.matches.forEach(m => {
      ensureTeam(m.home);
      ensureTeam(m.away);
      const h = teams[m.home];
      const a = teams[m.away];

      h.played++; a.played++;
      h.homePlayed++; a.awayPlayed++;
      h.gf += m.sh; h.ga += m.sa;
      h.homeGf += m.sh; h.homeGa += m.sa;
      a.gf += m.sa; a.ga += m.sh;
      a.awayGf += m.sa; a.awayGa += m.sh;

      if (m.sh > m.sa) { h.w++; h.pts += 3; a.l++; }
      else if (m.sh < m.sa) { a.w++; a.pts += 3; h.l++; }
      else { h.d++; a.d++; h.pts += 1; a.pts += 1; }
    });
  });

  return Object.values(teams).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    return (b.gf - b.ga) - (a.gf - a.ga);
  });
}

// ---------- MOTORE AI DI POISSON ("ORACOLO DI TERRAMAINI AI") ----------
function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function poissonPmf(k, lambda) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function probToOdd(prob, margin = 1.07, minOdd = 1.12, maxOdd = 25.0) {
  const safeP = Math.max(0.025, Math.min(0.92, prob));
  const raw = 1 / (safeP * margin);
  return Number(Math.max(minOdd, Math.min(maxOdd, raw)).toFixed(2));
}

function generateAiMatchAnalysisAndOdds(opponentName, isHome = true, boostOppidum = 1.12) {
  const table = computeLeagueTable();
  const totalGoalsLeague = table.reduce((s, t) => s + t.gf, 0);
  const totalMatchesLeague = 90;
  const avgTeamGoals = totalGoalsLeague / (totalMatchesLeague * 2); // ~12.2 gol per squadra

  const oppidumStats = table.find(t => t.name === "Oppidum S. Cagliari");
  const oppStats = table.find(t => t.name === opponentName);

  // Calcolo storico diretto contro questo avversario
  const h2hMatches = SEASON_DATA.opponentsOrder.filter(o => o.name === opponentName);
  let h2hUs = 0, h2hThem = 0;
  h2hMatches.forEach(m => { h2hUs += m.scoreUs; h2hThem += m.scoreThem; });

  // Lambda atteso Oppidum & Avversario (Modello Poisson calibrato sulla Serie C + Fattore Terramaini)
  let lambdaOppidum = 8.8;
  let lambdaOpponent = 12.0;

  if (oppidumStats && oppStats) {
    const oppAtk = (oppidumStats.gf / 18) / avgTeamGoals;
    const oppDef = (oppidumStats.ga / 18) / avgTeamGoals;
    const rivalAtk = (oppStats.gf / 18) / avgTeamGoals;
    const rivalDef = (oppStats.ga / 18) / avgTeamGoals;

    const baseUs = avgTeamGoals * oppAtk * rivalDef;
    const baseThem = avgTeamGoals * rivalAtk * oppDef;

    // Pesa 65% modello generale Serie C + 35% scontri diretti 2026
    const h2hAvgUs = h2hMatches.length ? h2hUs / h2hMatches.length : baseUs;
    const h2hAvgThem = h2hMatches.length ? h2hThem / h2hMatches.length : baseThem;

    lambdaOppidum = (baseUs * 0.65 + h2hAvgUs * 0.35) * (isHome ? 1.09 : 0.94) * boostOppidum;
    lambdaOpponent = (baseThem * 0.65 + h2hAvgThem * 0.35) * (isHome ? 0.93 : 1.07);
  } else {
    // Avversario personalizzato / amichevole
    lambdaOppidum = (isHome ? 10.4 : 9.1) * boostOppidum;
    lambdaOpponent = isHome ? 9.8 : 11.2;
  }

  lambdaOppidum = Math.max(5.5, Math.min(16.5, lambdaOppidum));
  lambdaOpponent = Math.max(6.0, Math.min(18.5, lambdaOpponent));

  // Calcolo matrice di Poisson fino a 28 gol per squadra
  let pOppidumWin = 0, pDraw = 0, pOpponentWin = 0;
  const maxG = 28;
  for (let gUs = 0; gUs <= maxG; gUs++) {
    const pUs = poissonPmf(gUs, lambdaOppidum);
    for (let gThem = 0; gThem <= maxG; gThem++) {
      const pThem = poissonPmf(gThem, lambdaOpponent);
      const joint = pUs * pThem;
      if (gUs > gThem) pOppidumWin += joint;
      else if (gUs === gThem) pDraw += joint;
      else pOpponentWin += joint;
    }
  }

  // In pallanuoto il pareggio è più frequente sul filo di lana: calibrazione realistica
  pDraw = Math.max(0.085, Math.min(0.16, pDraw * 1.25));
  const rem = 1 - pDraw;
  const sumWin = pOppidumWin + pOpponentWin || 1;
  pOppidumWin = (pOppidumWin / sumWin) * rem;
  pOpponentWin = (pOpponentWin / sumWin) * rem;

  const p1 = isHome ? pOppidumWin : pOpponentWin;
  const pX = pDraw;
  const p2 = isHome ? pOpponentWin : pOppidumWin;

  const totalExpectedGoals = lambdaOppidum + lambdaOpponent;
  const totalLine = Math.round(totalExpectedGoals) - 0.5; // es. 21.5
  const oppidumLine = Math.round(lambdaOppidum) - 0.5;    // es. 9.5
  const opponentLine = Math.round(lambdaOpponent) - 0.5;  // es. 12.5
  const handicapLine = Number((Math.round((lambdaOpponent - lambdaOppidum) * 2) / 2 + 0.5).toFixed(1));

  // Calcolo quote Marcatori Attivi:
  // Senza Fortini (20 gol) e Frau (4 gol), i 125 gol dei giocatori attivi vengono riscalati
  // sui 149 gol totali (fattore di ridistribuzione offensiva = 149 / 125 = 1.192)
  const activeFieldPlayers = SEASON_DATA.players.filter(p => p.active && !p.isGoalkeeper);
  const activeGoalsSum = activeFieldPlayers.reduce((s, p) => s + p.total, 0) || 125;

  const h2hIndices = h2hMatches.map(m => m.idx);

  const scorerMarkets = activeFieldPlayers.map(p => {
    const seasonShare = p.total > 0 ? (p.total / activeGoalsSum) : 0.014;
    // Bonus se ha segnato contro questo specifico avversario nella scorsa stagione
    const goalsVsRival = h2hIndices.reduce((s, idx) => s + (p.goalsByMatch[idx] || 0), 0);
    const rivalFactor = h2hIndices.length > 0 && goalsVsRival > 0
      ? 0.75 + 0.25 * ((goalsVsRival / h2hIndices.length) / Math.max(0.2, p.total / 18))
      : 0.92;

    const playerLambda = Math.max(0.08, lambdaOppidum * seasonShare * Math.min(1.45, rivalFactor));
    const pAtLeast1 = 1 - Math.exp(-playerLambda);
    const pAtLeast2 = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda));
    const pAtLeast3 = 1 - (poissonPmf(0, playerLambda) + poissonPmf(1, playerLambda) + poissonPmf(2, playerLambda));

    return {
      playerId: p.id,
      name: p.name,
      role: p.role,
      total2026: p.total,
      goalsVsRival,
      expectedGoals: Number(playerLambda.toFixed(2)),
      odd1Plus: probToOdd(pAtLeast1, 1.06, 1.14, 9.50),
      odd2Plus: probToOdd(pAtLeast2, 1.06, 1.45, 18.00),
      odd3Plus: probToOdd(pAtLeast3, 1.05, 2.20, 28.00)
    };
  });

  // Quote Portieri ATZENI & FARET
  const gkSaveLine = Math.max(8.5, Math.round(lambdaOpponent * 0.85) - 0.5);
  const goalkeeperMarkets = [
    { id: "gk_atzeni_saves", label: `🧤 ATZENI Over ${gkSaveLine} parate nella gara`, sub: "Specialista tra i pali", odd: 1.85 },
    { id: "gk_faret_saves",  label: `🧤 FARET Over ${gkSaveLine} parate nella gara`, sub: "Il Muro di Terramaini", odd: 1.85 },
    { id: "gk_rigore",       label: "🧤 ATZENI o FARET para almeno un 5 metri (Rigore)", sub: "Esplosione della panchina inclusa", odd: 2.75 },
    { id: "gk_under_gol",    label: `🧱 Saracinesca Oppidum: Subiti Under ${opponentLine} gol`, sub: "Prestazione monstre difensiva", odd: 1.90 },
    { id: "gk_clean_q",      label: "🔒 Porta inviolata in almeno un tempo (Clean Sheet Quarto)", sub: "Atzeni/Faret chiudono la porta per 8'", odd: 3.40 },
    { id: "gk_assist",       label: "🚀 Assist diretto di ATZENI o FARET per gol in controfuga", sub: "Lancio millimetrico sul bomber", odd: 4.50 },
    { id: "gk_goal_buzzer",  label: "🤯 Gol da porta a porta di ATZENI o FARET sulla sirena", sub: "Leggenda assoluta di Terramaini", odd: 18.00 }
  ];

  // Quote Goliardiche ("Speciale Spogliatoio Oppidum")
  const goliardicMarkets = [
    { id: "gol_cannas_urlo", label: "📢 Mister Chicco Cannas perde la voce entro il 2° tempo", sub: "Decibel oltre la soglia olimpica a Terramaini", odd: 1.45 },
    { id: "gol_melis_palombella", label: " lob — MELIS segna con palombella ignorante", sub: "Il classico che umilia il portiere avversario", odd: 2.35 },
    { id: "gol_piras_beduina", label: "🤽 PIRAS o BALLESTRI segnano di rovesciata / beduina", sub: "Sciabolata spettacolare dai 2 metri", odd: 3.10 },
    { id: "gol_proteste", label: "🟥 Almeno un'espulsione per proteste (o cartellino in panchina)", sub: "'Arbitro ma cosa hai visto?!'", odd: 1.72 },
    { id: "gol_palo_traversa", label: "💥 Over 4.5 pali/traverse colpiti dall'Oppidum", sub: "I ferri di Terramaini tremano ancora", odd: 2.10 },
    { id: "gol_ichnusa", label: "🍺 Cassa di Ichnusa Non Filtrata offerta nello spogliatoio", sub: "Obbligatoria in caso di tripletta o primo gol stagionale", odd: 1.30 },
    { id: "gol_zero_club", label: "🎆 MORZETTI, MURTAS o ORRU' sbloccano la casella gol!", sub: "Boato della tribuna e giro pagato per tutti", odd: 3.80 }
  ];

  const h2hSummary = h2hMatches.length
    ? h2hMatches.map(m => `${m.leg} (${m.home ? "Casa" : "Fuori"}): Oppidum ${m.scoreUs} - ${m.scoreThem} ${m.name}`).join(" · ")
    : "Nessun precedente nel girone 2026 (Nuova sfida)";

  return {
    lambdaOppidum: Number(lambdaOppidum.toFixed(1)),
    lambdaOpponent: Number(lambdaOpponent.toFixed(1)),
    prob1: Math.round(p1 * 100),
    probX: Math.round(pX * 100),
    prob2: Math.round(p2 * 100),
    h2hSummary,
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
      oddOverOppidum: 1.83,
      oddUnderOppidum: 1.87,
      handicapLine,
      oddHandicapOppidum: 1.85
    },
    scorerMarkets,
    goalkeeperMarkets,
    goliardicMarkets
  };
}

// ---------- GESTIONE STORAGE (UTENTI, PARTITE FUTURE, SCHEDINE) ----------
function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  const defaults = [
    { id: "u_squadra", name: "Capitan Oppidum", chips: 250, wins: 3, losses: 1 },
    { id: "u_melis",   name: "Bomber Melis", chips: 210, wins: 2, losses: 1 },
    { id: "u_atzeni",  name: "Atzeni #1", chips: 190, wins: 2, losses: 2 },
    { id: "u_faret",   name: "Faret GK", chips: 185, wins: 1, losses: 1 },
    { id: "u_piras",   name: "Piras", chips: 175, wins: 1, losses: 2 }
  ];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaults));
  return defaults;
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getActiveUserId() {
  const users = getUsers();
  const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
  if (saved && users.some(u => u.id === saved)) return saved;
  return users[0]?.id || "";
}

function setActiveUserId(id) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, id);
  renderWalletBar();
}

function getUpcomingMatches() {
  const raw = localStorage.getItem(STORAGE_KEYS.UPCOMING);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {}
  }
  const initial = [
    {
      id: "match_next_1",
      date: "Sabato Prossimo · Ore 15:00",
      opponent: "Promogest Quartu SE",
      isHome: true,
      competition: "Derby Cagliaritano — Serie C Gir. 5",
      boostOppidum: 1.15,
      status: "open",
      analysis: generateAiMatchAnalysisAndOdds("Promogest Quartu SE", true, 1.15)
    },
    {
      id: "match_next_2",
      date: "Prossimo Turno · Ore 16:30",
      opponent: "Anaconda PN",
      isHome: true,
      competition: "Serie C Gir. 5 — Piscina Terramaini",
      boostOppidum: 1.12,
      status: "open",
      analysis: generateAiMatchAnalysisAndOdds("Anaconda PN", true, 1.12)
    },
    {
      id: "match_next_3",
      date: "Big Match · Ore 15:00",
      opponent: "RN Cagliari",
      isHome: true,
      competition: "Stracittadina di Cagliari — Serie C",
      boostOppidum: 1.10,
      status: "open",
      analysis: generateAiMatchAnalysisAndOdds("RN Cagliari", true, 1.10)
    }
  ];
  localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(initial));
  return initial;
}

function saveUpcomingMatches(list) {
  localStorage.setItem(STORAGE_KEYS.UPCOMING, JSON.stringify(list));
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
    // Mostra la schedina laterale nelle tab Scommesse e Oracolo AI
    const showSidebar = (tabId === "betting" || tabId === "oracle");
    container.classList.toggle("full-width", !showSidebar);
    const sidebar = document.getElementById("betslipSidebar");
    if (sidebar) sidebar.style.display = showSidebar ? "block" : "none";
  }
}

// ---------- RENDER WALLET BAR ----------
function renderWalletBar() {
  const users = getUsers();
  const activeId = getActiveUserId();
  const sel = document.getElementById("activeUserSelect");
  const bal = document.getElementById("activeUserBalance");
  if (!sel || !bal) return;

  sel.innerHTML = users.map(u =>
    `<option value="${esc(u.id)}" ${u.id === activeId ? "selected" : ""}>🤽 ${esc(u.name)}</option>`
  ).join("");

  const current = users.find(u => u.id === activeId) || users[0];
  bal.innerHTML = `${current ? current.chips : 0} 🍺`;
}

// ---------- RENDER PALINSESTO & QUOTE AI ----------
function renderBettingTab() {
  const matches = getUpcomingMatches().filter(m => m.status === "open");
  if (!matches.length) {
    document.getElementById("matchSelectorBar").innerHTML = `<p class="panel-sub">Nessuna partita futura aperta. Creane una nella scheda <strong>Oracolo AI & Quote</strong>!</p>`;
    document.getElementById("featuredMatchBox").innerHTML = "";
    document.getElementById("marketsContainer").innerHTML = "";
    return;
  }

  if (!appState.selectedMatchId || !matches.some(m => m.id === appState.selectedMatchId)) {
    appState.selectedMatchId = matches[0].id;
  }

  const activeMatch = matches.find(m => m.id === appState.selectedMatchId) || matches[0];
  const an = activeMatch.analysis;

  // 1. Barra selettore partite
  document.getElementById("matchSelectorBar").innerHTML = matches.map(m => {
    const homeTeam = m.isHome ? "Oppidum S. Cagliari" : m.opponent;
    const awayTeam = m.isHome ? m.opponent : "Oppidum S. Cagliari";
    return `
      <button type="button" class="match-pill ${m.id === activeMatch.id ? "active" : ""}" onclick="selectMatch('${esc(m.id)}')">
        <div class="mp-date">
          <span>${esc(m.date)}</span>
          <span>${m.isHome ? "🏠 CASA" : "✈️ TRASFERTA"}</span>
        </div>
        <div class="mp-teams">${esc(homeTeam)} vs ${esc(awayTeam)}</div>
        <div class="mp-meta">1: <strong>${m.analysis.mainMarkets.odd1.toFixed(2)}</strong> · X: <strong>${m.analysis.mainMarkets.oddX.toFixed(2)}</strong> · 2: <strong>${m.analysis.mainMarkets.odd2.toFixed(2)}</strong></div>
      </button>
    `;
  }).join("");

  // 2. Scoreboard & AI Oracle Box
  const homeName = activeMatch.isHome ? "Oppidum Sport Cagliari" : activeMatch.opponent;
  const awayName = activeMatch.isHome ? activeMatch.opponent : "Oppidum Sport Cagliari";
  const homeSub  = activeMatch.isHome ? "Piscina Terramaini · Rossoblù" : "Squadra Ospitante";
  const awaySub  = activeMatch.isHome ? "Squadra Ospite" : "Oppidum in Trasferta";

  document.getElementById("featuredMatchBox").innerHTML = `
    <div class="fm-top">
      <span>🏆 ${esc(activeMatch.competition)}</span>
      <span>📅 ${esc(activeMatch.date)} · 📍 ${activeMatch.isHome ? "Piscina Terramaini (Cagliari)" : "Vasca Avversaria"}</span>
    </div>
    <div class="fm-teams">
      <div>
        <div class="fm-team-name">${esc(homeName)}</div>
        <div class="fm-team-sub">${esc(homeSub)}</div>
      </div>
      <div class="fm-vs">VS</div>
      <div>
        <div class="fm-team-name">${esc(awayName)}</div>
        <div class="fm-team-sub">${esc(awaySub)}</div>
      </div>
    </div>
    <div class="ai-oracle-box">
      <div class="ai-oracle-header">
        <span>🤖 Oracolo AI di Terramaini (Modello Poisson Serie C + Rosa Attiva senza Fortini/Frau)</span>
        <span>Gol Attesi: <strong>Oppidum ${an.lambdaOppidum}</strong> — <strong>${esc(activeMatch.opponent)} ${an.lambdaOpponent}</strong></span>
      </div>
      <div>📊 <strong>Precedenti 2026:</strong> ${esc(an.h2hSummary)}</div>
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

  // 3. Mercati di scommessa
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
  const matches = getUpcomingMatches();
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

  // A) ESITO FINALE, DOPPIA CHANCE, OVER/UNDER, HANDICAP
  if (cat === "all" || cat === "main") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🤽 Esito Finale 1X2 & Doppia Chance</div>
          <span class="market-badge">Calcolato da AI su 90 partite</span>
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
          <div class="market-block-title">🔢 Over / Under Gol & Handicap Vasca</div>
          <span class="market-badge">Media Attesa: ${(an.lambdaOppidum + an.lambdaOpponent).toFixed(1)} gol</span>
        </div>
        <div class="odds-grid">
          ${oddButtonHtml(match, "OU_TOT_OVER", `Over ${mm.totalLine} Gol Totali`, "Partita spettacolare", mm.oddOverTotal)}
          ${oddButtonHtml(match, "OU_TOT_UNDER", `Under ${mm.totalLine} Gol Totali`, "Difese rocciose", mm.oddUnderTotal)}
          ${oddButtonHtml(match, "OU_OPP_OVER", `Oppidum Over ${mm.oppidumLine} Gol`, `Atteso AI: ${an.lambdaOppidum} gol`, mm.oddOverOppidum)}
          ${oddButtonHtml(match, "OU_OPP_UNDER", `Oppidum Under ${mm.oppidumLine} Gol`, `Linea squadra`, mm.oddUnderOppidum)}
          ${oddButtonHtml(match, "HCP_OPP", `Oppidum Handicap (${mm.handicapLine >= 0 ? "+" + mm.handicapLine : mm.handicapLine} gol)`, "Con vantaggio handicap", mm.oddHandicapOppidum)}
        </div>
      </div>
    `;
  }

  // B) MARCATORI ROSA ATTIVA (Senza Fortini e Frau)
  if (cat === "all" || cat === "scorers") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🎯 Quote Marcatori Oppidum (1+ Gol / Doppietta / Tripletta)</div>
          <span class="market-badge">Rosa Attiva (Esclusi ex Fortini e Frau)</span>
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
                  <span class="scorer-stat-pill">${sc.total2026} gol '26 · xG ${sc.expectedGoals}</span>
                </div>
                <div class="scorer-odds-mini">
                  <button type="button" class="odd-btn ${sel1}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_1', '${esc(sc.name)} Segna (1+)', ${sc.odd1Plus})">
                    <span class="odd-label">Segna 1+</span>
                    <span class="odd-val">${sc.odd1Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel2}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_2', '${esc(sc.name)} Doppietta (2+)', ${sc.odd2Plus})">
                    <span class="odd-label">2+ Gol</span>
                    <span class="odd-val">${sc.odd2Plus.toFixed(2)}</span>
                  </button>
                  <button type="button" class="odd-btn ${sel3}"
                    onclick="toggleBetPick('${esc(match.id)}', '${esc(matchTitle)}', 'SC_${sc.playerId}_3', '${esc(sc.name)} Tripletta (3+)', ${sc.odd3Plus})">
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

  // C) SPECIALE PORTIERI ATZENI & FARET
  if (cat === "all" || cat === "gk") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🧤 Speciale Portieri: ATZENI & FARET</div>
          <span class="market-badge">I Guardiani di Terramaini</span>
        </div>
        <div class="odds-grid">
          ${an.goalkeeperMarkets.map(gk =>
            oddButtonHtml(match, gk.id, gk.label, gk.sub, gk.odd)
          ).join("")}
        </div>
      </div>
    `;
  }

  // D) SPECIALE GOLIARDICHE SPOGLIATOIO
  if (cat === "all" || cat === "goliardic") {
    html += `
      <div class="market-block">
        <div class="market-block-header">
          <div class="market-block-title">🍺 Quote Goliardiche & Spogliatoio Oppidum</div>
          <span class="market-badge">Esclusiva La Società</span>
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

// ---------- GESTIONE SCHEDINA (BET SLIP) ----------
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
    renderBetSlip();
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
        Clicca su una o più quote del palinsesto per comporre la tua schedina singola o multipla!
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
            <button type="button" class="bs-remove" onclick="removeBetPick('${esc(item.id)}')" title="Rimuovi">✕</button>
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
        <label for="betStakeInput">Puntata (in Birre / Fiches 🍺)</label>
        <input type="number" id="betStakeInput" min="1" max="1000" value="${currentStake}" oninput="updateBetSlipMath()" />
      </div>
      <div class="stake-quick-btns">
        <button type="button" class="stake-q-btn" onclick="setQuickStake(5)">5 🍺</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(10)">10 🍺</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(25)">25 🍺</button>
        <button type="button" class="stake-q-btn" onclick="setQuickStake(50)">50 🍺</button>
      </div>
      <div class="bs-row">
        <span>Quota Totale (${appState.betSlip.length > 1 ? "Multipla" : "Singola"}):</span>
        <span class="bs-total-odd" id="bsTotalOddVal">${totalOdd.toFixed(2)}</span>
      </div>
      <div class="bs-row">
        <span>Vincita Potenziale:</span>
        <span class="bs-payout" id="bsPayoutVal">${potentialWin} 🍺</span>
      </div>
      <button type="button" class="btn btn-gold btn-block" onclick="placeBetSlip()">
        🔥 Piazza Schedina!
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
  if (payEl) payEl.textContent = `${potentialWin} 🍺`;
}

function placeBetSlip() {
  if (!appState.betSlip.length) return;
  const users = getUsers();
  const activeId = getActiveUserId();
  const user = users.find(u => u.id === activeId);
  if (!user) {
    showToast("⚠️ Seleziona o crea uno scommettitore in alto!");
    return;
  }

  const stakeInput = document.getElementById("betStakeInput");
  const stake = stakeInput ? Math.max(1, parseInt(stakeInput.value, 10) || 10) : 10;

  if (user.chips < stake) {
    showToast(`⚠️ Fiches/Birre insufficienti per ${esc(user.name)}! Usa il pulsante '+100 🍺' per ricaricare.`);
    return;
  }

  const totalOdd = Number(appState.betSlip.reduce((acc, item) => acc * item.odd, 1).toFixed(2));
  const potentialPayout = Math.round(stake * totalOdd);

  user.chips -= stake;
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
    status: "open" // open | won | lost
  });
  saveBetSlips(slips);

  appState.betSlip = [];
  renderWalletBar();
  renderBettingTab();
  renderBetSlip();
  renderLeaderboardTab();
  showToast(`🎉 Schedina piazzata da <strong>${esc(user.name)}</strong>! Vincita potenziale: <strong>${potentialPayout} 🍺</strong>`);
}

function shareCurrentSlipWhatsApp() {
  if (!appState.betSlip.length) return;
  const users = getUsers();
  const user = users.find(u => u.id === getActiveUserId());
  const stake = parseInt(document.getElementById("betStakeInput")?.value, 10) || 10;
  const totalOdd = appState.betSlip.reduce((acc, item) => acc * item.odd, 1);
  const win = Math.round(stake * totalOdd);

  const lines = [
    `🤽‍♂️ *OPPIDUM BET — LA SCHEDINA DI ${(user?.name || "SCOMMETTITORE").toUpperCase()}* 🍺`,
    ...appState.betSlip.map(p => `• ${p.matchTitle}: *${p.label}* (@${p.odd.toFixed(2)})`),
    `📈 Quota Totale: *${totalOdd.toFixed(2)}*`,
    `🪙 Puntata: *${stake} 🍺* → Vincita Potenziale: *${win} 🍺*`,
    `🔥 _Calcolata dall'Oracolo AI di Terramaini!_`
  ];
  window.open(`https://wa.me/?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
}

// ---------- TAB 2: ORACOLO AI & GENERATORE PARTITE FUTURE ----------
function renderOracleTab() {
  const matches = getUpcomingMatches();
  const activeMatch = matches.find(m => m.id === appState.selectedMatchId) || matches[0];

  const listEl = document.getElementById("oracleMatchesList");
  if (listEl) {
    listEl.innerHTML = matches.map(m => `
      <div class="market-block" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-weight:800;font-size:1rem;">
            ${m.isHome ? "🏠 Oppidum S. Cagliari vs " + esc(m.opponent) : "✈️ " + esc(m.opponent) + " vs Oppidum S. Cagliari"}
          </div>
          <div class="panel-sub">📅 ${esc(m.date)} · ${esc(m.competition)} · Quote 1X2: <strong>${m.analysis.mainMarkets.odd1.toFixed(2)} / ${m.analysis.mainMarkets.oddX.toFixed(2)} / ${m.analysis.mainMarkets.odd2.toFixed(2)}</strong></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" class="btn btn-navy btn-sm" onclick="selectMatchForCustomOdds('${esc(m.id)}')">✏️ Personalizza Quote</button>
          <button type="button" class="btn btn-whatsapp btn-sm" onclick="shareMatchOddsWhatsApp('${esc(m.id)}')">📲 Invia Quote su WhatsApp</button>
          <button type="button" class="btn btn-outline btn-sm" onclick="deleteUpcomingMatch('${esc(m.id)}')">🗑️ Elimina</button>
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
  const dateStr = document.getElementById("newMatchDate").value.trim() || "Prossimo Sabato · Ore 15:30";
  const compStr = document.getElementById("newMatchComp").value.trim() || "Serie C Maschile — Girone 5";
  const boost = parseFloat(document.getElementById("newMatchBoost").value) || 1.12;

  const analysis = generateAiMatchAnalysisAndOdds(opponent, isHome, boost);
  const matches = getUpcomingMatches();
  const newMatch = {
    id: uid("match"),
    date: dateStr,
    opponent,
    isHome,
    competition: compStr,
    boostOppidum: boost,
    status: "open",
    analysis
  };

  matches.unshift(newMatch);
  saveUpcomingMatches(matches);
  appState.selectedMatchId = newMatch.id;

  renderBettingTab();
  renderOracleTab();
  showToast(`🤖 L'Oracolo AI ha generato tutte le quote per <strong>Oppidum vs ${esc(opponent)}</strong>!`);
}

function selectMatchForCustomOdds(matchId) {
  appState.selectedMatchId = matchId;
  renderOracleTab();
  renderBettingTab();
  document.getElementById("customOddsEditorSection")?.scrollIntoView({ behavior: "smooth" });
}

function deleteUpcomingMatch(matchId) {
  let matches = getUpcomingMatches().filter(m => m.id !== matchId);
  saveUpcomingMatches(matches);
  if (appState.selectedMatchId === matchId) {
    appState.selectedMatchId = matches[0]?.id || null;
  }
  renderBettingTab();
  renderOracleTab();
  showToast("🗑️ Partita rimossa dal palinsesto.");
}

function renderCustomOddsEditor(match) {
  const container = document.getElementById("customOddsEditorBody");
  if (!container) return;
  const mm = match.analysis.mainMarkets;

  container.innerHTML = `
    <div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <div>
        <span class="badge badge-gk">Partita selezionata</span>
        <strong style="margin-left:8px;font-size:1.05rem;">
          ${match.isHome ? "Oppidum S. Cagliari vs " + esc(match.opponent) : esc(match.opponent) + " vs Oppidum S. Cagliari"}
        </strong>
      </div>
      <button type="button" class="btn btn-outline btn-sm" onclick="recalculateAiForMatch('${esc(match.id)}')">
        🔄 Ricalcola Quote con AI
      </button>
    </div>

    <div class="form-grid">
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
      💾 Salva Modifiche Quote Principali
    </button>

    <hr style="border:none;border-top:1px solid var(--border);margin:18px 0;" />

    <h4 style="margin-bottom:10px;font-size:0.95rem;">➕ Aggiungi una Quota Goliardica / Speciale Personalizzata a questa Partita</h4>
    <div class="form-grid">
      <div class="field">
        <label>Descrizione Scommessa Goliardica</label>
        <input type="text" id="customGoliardicLabel" placeholder="es. 'Atzeni para un rigore di faccia' o 'Melis segna da 10 metri'" />
      </div>
      <div class="field">
        <label>Sottotitolo / Dettaglio</label>
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
  `;
}

function saveManualMainOdds(matchId) {
  const matches = getUpcomingMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  m.analysis.mainMarkets.odd1 = parseFloat(document.getElementById("editOdd1").value) || m.analysis.mainMarkets.odd1;
  m.analysis.mainMarkets.oddX = parseFloat(document.getElementById("editOddX").value) || m.analysis.mainMarkets.oddX;
  m.analysis.mainMarkets.odd2 = parseFloat(document.getElementById("editOdd2").value) || m.analysis.mainMarkets.odd2;
  m.analysis.mainMarkets.totalLine = parseFloat(document.getElementById("editTotalLine").value) || m.analysis.mainMarkets.totalLine;
  m.analysis.mainMarkets.oppidumLine = parseFloat(document.getElementById("editOppidumLine").value) || m.analysis.mainMarkets.oppidumLine;

  saveUpcomingMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast("✅ Quote aggiornate manualmente!");
}

function recalculateAiForMatch(matchId) {
  const matches = getUpcomingMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;
  m.analysis = generateAiMatchAnalysisAndOdds(m.opponent, m.isHome, m.boostOppidum || 1.12);
  saveUpcomingMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast("🤖 Quote ricalcolate dall'Oracolo AI!");
}

function addCustomGoliardicOdd(matchId) {
  const label = document.getElementById("customGoliardicLabel")?.value.trim();
  const sub = document.getElementById("customGoliardicSub")?.value.trim() || "Quota personalizzata dallo spogliatoio";
  const odd = parseFloat(document.getElementById("customGoliardicOdd")?.value) || 2.5;
  if (!label) {
    showToast("⚠️ Inserisci il testo della scommessa goliardica!");
    return;
  }

  const matches = getUpcomingMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;

  m.analysis.goliardicMarkets.unshift({
    id: uid("gol_custom"),
    label: `🔥 ${label}`,
    sub,
    odd: Number(odd.toFixed(2))
  });

  saveUpcomingMatches(matches);
  renderBettingTab();
  renderOracleTab();
  showToast(`🍺 Nuova quota "${esc(label)}" (@${odd.toFixed(2)}) aggiunta al palinsesto!`);
}

function shareMatchOddsWhatsApp(matchId) {
  const matches = getUpcomingMatches();
  const m = matches.find(x => x.id === matchId);
  if (!m) return;
  const an = m.analysis;
  const mm = an.mainMarkets;
  const topScorers = an.scorerMarkets.slice(0, 5);

  const text = [
    `🤽‍♂️ *OPPIDUM BET — QUOTE UFFICIALI AI* 🔴🔵`,
    `🏆 *${m.isHome ? "Oppidum S. Cagliari vs " + m.opponent : m.opponent + " vs Oppidum S. Cagliari"}*`,
    `📅 ${m.date}`,
    ``,
    `📊 *ESITO 1X2:*`,
    `• 1: *${mm.odd1.toFixed(2)}* | X: *${mm.oddX.toFixed(2)}* | 2: *${mm.odd2.toFixed(2)}*`,
    `• Over/Under ${mm.totalLine} gol: *1.85*`,
    `• Oppidum Over ${mm.oppidumLine} gol: *${mm.oddOverOppidum.toFixed(2)}*`,
    ``,
    `🎯 *QUOTE MARCATORI OPPIDUM (1+ Gol):*`,
    ...topScorers.map(s => `• ${s.name}: *${s.odd1Plus.toFixed(2)}* (Doppietta @${s.odd2Plus.toFixed(2)})`),
    ``,
    `🧤 *SPECIALE PORTIERI (ATZENI & FARET):*`,
    `• Para un rigore (5m): *2.75*`,
    `• Clean sheet in un quarto: *3.40*`,
    ``,
    `🍺 *QUOTE GOLIARDICHE:*`,
    ...an.goliardicMarkets.slice(0, 3).map(g => `• ${g.label}: *${g.odd.toFixed(2)}*`),
    ``,
    `👉 Fai la tua schedina sul sito Oppidum Bet!`
  ].join("\n");

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

// ---------- TAB 3: ROSA ATTUALE & MATRICE MARCATORI 18 GIORNATE ----------
function toggleRosterExFilter(showEx) {
  appState.showExPlayersInRoster = showEx;
  renderRosterAndMatrixTab();
}

function renderRosterAndMatrixTab() {
  const showEx = appState.showExPlayersInRoster;
  const playersToShow = SEASON_DATA.players.filter(p => showEx ? true : p.active);

  // 1. Griglia Card Giocatori Rosa Attuale
  const rosterGrid = document.getElementById("rosterCardsGrid");
  if (rosterGrid) {
    rosterGrid.innerHTML = playersToShow.map(p => {
      const avg = (p.total / 18).toFixed(2);
      const maxG = Math.max(...p.goalsByMatch);
      const cardClass = p.isGoalkeeper ? "gk-card" : (!p.active ? "ex-card" : "");
      const statusBadge = p.isGoalkeeper
        ? `<span class="badge badge-gk">🧤 PORTIERE ATTIVO</span>`
        : (p.active ? `<span class="badge badge-active">✅ ROSA ATTUALE</span>` : `<span class="badge badge-ex">📦 EX GIOCATORE</span>`);

      return `
        <div class="player-card ${cardClass}">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
            <strong style="font-size:1.05rem;">${esc(p.name)}</strong>
            ${statusBadge}
          </div>
          <div class="panel-sub">${esc(p.role)} · ${esc(p.badge)}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;padding-top:8px;border-top:1px solid var(--border);font-size:0.82rem;">
            ${p.isGoalkeeper
              ? `<span> Ruolo: <strong>Difesa Porta</strong></span><span style="color:var(--gold);font-weight:800;">Quota Rigore @2.75</span>`
              : `<span>Gol '26: <strong style="color:var(--gold);font-size:1rem;">${p.total}</strong></span>
                 <span>Media: <strong>${avg}/g</strong></span>
                 <span>Max: <strong>${maxG} gol</strong></span>`
            }
          </div>
        </div>
      `;
    }).join("");
  }

  // 2. Tabella Completa 18 Giornate (VIS | ANA | AQU | IMP | BEL | DEV | CR | RN | PG x2)
  const matrixHead = document.getElementById("scorersMatrixHead");
  const matrixBody = document.getElementById("scorersMatrixBody");
  if (!matrixHead || !matrixBody) return;

  matrixHead.innerHTML = `
    <tr>
      <th>GIOCATORE</th>
      ${SEASON_DATA.opponentsOrder.map((o, i) =>
        `<th title="${i < 9 ? 'Andata' : 'Ritorno'} (${o.day}ª giornata): vs ${esc(o.name)} (${o.scoreUs}-${o.scoreThem})">
          ${esc(o.code)}<div style="font-size:0.62rem;color:var(--gold);font-weight:600;">${i < 9 ? 'AND' : 'RIT'}</div>
        </th>`
      ).join("")}
      <th class="total-col">TOT</th>
    </tr>
  `;

  // Per la tabella storica mostriamo i giocatori con gol o i giocatori filtrati
  const matrixPlayers = SEASON_DATA.players.filter(p => !p.isGoalkeeper && (showEx ? true : p.active));

  matrixBody.innerHTML = matrixPlayers.map(p => {
    const rowSum = p.goalsByMatch.reduce((a, b) => a + b, 0);
    return `
      <tr style="${!p.active ? 'opacity:0.58;' : ''}">
        <td>
          <strong>${esc(p.name)}</strong>
          ${!p.active ? `<span class="badge badge-ex" style="margin-left:4px;">EX</span>` : ""}
        </td>
        ${p.goalsByMatch.map(g => {
          const cls = g >= 3 ? "goal-cell-hat" : (g > 0 ? "goal-cell-pos" : "goal-cell-0");
          return `<td class="${cls}">${g}</td>`;
        }).join("")}
        <td class="total-col">${rowSum}</td>
      </tr>
    `;
  }).join("") + `
    <tr style="border-top:2px solid var(--gold);font-weight:900;">
      <td><strong>TOTALE SQUADRA (149)</strong></td>
      ${SEASON_DATA.teamTotalsByMatch.map(t => `<td style="color:var(--gold);font-weight:800;">${t}</td>`).join("")}
      <td class="total-col">149</td>
    </tr>
  `;
}

// ---------- TAB 4: CLASSIFICA SERIE C & 18 GIORNATE ----------
function setMatchdayFilterTeam(team) {
  appState.matchdayFilterTeam = team;
  renderLeagueAndScheduleTab();
}

function renderLeagueAndScheduleTab() {
  const standings = computeLeagueTable();
  const stBody = document.getElementById("serieCStandingsBody");
  if (stBody) {
    stBody.innerHTML = standings.map((t, i) => {
      const isOpp = t.name === "Oppidum S. Cagliari";
      const diff = t.gf - t.ga;
      return `
        <tr style="${isOpp ? 'background:rgba(200,16,46,0.25);font-weight:700;' : ''}">
          <td><strong>${i + 1}</strong></td>
          <td>
            <strong>${esc(t.name)}</strong>
            ${isOpp ? `<span class="badge badge-gk" style="margin-left:6px;">LA NOSTRA SQUADRA</span>` : ""}
          </td>
          <td style="font-weight:900;color:var(--gold);font-size:0.95rem;">${t.pts}</td>
          <td>${t.played}</td>
          <td style="color:#34d399;">${t.w}</td>
          <td style="color:#fbbf24;">${t.d}</td>
          <td style="color:#f87171;">${t.l}</td>
          <td>${t.gf}</td>
          <td>${t.ga}</td>
          <td>${diff > 0 ? "+" + diff : diff}</td>
        </tr>
      `;
    }).join("");
  }

  // Calendario 18 giornate
  const filterTeam = appState.matchdayFilterTeam;
  const grid = document.getElementById("allMatchdaysGrid");
  if (!grid) return;

  grid.innerHTML = SEASON_DATA.matchdays.map(md => {
    const filteredMatches = md.matches.filter(m =>
      filterTeam === "ALL" ? true : (m.home === filterTeam || m.away === filterTeam)
    );
    if (!filteredMatches.length) return "";
    return `
      <div class="md-card">
        <div class="md-title">
          <span>📅 ${md.day}ª Giornata</span>
          <span style="font-size:0.75rem;color:var(--text-muted);">${md.day <= 9 ? "Girone d'Andata" : "Girone di Ritorno"}</span>
        </div>
        ${filteredMatches.map(m => {
          const isOpp = m.home === "Oppidum S. Cagliari" || m.away === "Oppidum S. Cagliari";
          return `
            <div class="md-match ${isOpp ? "is-oppidum" : ""}">
              <div>
                <div style="font-size:0.7rem;color:var(--text-muted);">${esc(m.date)}</div>
                <div>${esc(m.home)} — ${esc(m.away)}</div>
              </div>
              <span class="md-score">${m.sh} - ${m.sa}</span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }).join("");
}

// ---------- TAB 5: CLASSIFICA SCOMMETTITORI & STORICO SCHEDINE ----------
function addBettorUser(e) {
  if (e) e.preventDefault();
  const input = document.getElementById("newBettorName");
  const name = (input?.value || "").trim();
  if (!name) {
    showToast("⚠️ Inserisci il nome o soprannome dello scommettitore!");
    return;
  }
  const users = getUsers();
  if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
    showToast("⚠️ Questo scommettitore è già in classifica!");
    return;
  }
  const newUser = { id: uid("u"), name, chips: 200, wins: 0, losses: 0 };
  users.push(newUser);
  saveUsers(users);
  setActiveUserId(newUser.id);
  if (input) input.value = "";
  renderWalletBar();
  renderLeaderboardTab();
  showToast(`🍺 Benvenuto <strong>${esc(name)}</strong>! Hai ricevuto 200 Birre/Fiches iniziali.`);
}

function topUpActiveUser() {
  const users = getUsers();
  const activeId = getActiveUserId();
  const u = users.find(x => x.id === activeId);
  if (!u) return;
  u.chips += 100;
  saveUsers(users);
  renderWalletBar();
  renderLeaderboardTab();
  showToast(`🍺 +100 Birre/Fiches accreditate a <strong>${esc(u.name)}</strong>!`);
}

function settleSlipStatus(slipId, newStatus) {
  const slips = getBetSlips();
  const slip = slips.find(s => s.id === slipId);
  if (!slip || slip.status !== "open") return;

  const users = getUsers();
  const user = users.find(u => u.id === slip.userId);

  slip.status = newStatus;
  if (newStatus === "won") {
    if (user) {
      user.chips += slip.potentialPayout;
      user.wins = (user.wins || 0) + 1;
    }
    showToast(`🏆 Schedina VINTA! +${slip.potentialPayout} 🍺 accreditate a ${esc(slip.userName)}!`);
  } else if (newStatus === "lost") {
    if (user) {
      user.losses = (user.losses || 0) + 1;
    }
    showToast(`❌ Schedina refertata come persa.`);
  }

  saveBetSlips(slips);
  saveUsers(users);
  renderWalletBar();
  renderLeaderboardTab();
}

function renderLeaderboardTab() {
  const users = getUsers();
  const sorted = [...users].sort((a, b) => b.chips - a.chips);
  const lbBody = document.getElementById("bettorsLeaderboardBody");
  if (lbBody) {
    lbBody.innerHTML = sorted.map((u, idx) => {
      const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `${idx + 1}°`;
      return `
        <tr>
          <td style="font-size:1.1rem;font-weight:800;">${medal}</td>
          <td><strong>${esc(u.name)}</strong></td>
          <td style="color:var(--gold);font-weight:900;font-size:1rem;">${u.chips} 🍺</td>
          <td style="color:#34d399;font-weight:700;">${u.wins || 0}</td>
          <td style="color:#f87171;font-weight:700;">${u.losses || 0}</td>
        </tr>
      `;
    }).join("");
  }

  const slips = getBetSlips();
  const slipsBox = document.getElementById("allSlipsHistoryBox");
  if (!slipsBox) return;

  if (!slips.length) {
    slipsBox.innerHTML = `<p class="panel-sub">Nessuna schedina ancora giocata. Vai nel Palinsesto e piazza la prima scommessa goliardica!</p>`;
    return;
  }

  slipsBox.innerHTML = slips.map(s => {
    const statusBadge = s.status === "open"
      ? `<span class="badge badge-open">⏳ IN CORSO</span>`
      : s.status === "won"
        ? `<span class="badge badge-won">🏆 VINTA (+${s.potentialPayout} 🍺)</span>`
        : `<span class="badge badge-lost">❌ PERSA (-${s.stake} 🍺)</span>`;

    return `
      <div class="market-block" style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div>
            <strong>🤽 ${esc(s.userName)}</strong>
            <span class="panel-sub" style="margin-left:8px;">🕒 ${esc(s.createdAt)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${statusBadge}
            ${s.status === "open" ? `
              <button type="button" class="btn btn-sm" style="background:#10b981;color:#052e16;padding:4px 10px;" onclick="settleSlipStatus('${esc(s.id)}', 'won')">✅ Segna Vinta</button>
              <button type="button" class="btn btn-sm" style="background:#ef4444;color:#fff;padding:4px 10px;" onclick="settleSlipStatus('${esc(s.id)}', 'lost')">❌ Segna Persa</button>
            ` : ""}
          </div>
        </div>
        <div style="font-size:0.84rem;color:#cbd5e1;margin-bottom:8px;">
          ${s.picks.map(p => `<div>• <em>${esc(p.matchTitle)}</em>: <strong>${esc(p.label)}</strong> (<span style="color:var(--gold)">@${p.odd.toFixed(2)}</span>)</div>`).join("")}
        </div>
        <div style="font-size:0.8rem;color:var(--text-muted);display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:6px;">
          <span>Puntata: <strong>${s.stake} 🍺</strong> · Quota Totale: <strong>${s.totalOdd.toFixed(2)}</strong></span>
          <span>Vincita Potenziale: <strong style="color:var(--gold)">${s.potentialPayout} 🍺</strong></span>
        </div>
      </div>
    `;
  }).join("");
}

// ---------- INIZIALIZZAZIONE ----------
window.addEventListener("DOMContentLoaded", () => {
  renderWalletBar();
  renderBettingTab();
  renderBetSlip();
  renderOracleTab();
  renderRosterAndMatrixTab();
  renderLeagueAndScheduleTab();
  renderLeaderboardTab();
});
