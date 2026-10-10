const { app, BrowserWindow, Tray, Menu, nativeImage, screen, ipcMain, session, shell, net, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Dev runs and the packaged app must read the same settings file, so pin the data folder
// (by default Electron derives it from package name vs productName, which differ).
// HERO_USER_DATA lets tests run against a throwaway folder without touching real settings.
const APP_DATA_DIR = process.env.HERO_USER_DATA || path.join(app.getPath('appData'), 'Desktop Hero');
const LEGACY_DATA_DIR = path.join(app.getPath('appData'), 'hanging-spidey');
app.setPath('userData', APP_DATA_DIR);

const SETTINGS_VERSION = 2;
const PIVOT_RIGHT_INSET = 140; // pivot sits this far from the right edge of the work area
const SCALE_MIN = 0.6;
const SCALE_MAX = 1.5;

const CHARACTERS = [
  { id: 'spiderman', label: 'Spider-Man' },
  { id: 'robobuddy', label: 'Robo Buddy' },
  { id: 'deadpool', label: 'Deadpool' },
  { id: 'alien', label: 'Green Alien' },
  { id: 'zoro', label: 'Zoro' },
  { id: 'ninjazen', label: 'Zen Ninja' },
  { id: 'ninjakid', label: 'Ninja Kid' },
  { id: 'hulk', label: 'Hulk' },
  { id: 'hoodbot', label: 'Hoodie Bot' },
  { id: 'bigears', label: 'Big-Ear Alien' },
  { id: 'kakashi', label: 'Kakashi' },
  { id: 'laptopguy', label: 'Laptop Hoodie' },
  { id: 'neonscout', label: 'Neon Scout' },
  { id: 'luffy', label: 'Luffy' }
];
// Where a character may sit. The first entry is his primary pose, used whenever the current one stops being valid.
const PLACEMENTS = [
  { id: 'hanging', label: 'Hanging (default)' },
  { id: 'top_edge', label: 'Top edge / menu bar' },
  { id: 'dock', label: 'Dock / bottom bar' },
  { id: 'free_roam', label: 'Free roam' }
];
const ALL_POSES = ['hanging', 'top_edge', 'dock', 'free_roam'];
const CHAR_PLACEMENTS = {
  spiderman: ['hanging'],
  robobuddy: ALL_POSES,
  deadpool: ['dock'],
  alien: ['dock', 'free_roam'],
  zoro: ['dock', 'free_roam'],
  ninjazen: ['dock', 'free_roam'],
  ninjakid: ['dock', 'free_roam'],
  hulk: ['dock', 'free_roam'],
  hoodbot: ALL_POSES,
  bigears: ['dock', 'free_roam'],
  kakashi: ['dock', 'free_roam'],
  laptopguy: ALL_POSES,
  neonscout: ['dock', 'free_roam'],
  luffy: ['dock', 'free_roam']
};
const placementsOf = id => CHAR_PLACEMENTS[id] || ['hanging'];
// The pose a character ends up in: keep the current one if he supports it, otherwise his primary pose.
const validPose = (charId, pose) => (placementsOf(charId).includes(pose) ? pose : placementsOf(charId)[0]);
const LANGUAGES = ['english', 'manglish', 'malayalam', 'hinglish', 'hindi', 'tanglish', 'tamil', 'kanglish', 'kannada'];
const GENDERS = ['male', 'female', 'other'];
const NAME_MAX = 40;
const RELATIONSHIPS = ['single', 'relationship', 'married'];
const STATUSES = ['working', 'student', 'idle'];
const PRIORITIES = ['high', 'med', 'low'];
const AGE_MIN = 5, AGE_MAX = 120, ADULT_AGE = 18;
const TASK_TITLE_MAX = 120;
const TASKS_MAX = 200;
const TASK_CHECK_MS = 15000;   // how often due tasks are looked for
const SAY_KINDS = ['water', 'rest', 'time', 'greet', 'task', 'quip'];
const SPEEDS = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' }
];

// Smooth rendering on modest hardware: rasterise on the GPU and avoid extra texture copies.
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');

let overlay = null;
let interactiveTimer = null;
let dashboard = null;
let tray = null;
let quitting = false;
let settings = { character: 'spiderman', speed: 'normal', scale: 1, soundEnabled: true,
  language: null, bubblesEnabled: true,
  userName: '', userGender: null, dob: null, userAge: null, userRelationship: null, userStatus: null,
  adultMode: false, profileConfigured: false, lastWishDate: null, wishCounter: 0, dashboardTheme: 'red-black', tasks: [], placementMode: 'hanging', freePos: null };

const THEMES = ['red-black', 'red-white'];
const settingsFile = () => path.join(app.getPath('userData'), 'settings.json');

const clampScale = v => Math.min(SCALE_MAX, Math.max(SCALE_MIN, Math.round(Number(v) * 100) / 100));

function readSettingsFile() {
  // Prefer the pinned location; fall back to the pre-1.0 folder so earlier choices carry over.
  for (const file of [settingsFile(), path.join(LEGACY_DATA_DIR, 'settings.json')]) {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { /* try next */ }
  }
  return null;
}

// Age is always derived from the date of birth (local calendar dates), so it keeps itself up to date.
const DOB_RE = /^\d{4}-\d{2}-\d{2}$/;
function parseDob(dob) {
  if (typeof dob !== 'string' || !DOB_RE.test(dob)) return null;
  const [y, m, d] = dob.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? dt : null;
}
function ageFromDob(dob, now = new Date()) {
  const b = parseDob(dob);
  if (!b || b > now) return null;
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age >= AGE_MIN && age <= AGE_MAX ? age : null;
}
const isBirthday = (now = new Date()) => {
  const b = parseDob(settings.dob);
  return !!b && b.getMonth() === now.getMonth() && b.getDate() === now.getDate();
};
const isAdult = () => Number.isInteger(settings.userAge) && settings.userAge >= ADULT_AGE;

// A task's alert time from its calendar date (YYYY-MM-DD) and clock time (HH:MM), in local time.
function dueFrom(date, time) {
  if (!date || !time) return null;
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const ts = new Date(y, m - 1, d, hh, mm, 0, 0).getTime();
  return Number.isFinite(ts) ? ts : null;
}
const pad2 = n => String(n).padStart(2, '0');
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

// Accepts only well-formed tasks, so a hand-edited settings.json can't break the app.
function cleanTask(t) {
  if (!t || typeof t.id !== 'string' || typeof t.title !== 'string') return null;
  const title = t.title.replace(/\s+/g, ' ').trim().slice(0, TASK_TITLE_MAX);
  if (!title) return null;
  let date = typeof t.date === 'string' && DATE_RE.test(t.date) ? t.date : null;
  let time = typeof t.time === 'string' && TIME_RE.test(t.time) ? t.time : null;
  let dueAt = null;
  if (date && time) {
    dueAt = dueFrom(date, time);
  } else if (!date && Number.isFinite(t.dueAt)) {       // tasks saved before the calendar existed
    const d = new Date(t.dueAt);
    date = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    time = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    dueAt = t.dueAt;
  }
  return {
    id: t.id.slice(0, 40),
    title,
    date,
    time,
    priority: PRIORITIES.includes(t.priority) ? t.priority : 'med',
    dueAt,
    createdAt: Number.isFinite(t.createdAt) ? t.createdAt : Date.now(),
    done: t.done === true,
    notified: t.notified === true
  };
}

// The companion stays dormant until every profile field has been entered by hand and saved.
const profileComplete = () =>
  settings.userName.length > 0 && GENDERS.includes(settings.userGender) &&
  ageFromDob(settings.dob) !== null && LANGUAGES.includes(settings.language) &&
  RELATIONSHIPS.includes(settings.userRelationship) && STATUSES.includes(settings.userStatus);

function loadSettings() {
  const saved = readSettingsFile();
  let migrated = false;
  if (saved) {
    if (saved.character === 'robo') saved.character = 'robobuddy';            // renamed
    if (CHARACTERS.some(c => c.id === saved.character)) settings.character = saved.character;   // anything removed -> default
    if (SPEEDS.some(s => s.id === saved.speed)) settings.speed = saved.speed;
    if (Number.isFinite(saved.scale)) settings.scale = clampScale(saved.scale);
    if (typeof saved.soundEnabled === 'boolean') settings.soundEnabled = saved.soundEnabled;
    if (typeof saved.bubblesEnabled === 'boolean') settings.bubblesEnabled = saved.bubblesEnabled;
    if (typeof saved.userName === 'string') settings.userName = saved.userName.trim().slice(0, NAME_MAX);
    // Gender, relationship and status used to be pre-filled, so only trust them from a profile the user saved on purpose.
    const confirmed = saved.profileConfigured === true;
    if (confirmed && GENDERS.includes(saved.userGender)) settings.userGender = saved.userGender;
    if (confirmed && LANGUAGES.includes(saved.language)) settings.language = saved.language;   // used to default to Manglish
    if (ageFromDob(saved.dob) !== null) settings.dob = saved.dob;
    if (/^\d{4}-\d{2}-\d{2}$/.test(saved.lastWishDate || '')) settings.lastWishDate = saved.lastWishDate;
    if (Number.isInteger(saved.wishCounter) && saved.wishCounter >= 0) settings.wishCounter = saved.wishCounter;
    if (typeof saved.adultMode === 'boolean') settings.adultMode = saved.adultMode;
    settings.userAge = ageFromDob(settings.dob);
    if (confirmed && RELATIONSHIPS.includes(saved.userRelationship)) settings.userRelationship = saved.userRelationship;
    if (confirmed && STATUSES.includes(saved.userStatus)) settings.userStatus = saved.userStatus;
    if (THEMES.includes(saved.dashboardTheme)) settings.dashboardTheme = saved.dashboardTheme;
    if (PLACEMENTS.some(p => p.id === saved.placementMode)) settings.placementMode = saved.placementMode;
    if (saved.freePos && Number.isFinite(saved.freePos.x) && Number.isFinite(saved.freePos.y)) {
      settings.freePos = { x: Math.min(1, Math.max(0, saved.freePos.x)), y: Math.min(1, Math.max(0, saved.freePos.y)) };
    }
    if (Array.isArray(saved.tasks)) settings.tasks = saved.tasks.map(cleanTask).filter(Boolean).slice(0, TASKS_MAX);
    // Rewrite the file when it is from an older build, still holds a retired license key, or named a removed character.
    migrated = saved.version !== SETTINGS_VERSION || 'license' in saved || 'profileDone' in saved || saved.character !== settings.character;
  }
  settings.profileConfigured = !!saved && saved.profileConfigured === true && profileComplete();
  if (saved && saved.profileConfigured !== settings.profileConfigured) migrated = true;
  settings.placementMode = validPose(settings.character, settings.placementMode);
  if (!isAdult()) settings.adultMode = false;          // 18+ humour needs an age of 18 or more on the profile
  // Settings from an older build: rewrite in the current format and drop stale web caches.
  if (migrated || !saved) {
    saveSettings();
    session.defaultSession.clearCache().catch(() => {});
  }
}

function saveSettings() {
  // Write to a temp file then rename, so a crash mid-write can never leave a truncated settings.json.
  try {
    fs.mkdirSync(APP_DATA_DIR, { recursive: true });
    const tmp = settingsFile() + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify({ version: SETTINGS_VERSION, ...settings }));
    fs.renameSync(tmp, settingsFile());
  } catch (err) {
    console.error('Could not save settings:', err);
  }
}

// What renderers see.
function publicState() {
  return {
    character: settings.character,
    speed: settings.speed,
    scale: settings.scale,
    soundEnabled: settings.soundEnabled,
    language: settings.language,
    bubblesEnabled: settings.bubblesEnabled,
    userName: settings.userName,
    userGender: settings.userGender,
    dob: settings.dob,
    userAge: settings.userAge,
    birthday: isBirthday(),
    lastWishDate: settings.lastWishDate,
    wishCounter: settings.wishCounter,
    userRelationship: settings.userRelationship,
    userStatus: settings.userStatus,
    profileConfigured: settings.profileConfigured,
    dashboardTheme: settings.dashboardTheme,
    tasks: settings.tasks,
    adultMode: settings.adultMode,
    placementMode: settings.placementMode,
    freePos: settings.freePos,
    anchors: overlayAnchors(),
    pivot: overlayPivot(),
    characters: CHARACTERS.map(c => ({ id: c.id, label: c.label, placements: placementsOf(c.id) }))
  };
}

// Single source of truth: persist, then push the full state to overlay, dashboard and tray.
function broadcast() {
  const state = publicState();
  for (const w of [overlay, dashboard]) {
    if (w && !w.isDestroyed()) w.webContents.send('state', state);
  }
  if (tray) tray.setContextMenu(buildMenu());
}

function applyChange(key, value) {
  if (key === 'character') {
    const c = CHARACTERS.find(x => x.id === value);
    if (!c) return false;
    settings.character = value;
    settings.placementMode = validPose(value, settings.placementMode);   // e.g. Deadpool can only dock
  } else if (key === 'placementMode') {
    if (!placementsOf(settings.character).includes(value)) return false;
    settings.placementMode = value;
  } else if (key === 'adultMode') {
    if (typeof value !== 'boolean') return false;
    if (value && !isAdult()) return false;                 // 18+ mode needs an age of 18 or more
    settings.adultMode = value;
  } else if (key === 'dob') {
    const age = ageFromDob(value);
    if (age === null) return false;
    settings.dob = value;
    settings.userAge = age;
    if (!isAdult()) settings.adultMode = false;
  } else if (key === 'wishDay') {
    if (typeof value !== 'string' || !DOB_RE.test(value)) return false;
    if (value === settings.lastWishDate) return true;
    settings.lastWishDate = value;                          // a new calendar day: the daily wish moves on
    settings.wishCounter += 1;
  } else if (key === 'userRelationship') {
    if (!RELATIONSHIPS.includes(value)) return false;
    settings.userRelationship = value;
  } else if (key === 'userStatus') {
    if (!STATUSES.includes(value)) return false;
    settings.userStatus = value;
  } else if (key === 'dashboardTheme') {
    if (!THEMES.includes(value)) return false;
    settings.dashboardTheme = value;
  } else if (key === 'speed') {
    if (!SPEEDS.some(s => s.id === value)) return false;
    settings.speed = value;
  } else if (key === 'language') {
    if (!LANGUAGES.includes(value)) return false;
    settings.language = value;
  } else if (key === 'userName') {
    if (typeof value !== 'string') return false;
    settings.userName = value.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
  } else if (key === 'userGender') {
    if (!GENDERS.includes(value)) return false;
    settings.userGender = value;
  } else if (key === 'bubblesEnabled') {
    if (typeof value !== 'boolean') return false;
    settings[key] = value;
  } else if (key === 'soundEnabled') {
    if (typeof value !== 'boolean') return false;
    settings.soundEnabled = value;
  } else if (key === 'scale') {
    if (!Number.isFinite(Number(value))) return false;
    settings.scale = clampScale(value);
  } else {
    return false;
  }
  saveSettings();
  broadcast();
  return true;
}

// Draws a 16x16 (@2x = 32x32) red circle with a white dot as BGRA pixels.
function makeTrayIcon() {
  const size = 32;
  const buf = Buffer.alloc(size * size * 4);
  const c = (size - 1) / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c);
      const i = (y * size + x) * 4;
      let rgba = [0, 0, 0, 0];
      if (d <= 14) rgba = d <= 4 ? [255, 255, 255, 255] : [216, 20, 28, 255];
      buf[i] = rgba[2]; buf[i + 1] = rgba[1]; buf[i + 2] = rgba[0]; buf[i + 3] = rgba[3];
    }
  }
  return nativeImage.createFromBitmap(buf, { width: size, height: size, scaleFactor: 2 });
}

function buildMenu() {
  if (!settings.profileConfigured) {
    return Menu.buildFromTemplate([
      { label: 'Finish setup…', click: () => showDashboard() },
      { type: 'separator' },
      { label: 'Quit', click: () => app.quit() }
    ]);
  }
  return Menu.buildFromTemplate([
    { label: 'Open Dashboard', click: () => showDashboard() },
    { type: 'separator' },
    {
      label: 'Select Character',
      submenu: CHARACTERS.map(c => ({
        label: c.label,
        type: 'radio',
        checked: settings.character === c.id,
        click: () => applyChange('character', c.id)
      }))
    },
    {
      label: 'Placement',
      submenu: PLACEMENTS.filter(p => placementsOf(settings.character).includes(p.id)).map(p => ({
        label: p.label,
        type: 'radio',
        checked: settings.placementMode === p.id,
        click: () => applyChange('placementMode', p.id)
      }))
    },
    {
      label: 'Swing Speed',
      submenu: SPEEDS.map(s => ({
        label: s.label,
        type: 'radio',
        checked: settings.speed === s.id,
        click: () => applyChange('speed', s.id)
      }))
    },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
}

// ---------- Overlay (transparent, click-through) ----------
// The overlay covers the whole primary display so the character can be dragged anywhere.
// It is click-through everywhere except while the pointer is over (or dragging) the character.
const overlayDisplay = () => screen.getPrimaryDisplay();

// Where the rope is anchored, in overlay-window coordinates.
function overlayPivot() {
  const { bounds, workArea } = overlayDisplay();
  return { x: workArea.x + workArea.width - PIVOT_RIGHT_INSET - bounds.x, y: workArea.y - bounds.y };
}

// Where the character sits in each mode, in overlay-window coordinates: the menu bar's lower edge,
// or the top edge of the Dock / taskbar (the bottom of the usable work area).
function overlayAnchors() {
  const { bounds, workArea } = overlayDisplay();
  const x = workArea.x + workArea.width - PIVOT_RIGHT_INSET - bounds.x;
  return {
    top: { x, y: workArea.y - bounds.y },
    dock: { x, y: workArea.y + workArea.height - bounds.y }
  };
}

function applyOverlayBounds() {
  if (!overlay || overlay.isDestroyed()) return;
  overlay.setBounds(overlayDisplay().bounds);
}

function createOverlay() {
  const { bounds } = overlayDisplay();
  overlay = new BrowserWindow({
    ...bounds,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    focusable: false,
    enableLargerThanScreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
      autoplayPolicy: 'no-user-gesture-required'   // audio must never be blocked on this click-through overlay
    }
  });

  // Dev only: show the overlay's [sfx] debug lines in the terminal.
  if (!app.isPackaged) {
    overlay.webContents.on('console-message', (_e, _l, msg) => { if (msg.startsWith('[sfx]')) console.log(msg); });
  }

  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  overlay.setIgnoreMouseEvents(true, { forward: true });
  applyOverlayBounds();
  overlay.loadFile('index.html');
  overlay.webContents.on('did-finish-load', () => {
    overlayReady = true;
    clearTimeout(interactiveTimer);
    overlay.setIgnoreMouseEvents(true, { forward: true });
    overlay.webContents.send('state', publicState());
  });
}

// ---------- Dashboard ----------
function createDashboard() {
  dashboard = new BrowserWindow({
    width: 780,
    height: 640,
    minWidth: 640,
    minHeight: 560,
    show: false,
    title: 'Desktop Hero',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    backgroundColor: '#0f0f12',
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'dashboard-preload.js') }
  });
  dashboard.setMenuBarVisibility(false);
  // Links in the dashboard (the creator's Instagram) open in the default browser, never inside the app.
  dashboard.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\/(www\.)?instagram\.com\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  dashboard.webContents.on('will-navigate', (e, url) => { if (!url.startsWith('file:')) e.preventDefault(); });
  dashboard.loadFile('dashboard.html');
  dashboard.webContents.on('did-finish-load', () => dashboard.webContents.send('state', publicState()));

  // Closing only hides the window so the character keeps hanging.
  dashboard.on('close', e => {
    if (!quitting) { e.preventDefault(); dashboard.hide(); }
  });
}

function showDashboard() {
  if (!dashboard || dashboard.isDestroyed()) createDashboard();
  dashboard.show();
  dashboard.focus();
  app.focus({ steal: true });
}

// Only the dashboard may change settings.
const fromDashboard = e => dashboard && !dashboard.isDestroyed() && e.sender === dashboard.webContents;

// The overlay is click-through except while the pointer is over the character.
// The renderer re-sends `true` as a heartbeat while it needs the mouse; if the heartbeat stops
// (renderer stalled or crashed) the full-screen window reverts to click-through on its own.
ipcMain.on('overlay-interactive', (e, interactive) => {
  if (!overlay || overlay.isDestroyed() || e.sender !== overlay.webContents) return;
  clearTimeout(interactiveTimer);
  if (interactive === true) {
    overlay.setIgnoreMouseEvents(false);
    interactiveTimer = setTimeout(() => {
      if (overlay && !overlay.isDestroyed()) overlay.setIgnoreMouseEvents(true, { forward: true });
    }, 1500);
  } else {
    overlay.setIgnoreMouseEvents(true, { forward: true });
  }
});

// Double-click chat: the overlay is normally unfocusable, so it only takes keyboard focus while a chat is open.
ipcMain.on('chat-focus', (e, on) => {
  if (!overlay || overlay.isDestroyed() || e.sender !== overlay.webContents) return;
  overlay.setFocusable(on === true);
  if (on === true) { overlay.focus(); app.focus({ steal: true }); }
});

// Dashboard "Try it" buttons: make the overlay show a speech bubble of the given kind right now.
ipcMain.on('say', (e, kind) => {
  if (!fromDashboard(e) || !SAY_KINDS.includes(kind)) return;
  if (overlay && !overlay.isDestroyed()) overlay.webContents.send('say', kind);
});

// Free roam: the overlay reports where the character was dropped (as fractions of the screen).
ipcMain.on('free-pos', (e, pos) => {
  if (!overlay || overlay.isDestroyed() || e.sender !== overlay.webContents) return;
  if (!pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.y)) return;
  settings.freePos = { x: Math.min(1, Math.max(0, pos.x)), y: Math.min(1, Math.max(0, pos.y)) };
  saveSettings();
});

ipcMain.handle('get-state', e => (fromDashboard(e) ? publicState() : null));

// ---------- To-do / reminders ----------
// Tasks live in settings.json. The dashboard edits them; the main process alone decides when one
// is due and tells the overlay, so an alert fires once even if windows reload.
ipcMain.handle('task', (e, op, payload) => {
  if (!fromDashboard(e)) return false;
  if (op === 'add') {
    const p = payload || {};
    const t = cleanTask({
      id: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      title: p.title, date: p.date, time: p.time, priority: p.priority,
      createdAt: Date.now(), done: false, notified: false
    });
    if (!t || !t.date || settings.tasks.length >= TASKS_MAX) return false;   // every task sits on a calendar date
    settings.tasks.push(t);
  } else if (op === 'toggle') {
    const t = settings.tasks.find(x => x.id === payload);
    if (!t) return false;
    t.done = !t.done;
    if (!t.done && t.dueAt && t.dueAt > Date.now()) t.notified = false;   // re-armed if still in the future
  } else if (op === 'delete') {
    const n = settings.tasks.length;
    settings.tasks = settings.tasks.filter(x => x.id !== payload);
    if (settings.tasks.length === n) return false;
  } else if (op === 'clear-done') {
    settings.tasks = settings.tasks.filter(x => !x.done);
  } else {
    return false;
  }
  saveSettings();
  broadcast();
  return true;
});

let overlayReady = false;

// Once the date rolls over: a birthday starts or ends, or the user turns a year older (which may unlock 18+ mode).
let lastBirthday = null;
function refreshDaily() {
  if (!settings.dob) return;
  const age = ageFromDob(settings.dob), birthday = isBirthday();
  if (age === settings.userAge && birthday === lastBirthday) return;
  lastBirthday = birthday;
  if (age !== null && age !== settings.userAge) { settings.userAge = age; saveSettings(); }
  broadcast();
}

function checkTasks() {
  if (!overlayReady || !overlay || overlay.isDestroyed()) return;
  const now = Date.now();
  const due = settings.tasks.filter(t => !t.done && !t.notified && t.dueAt !== null && t.dueAt <= now);
  if (!due.length) return;
  for (const t of due) {
    t.notified = true;                                   // once only, even across restarts
    overlay.webContents.send('task-due', { title: t.title });
  }
  saveSettings();
  broadcast();
}

// "Save Profile & Activate Hero": validate every field, store them together, then bring the character to life.
ipcMain.handle('save-profile', (e, p) => {
  if (!fromDashboard(e) || !p || typeof p !== 'object') return { ok: false, error: 'Not allowed.' };
  const name = typeof p.userName === 'string' ? p.userName.replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) : '';
  if (!name) return { ok: false, error: 'Enter your name.' };
  if (!GENDERS.includes(p.userGender)) return { ok: false, error: 'Choose a gender.' };
  const age = ageFromDob(p.dob);
  if (age === null) return { ok: false, error: 'Enter a valid date of birth.' };
  if (!LANGUAGES.includes(p.userLanguage)) return { ok: false, error: 'Choose a language.' };
  if (!RELATIONSHIPS.includes(p.userRelationship)) return { ok: false, error: 'Choose a relationship status.' };
  if (!STATUSES.includes(p.userStatus)) return { ok: false, error: 'Choose your current status.' };
  settings.userName = name;
  settings.userGender = p.userGender;
  settings.dob = p.dob;
  settings.userAge = age;
  settings.language = p.userLanguage;
  settings.userRelationship = p.userRelationship;
  settings.userStatus = p.userStatus;
  settings.adultMode = p.adultMode === true && age >= ADULT_AGE;
  settings.profileConfigured = true;
  saveSettings();
  if (!overlay || overlay.isDestroyed()) createOverlay();
  broadcast();
  return { ok: true };
});

ipcMain.handle('set-setting', (e, key, value) => (fromDashboard(e) ? applyChange(key, value) : false));

// ---------- Update check ----------
// A few seconds after launch, ask GitHub for the latest release. Any failure (offline, rate limit, bad reply) is ignored.
const RELEASES_API = 'https://api.github.com/repos/shreyasrajalakshmi/desktop_hero/releases/latest';
const normalizeTag = t => String(t || '').trim().replace(/^v/i, '');

function checkForUpdate() {
  try {
    const req = net.request({ method: 'GET', url: RELEASES_API });
    req.setHeader('Accept', 'application/vnd.github+json');
    req.setHeader('User-Agent', `DesktopHero/${app.getVersion()}`);
    const timeout = setTimeout(() => { try { req.abort(); } catch (_) {} }, 10000);
    req.on('response', res => {
      if (res.statusCode !== 200) { clearTimeout(timeout); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('error', () => clearTimeout(timeout));
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const release = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const latest = normalizeTag(release.tag_name);
          if (!latest || latest === normalizeTag(app.getVersion())) return;
          const url = typeof release.html_url === 'string' && release.html_url.startsWith('https://github.com/') ? release.html_url : null;
          if (!url) return;
          dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: `Desktop Hero ${latest} is available`,
            detail: `You are using version ${app.getVersion()}.`,
            buttons: ['Download Update', 'Later'],
            defaultId: 0,
            cancelId: 1
          }).then(({ response }) => { if (response === 0) shell.openExternal(url); }).catch(() => {});
        } catch (_) { /* unreadable reply: stay quiet */ }
      });
    });
    req.on('error', () => clearTimeout(timeout));
    req.end();
  } catch (_) { /* never let the update check disturb the app */ }
}

// One instance only: a second launch (double-click, Spotlight) just surfaces the running app's dashboard.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => { if (app.isReady()) showDashboard(); });
}

app.whenReady().then(() => {
  if (!gotLock) return;
  loadSettings();
  if (process.platform === 'darwin' && app.dock) app.dock.setIcon(path.join(__dirname, 'assets', 'icon.png'));   // dev runs; the packaged app uses build/icon.icns
  tray = new Tray(makeTrayIcon());
  tray.setToolTip('Desktop Hero');
  tray.setContextMenu(buildMenu());
  if (process.platform !== 'darwin') tray.on('click', () => showDashboard());
  if (settings.profileConfigured) createOverlay();      // otherwise the hero waits for "Save Profile & Activate Hero"
  screen.on('display-metrics-changed', () => { applyOverlayBounds(); broadcast(); });
  createDashboard();
  // Tasks that came due while the app was closed are announced shortly after launch, then on a timer.
  setTimeout(checkTasks, 6000);
  setTimeout(checkForUpdate, 4000);
  setInterval(() => { checkTasks(); refreshDaily(); }, TASK_CHECK_MS);
  // Always open the dashboard on launch and bring it to the front.
  dashboard.once('ready-to-show', () => showDashboard());
});

// Clicking the Dock icon while running restores the (possibly hidden) dashboard.
app.on('activate', () => showDashboard());

// Dev only: reload windows when UI files change, and relaunch when the main process code changes.
if (!app.isPackaged) {
  const uiFiles = ['index.html', 'style.css', 'renderer.js', 'locales.js', 'locales-indic.js', 'locales-tasks.js', 'locales-heroes.js', 'locales-profile.js', 'locales-extra.js', 'dashboard.html', 'dashboard.css', 'dashboard.js'];
  let timer = null;
  const debounce = fn => { clearTimeout(timer); timer = setTimeout(fn, 120); };
  app.whenReady().then(() => {
    fs.watch(__dirname, (_evt, name) => {
      if (!name) return;
      if (['main.js', 'preload.js', 'dashboard-preload.js'].includes(name)) {
        debounce(() => { app.relaunch(); app.exit(0); });
      } else if (uiFiles.includes(name)) {
        debounce(() => {
          for (const w of [overlay, dashboard]) if (w && !w.isDestroyed()) w.webContents.reloadIgnoringCache();
        });
      }
    });
    fs.watch(path.join(__dirname, 'assets'), () => debounce(() => {
      if (overlay && !overlay.isDestroyed()) overlay.webContents.reloadIgnoringCache();
    }));
  });
}

app.on('before-quit', () => { quitting = true; });
app.on('window-all-closed', () => app.quit());
