const CHARACTERS = ['spiderman', 'robobuddy', 'deadpool', 'alien', 'zoro', 'ninjazen', 'ninjakid', 'hulk', 'hoodbot', 'bigears', 'kakashi', 'laptopguy', 'neonscout', 'luffy'];
const SPEEDS = { slow: '4.5s', normal: '3s', fast: '1.8s' };
const ART = {
  spiderman: 'assets/spiderman.png',
  robobuddy: 'assets/robobuddy.png',
  deadpool: 'assets/deadpool.png',
  alien: 'assets/alien.png',
  zoro: 'assets/zoro.png',
  ninjazen: 'assets/ninjazen.png',
  ninjakid: 'assets/ninjakid.png',
  hulk: 'assets/hulk.png',
  hoodbot: 'assets/hoodbot.png',
  bigears: 'assets/bigears.png',
  kakashi: 'assets/kakashi.png',
  laptopguy: 'assets/laptopguy.png',
  neonscout: 'assets/neonscout.png',
  luffy: 'assets/luffy.png'
};

// Moves per character, with how long each runs (ms) before its class is cleared.
const MOVES = {
  spiderman: { zip: 900, spin: 1000, salute: 1200 },
  robobuddy: { zip: 900, spin: 1000, salute: 1200 },
  deadpool: { zip: 900, spin: 1000, salute: 1200 },
  alien: { zip: 900, spin: 1000, salute: 1200 },
  zoro: { zip: 900, spin: 1000, salute: 1200 },
  ninjazen: { zip: 900, spin: 1000, salute: 1200 },
  ninjakid: { zip: 900, spin: 1000, salute: 1200 },
  hulk: { zip: 900, spin: 1000, salute: 1200 },
  hoodbot: { zip: 900, spin: 1000, salute: 1200 },
  bigears: { zip: 900, spin: 1000, salute: 1200 },
  kakashi: { zip: 900, spin: 1000, salute: 1200 },
  laptopguy: { zip: 900, spin: 1000, salute: 1200 },
  neonscout: { zip: 900, spin: 1000, salute: 1200 },
  luffy: { zip: 900, spin: 1000, salute: 1200 }
};

const figure = document.getElementById('figure');
const hero = document.getElementById('hero');
const heroHit = figure.querySelector('.hero-hit');
const pull = figure.querySelector('.pull');
const thread = figure.querySelector('.thread');
const root = document.documentElement;
const pivotEl = document.getElementById('pivot');

// Decode all artwork up front so switching characters never flashes an empty frame.
const preloaded = Object.values(ART).map(src => { const i = new Image(); i.src = src; return i; });

let current = null;
let uiScale = 1;
let busyUntil = 0;
let moveTimer = null;
let lastQuipAt = 0;

function clearMoves() {
  [...figure.classList].filter(c => c.startsWith('act-')).forEach(c => figure.classList.remove(c));
  clearTimeout(moveTimer);
  busyUntil = 0;
}

function performMove() {
  if (performance.now() < busyUntil) return;
  const moves = Object.keys(MOVES[current] || {});
  if (!moves.length) return;
  const name = moves[Math.floor(Math.random() * moves.length)];
  const ms = MOVES[current][name];
  figure.classList.add('act-' + name);
  if (Date.now() - lastQuipAt > 7000 && Math.random() < 0.5) { lastQuipAt = Date.now(); say('quip'); }
  busyUntil = performance.now() + ms;
  moveTimer = setTimeout(clearMoves, ms);
}

window.pet.onState(({ character, speed, scale, soundEnabled, pivot, anchors: anchorState, placementMode, freePos: freeState, language, bubblesEnabled, userName, userGender, adultMode, userAge, userRelationship, userStatus, birthday, hasGeminiKey }) => {
  if (CHARACTERS.includes(character) && character !== current) {
    clearMoves();
    current = character;
    CHARACTERS.forEach(c => figure.classList.toggle(c, c === character));
    hero.src = ART[character];
    updateCharacterLayout();
  }
  if (SPEEDS[speed]) { root.style.setProperty('--swing-duration', SPEEDS[speed]); swingSeconds = parseFloat(SPEEDS[speed]); }
  if (Number.isFinite(scale)) { uiScale = scale; root.style.setProperty('--scale', scale); }
  if (typeof soundEnabled === 'boolean') {
    sfx.enabled = soundEnabled;
    if (!soundEnabled) sfx.stopTension();
  }
  chat.ai = hasGeminiKey === true;                 // the optional smart chat is available
  applyCompanionSettings({ language, bubblesEnabled, userName, userGender, adultMode, userAge, userRelationship, userStatus });
  if (birthday && !birthdayGreeted) { birthdayGreeted = true; setTimeout(() => say('birthday'), 9000); }   // once per launch, on the user's birthday
  applyPlacement(placementMode, anchorState || (pivot && { top: pivot, dock: pivot }), freeState);
  document.body.classList.add('ready');
});

// ---------- Sound effects (Web Audio, fully synthesised) ----------
const sfxLog = (...a) => console.log('[sfx]', ...a);

const sfx = {
  enabled: true,            // overwritten by the saved `soundEnabled` setting (default true)
  ctx: null,
  master: null,
  noise: null,
  tension: null,
  fallback: {},

  // Build the audio graph once and keep it warm. The context is created lazily (on hover or the
  // first press) and resumed on mousedown, so autoplay rules never block it.
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' }); }
      catch (err) { sfxLog('AudioContext unavailable, using sample fallback', err); return false; }
      const c = this.ctx;
      const comp = c.createDynamicsCompressor();       // glues the layers together for a punchier hit
      comp.threshold.value = -16; comp.knee.value = 8; comp.ratio.value = 6;
      comp.attack.value = 0.002; comp.release.value = 0.12;
      this.master = c.createGain(); this.master.gain.value = 0.9;
      this.master.connect(comp); comp.connect(c.destination);   // sources -> gain -> master -> destination
      const len = Math.floor(c.sampleRate * 0.5);
      this.noise = c.createBuffer(1, len, c.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      c.onstatechange = () => sfxLog('AudioContext state ->', c.state);
      sfxLog('AudioContext created, state:', c.state);
    }
    return true;
  },

  // Called on mousedown: resume if suspended and push a silent sample through so the output
  // device is already awake when the first real sound fires.
  warm() {
    if (!this.ensure()) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const s = this.ctx.createBufferSource();
    s.buffer = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
    s.connect(this.master); s.start();
    sfxLog('warm, state:', this.ctx.state, 'enabled:', this.enabled);
  },

  // True when the Web Audio path can actually be heard right now.
  live() {
    if (!this.ensure()) return false;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx.state === 'running';
  },

  // Pre-recorded fallback (assets/sfx/*.wav) for when the context cannot run.
  sample(name, volume = 1) {
    let a = this.fallback[name];
    if (!a) { a = this.fallback[name] = new Audio(`assets/sfx/${name}.wav`); a.preload = 'auto'; }
    const shot = a.cloneNode();
    shot.volume = Math.max(0, Math.min(1, volume));
    shot.play().catch(err => sfxLog('fallback sample blocked:', err.message));
  },

  // Creaking rubber: two detuned oscillators through a low-pass, with a wobbling amplitude.
  startTension() {
    if (!this.enabled || !this.live() || this.tension) return;
    const c = this.ctx, t0 = c.currentTime;
    const out = c.createGain();   out.gain.value = 0;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 6;
    const a = c.createOscillator(); a.type = 'sawtooth';
    const b = c.createOscillator(); b.type = 'triangle';
    const wob = c.createOscillator(); wob.frequency.value = 9;        // creak rate
    const wobDepth = c.createGain(); wobDepth.gain.value = 0.4;
    const am = c.createGain(); am.gain.value = 0.6;
    wob.connect(wobDepth); wobDepth.connect(am.gain);                  // gain = 0.6 + 0.4*lfo
    a.connect(am); b.connect(am); am.connect(lp); lp.connect(out); out.connect(this.master);
    [a, b, wob].forEach(o => o.start(t0));
    this.tension = { out, lp, a, b, wob };
    sfxLog('Playing stretch SFX', c.state);
  },

  // stretch is how far the rope is pulled (px); more pull = higher pitch and louder.
  setTension(stretchPx) {
    if (!this.enabled) return;
    if (!this.tension) this.startTension();
    const T = this.tension;
    if (!T) return;
    const t = 1 - Math.exp(-Math.max(0, stretchPx) / 350);            // 0..1, never hard-capped
    const now = this.ctx.currentTime;
    const f = 70 + 520 * t;
    T.a.frequency.setTargetAtTime(f, now, 0.04);
    T.b.frequency.setTargetAtTime(f * 2.01, now, 0.04);
    T.lp.frequency.setTargetAtTime(500 + 2200 * t, now, 0.05);
    T.wob.frequency.setTargetAtTime(7 + 14 * t, now, 0.1);
    T.out.gain.setTargetAtTime(stretchPx < 6 ? 0 : 0.03 + 0.07 * t, now, 0.05);
  },

  stopTension() {
    const T = this.tension;
    if (!T) return;
    this.tension = null;
    const now = this.ctx.currentTime;
    T.out.gain.cancelScheduledValues(now);
    T.out.gain.setTargetAtTime(0, now, 0.012);
    setTimeout(() => [T.a, T.b, T.wob].forEach(o => { try { o.stop(); } catch (_) {} }), 120);
  },

  // A crisp, subtle "pop" every time a speech bubble appears: a quick rising blip plus a tiny tick.
  pop() {
    if (!this.enabled) return;
    if (!this.live()) { this.sample('pop', 0.45); return; }
    sfxLog('Playing bubble pop', this.ctx.state);
    const c = this.ctx, now = c.currentTime;
    const o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(520, now);
    o.frequency.exponentialRampToValueAtTime(980, now + 0.06);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.32, now + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    o.connect(g); g.connect(this.master); o.start(now); o.stop(now + 0.14);
    const n = c.createBufferSource(); n.buffer = this.noise;
    const hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 3200; hp.Q.value = 1.2;
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.1, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    n.connect(hp); hp.connect(ng); ng.connect(this.master); n.start(now); n.stop(now + 0.04);
  },

  // Moment 1 — the instant of release: a quick rising whoosh as he is flung upward.
  release(strength = 0.5) {
    if (!this.enabled) { sfxLog('release SFX skipped (sound disabled)'); return; }
    const vol = 0.3 + 0.5 * strength;
    if (!this.live()) { sfxLog('Playing release SFX via fallback, state:', this.ctx && this.ctx.state); this.sample('release', vol); return; }
    sfxLog('Playing release SFX', this.ctx.state);
    const c = this.ctx, now = c.currentTime;

    const osc = c.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);
    const og = c.createGain();
    og.gain.setValueAtTime(0.0001, now);
    og.gain.linearRampToValueAtTime(vol * 0.45, now + 0.008);
    og.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(og); og.connect(this.master); osc.start(now); osc.stop(now + 0.14);

    const n = c.createBufferSource(); n.buffer = this.noise;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(500, now);
    bp.frequency.exponentialRampToValueAtTime(3600, now + 0.15);   // sweeps upward with the motion
    const ng = c.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.linearRampToValueAtTime(vol * 0.5, now + 0.01);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    n.connect(bp); bp.connect(ng); ng.connect(this.master); n.start(now); n.stop(now + 0.22);
  },

  // Moment 2 — peak rebound, fired by the physics at the exact frame he reaches the top.
  // A low thud (body), a rubber slap (tension snapping taut) and a short elastic "boing" tail.
  impact(strength = 0.6) {
    if (!this.enabled) { sfxLog('impact SFX skipped (sound disabled)'); return; }
    const s = Math.max(0.15, Math.min(1, strength));
    if (!this.live()) { sfxLog('Playing impact SFX via fallback, state:', this.ctx && this.ctx.state); this.sample('impact', s); return; }
    sfxLog('Playing impact SFX', this.ctx.state, 'strength', s.toFixed(2));
    const c = this.ctx, now = c.currentTime;

    const thud = c.createOscillator(); thud.type = 'sine';
    thud.frequency.setValueAtTime(170, now);
    thud.frequency.exponentialRampToValueAtTime(42, now + 0.2);
    const tg = c.createGain();
    tg.gain.setValueAtTime(1.0 * s, now);
    tg.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    thud.connect(tg); tg.connect(this.master); thud.start(now); thud.stop(now + 0.3);

    const body = c.createBufferSource(); body.buffer = this.noise;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 520;
    const bg = c.createGain();
    bg.gain.setValueAtTime(0.7 * s, now);
    bg.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    body.connect(lp); lp.connect(bg); bg.connect(this.master); body.start(now); body.stop(now + 0.09);

    const slap = c.createBufferSource(); slap.buffer = this.noise;
    const hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 2600; hp.Q.value = 0.9;
    const sg = c.createGain();
    sg.gain.setValueAtTime(0.55 * s, now);
    sg.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    slap.connect(hp); hp.connect(sg); sg.connect(this.master); slap.start(now); slap.stop(now + 0.07);

    const boing = c.createOscillator(); boing.type = 'triangle';
    boing.frequency.setValueAtTime(760, now);
    boing.frequency.exponentialRampToValueAtTime(330, now + 0.28);
    const lfo = c.createOscillator(); lfo.frequency.value = 26;
    const lfoAmt = c.createGain(); lfoAmt.gain.value = 40;
    lfo.connect(lfoAmt); lfoAmt.connect(boing.frequency);
    const boG = c.createGain();
    boG.gain.setValueAtTime(0.22 * s, now);
    boG.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    boing.connect(boG); boG.connect(this.master);
    boing.start(now); lfo.start(now); boing.stop(now + 0.32); lfo.stop(now + 0.32);
  }
};

// ---------- Companion: speech bubbles & reminders ----------
// Text comes from the locales files in the language chosen in the dashboard (settings.language). Every bubble
// appears with a soft "pop" sound; there is no text-to-speech.
const bubbleEl = document.getElementById('bubble');
const bubbleTextEl = document.getElementById('bubbleText');
const companion = {
  language: 'manglish', bubbles: true, adult: false, name: '', gender: 'male',
  age: null, relationship: 'single', status: 'working', ready: false
};

const formatTime = d => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });   // "3:00 PM"

// ----- non-repeating lines -----
// Each pool of lines is dealt like a shuffled deck: a line is not shown again until every other line in
// the pool has been, and the first line of a fresh shuffle is never the one just shown.
const decks = new Map();
function nextFrom(poolId, items) {
  if (!items || !items.length) return '';
  let deck = decks.get(poolId);
  if (!deck || deck.size !== items.length) { deck = { order: [], size: items.length, last: -1 }; decks.set(poolId, deck); }
  if (!deck.order.length) {
    const idx = items.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    if (idx.length > 1 && idx[0] === deck.last) [idx[0], idx[idx.length - 1]] = [idx[idx.length - 1], idx[0]];
    deck.order = idx;
  }
  const i = deck.order.shift();
  deck.last = i;
  return items[i];
}

function applyCompanionSettings({ language, bubblesEnabled, userName, userGender, adultMode, userAge, userRelationship, userStatus }) {
  const langChanged = typeof language === 'string' && language !== companion.language && companion.ready;
  const nameChanged = typeof userName === 'string' && userName !== companion.name && companion.ready;
  if (typeof language === 'string' && LOCALES[language]) companion.language = language;
  const bubblesWereOn = companion.bubbles;
  if (typeof bubblesEnabled === 'boolean') companion.bubbles = bubblesEnabled;
  if (typeof userName === 'string') companion.name = userName;
  if (typeof userGender === 'string') companion.gender = userGender;
  if (typeof adultMode === 'boolean') companion.adult = adultMode;
  if (userAge === null || Number.isInteger(userAge)) companion.age = userAge;
  if (typeof userRelationship === 'string') companion.relationship = userRelationship;
  if (typeof userStatus === 'string') companion.status = userStatus;
  if (bubblesWereOn && !companion.bubbles) hideBubble();   // only when switched off, so task alerts survive state updates
  if (langChanged) say('quip', { force: true });            // confirm a language change in the new language
  else if (nameChanged && companion.name) say('greet', { force: true });   // and a new name with a hello
  if (!companion.ready) setTimeout(() => say('greet'), 2500);              // hello once at launch
  companion.ready = true;
}

// Gender-aware forms of address for the three languages with hand-written slang:
//   {addr} a friendly noun ("machane" / "mole"), {eda} an informal call ("Eda" / "Edi").
const ADDR = {
  english:   { male: 'bro', female: 'sis', other: 'friend' },
  manglish:  { male: 'machane', female: 'mole', other: 'kootukaara' },
  malayalam: { male: 'മച്ചാനേ', female: 'മോളേ', other: 'കൂട്ടുകാരേ' }
};
const EDA = {
  english:   { male: 'Hey', female: 'Hey', other: 'Hey' },
  manglish:  { male: 'Eda', female: 'Edi', other: 'Eda' },
  malayalam: { male: 'എടാ', female: 'എടീ', other: 'എടാ' }
};

// Placeholders: {name} the user's name, {addr}/{eda} by gender, {time}, {task}. An empty value drops its
// placeholder and tidies the punctuation: "Hey {name}, ..." -> "Hey, ...", "..., {name}!" -> "...!".
function fill(text, task = '') {
  const time = formatTime(new Date());
  const lang = companion.language, g = companion.gender;
  const values = {
    name: companion.name,
    addr: (ADDR[lang] && ADDR[lang][g]) || '',
    eda: (EDA[lang] && EDA[lang][g]) || '',
    time, task
  };
  let out = text;
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp(`\\{${key}\\}`, 'g');
    out = value ? out.replace(re, () => value) : out.replace(new RegExp(`\\s*\\{${key}\\}`, 'g'), '');
  }
  out = out
    .replace(/\s+([,!?.।])/g, '$1')
    .replace(/,\s*([!?.।])/g, '$1')
    .replace(/^[\s,]+/, '')
    .trim();
  return out.charAt(0).toUpperCase() + out.slice(1);       // no effect on Indic scripts
}

// Lines are stored per gender; 'other' is the neutral fallback.
function linesFor(group) {
  return group[companion.gender] || group.other;
}

// Jokes and nudges built from the user's profile: relationship status and what they do all day.
// `group` is 'status' or 'relationship'; with 18+ mode on, the raw lines join the clean ones.
function profileLine(set, group) {
  const key = group === 'status' ? companion.status : companion.relationship;
  const clean = set.profile && set.profile[group] && set.profile[group][key];
  const spicy = companion.adult && set.profileAdult && set.profileAdult[group] && set.profileAdult[group][key];
  if (!clean && !spicy) return null;              // languages without a clean set only speak up in 18+ mode
  const id = `pf:${companion.language}:${group}:${key}`;
  return fill(spicy && (!clean || Math.random() < 0.6) ? nextFrom(`${id}:adult`, spicy) : nextFrom(id, clean));
}

// Birthday greeting: once per app launch on the user's birthday.
let birthdayGreeted = false;

function lineFor(kind, task = '') {
  const lang = companion.language;
  const set = LOCALES[lang] || LOCALES.manglish;
  if (kind === 'task') return fill(nextFrom(`task:${lang}`, set.task || LOCALES.english.task), task);
  if (kind === 'quip') {
    // roughly: a quarter about what they do all day, a quarter about their love life, the rest the hero's own lines
    const roll = Math.random();
    const personal = roll < 0.27 ? profileLine(set, 'status') : roll < 0.52 ? profileLine(set, 'relationship') : null;
    if (personal) return personal;
    const heroLines = set.quips[current] || set.quips.generic || set.quips.spiderman;
    if (companion.adult && set.adult && set.adult[current] && Math.random() < 0.6) {
      return fill(nextFrom(`adult:${lang}:${current}`, set.adult[current]));      // 18+: the cheeky and raw hero lines
    }
    return fill(nextFrom(`q:${lang}:${current}:${companion.gender}`, linesFor(heroLines)));
  }
  const group = set[kind] || (LOCALES.english && LOCALES.english[kind]);
  if (!group) return '';
  return fill(nextFrom(`${kind}:${lang}:${companion.gender}`, linesFor(group)));
}

let bubbleTimer = null;
let bubbleKind = null;          // kind currently on screen, or null
const bubbleQueue = [];         // reminders that arrived while another bubble was showing

function hideBubble() {
  clearTimeout(bubbleTimer);
  bubbleEl.classList.remove('show');
  bubbleKind = null;
  bubbleQueue.length = 0;
}

function showBubble(text, kind) {
  clearTimeout(bubbleTimer);
  bubbleTextEl.textContent = text;
  bubbleEl.classList.add('show');
  bubbleKind = kind;
  sfx.pop();                                                    // the only sound a speaking character makes
  const min = kind === 'task' ? 8000 : 4000;                    // task alerts stay up a bit longer
  const ms = Math.min(12000, Math.max(min, 3200 + text.length * 70));
  bubbleTimer = setTimeout(() => {
    bubbleEl.classList.remove('show');
    bubbleKind = null;
    const next = bubbleQueue.shift();
    if (next) setTimeout(() => say(next.kind, { task: next.task, always: next.always }), 700);
  }, ms);
}

// kind: 'water' | 'rest' | 'time' | 'greet' | 'task' | 'quip'. Reminders outrank quips.
//   force  : show even if bubbles are switched off, and replace whatever is on screen (dashboard previews)
//   always : show even if bubbles are switched off, but wait politely behind other reminders (task alerts)
function say(kind, { force = false, always = false, task = '' } = {}) {
  if (chat.open && !force) return;                               // a conversation is in progress
  if (!force && !always && !companion.bubbles) return;
  const reminder = kind !== 'quip';
  if (bubbleKind && !force) {
    if (!reminder) return;                                       // never interrupt for a quip
    if (bubbleKind !== 'quip') { bubbleQueue.push({ kind, task, always }); return; }   // wait behind another reminder
  }
  showBubble(lineFor(kind, task), kind);
}


// ----- Double-click chat -----
// Double-click the hero: "Want to talk? (Press Enter)". Enter: an open question and a text field. Typing and Enter:
// a reply in the hero's own voice and the user's language, comforting if the user sounds low. All the text is in
// src/data/chatDialogues.js. The bubble closes after 8 s without activity (12 s after a comforting reply), on Escape,
// or when the window loses focus (a click elsewhere).
const chatEl = document.getElementById('chat');
const chatTextEl = document.getElementById('chatText');
const chatInputEl = document.getElementById('chatInput');
const chat = { open: false, step: 'closed', timer: null, openedAt: 0, holdMs: 8000, used: {}, afterEmotional: false, localTurns: 0,
               ai: false, busy: false, seq: 0, history: [] };     // ai: Gemini key set; busy: waiting for a reply; history: recent messages
const CHAT_HEROES = ['deadpool', 'spiderman', 'zoro', 'kakashi', 'luffy'];
const CHAT_IDLE_MS = 8000, CHAT_COMFORT_MS = 12000;

const chatLang = () => (CHAT_UI[companion.language] ? companion.language : 'english');
const chatHero = () => (CHAT_HEROES.includes(current) ? current : 'spiderman');     // everyone else comforts like Spider-Man
const chatMatch = (text, words) => words.some(w => (/^[a-z]/.test(w)
  ? new RegExp(`(^|[^a-z])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^a-z])`).test(text)
  : text.includes(w)));

// 'emotional' (sad, lonely, hopeless, or a negated "not happy") beats 'stressed', which beats 'happy'.
function chatMood(raw) {
  const t = raw.toLowerCase();
  if (chatMatch(t, CHAT_KEYWORDS.emotional)) return 'emotional';
  const happy = chatMatch(t, CHAT_KEYWORDS.happy);
  if (happy && (chatMatch(t, CHAT_NEGATIONS) || t.includes("n't"))) return 'emotional';
  if (chatMatch(t, CHAT_KEYWORDS.stressed)) return 'stressed';
  return happy ? 'happy' : 'neutral';
}

// Lines already used in this conversation are remembered, so nothing repeats until every option has been heard.
// `first` is the hero's own set, `more` the shared extras; the hero's own lines are used up before the extras.
function chatPick(key, first, more = []) {
  const used = chat.used[key] || (chat.used[key] = []);
  let pool = first.filter(x => !used.includes(x));
  if (!pool.length) pool = more.filter(x => !used.includes(x));
  if (!pool.length) {                                    // heard everything: start over, but never repeat the last one
    const last = used[used.length - 1];
    used.length = 0;
    pool = first.concat(more).filter(x => x !== last);
    if (!pool.length) pool = first.concat(more);
  }
  const line = pool[Math.floor(Math.random() * pool.length)];
  used.push(line);
  return line;
}

function chatReply(raw) {
  const lang = chatLang(), hero = chatHero(), mood = chatMood(raw);
  const key = m => `${lang}:${hero}:${m}`;
  const L = (table, l = lang) => table[l] || table.english;
  const heroMood = m => { const all = L(CHAT_REPLIES)[hero]; const at = { happy: 0, stressed: 4, neutral: 6 }[m]; return all.slice(at, at + 2); };
  const moodLine = m => chatPick(key(m), heroMood(m), m === 'stressed' ? L(CHAT_GENTLE) : L(CHAT_TALK));
  let text, emotional = false;
  if (mood === 'emotional') {
    text = chatPick(key('emotional'), L(CHAT_COMFORT)[hero], L(CHAT_GENTLE));
    emotional = true;
  } else if (chat.afterEmotional) {
    // the turn after comforting: ask how they feel now, then answer what they said
    text = chatPick(`${lang}:checkin`, L(CHAT_CHECKIN));
    if (mood !== 'neutral') text += '\n' + moodLine(mood);
  } else {
    text = moodLine(mood);
  }
  chat.afterEmotional = emotional;
  return { text: fill(text), emotional, cue: fill(chatPick(`${lang}:cue`, L(CHAT_FOLLOWUPS))) };
}

function armChatTimer(ms) {
  clearTimeout(chat.timer);
  chat.timer = setTimeout(closeChat, ms);
}

function openChat() {
  if (chat.open) return;
  hideBubble();
  chat.open = true; chat.step = 'invite'; chat.holdMs = CHAT_IDLE_MS;
  chat.used = {}; chat.afterEmotional = false; chat.history = []; chat.localTurns = 0; chat.busy = false;                       // a fresh conversation starts with a clean history
  chat.openedAt = performance.now();
  chatTextEl.textContent = CHAT_UI[chatLang()].trigger;
  chatEl.classList.remove('asking');
  chatEl.classList.add('show');
  sfx.pop();
  window.pet.chatFocus(true);                        // lets the overlay receive keystrokes
  armChatTimer(CHAT_IDLE_MS);
}

function chatAsk() {
  chat.step = 'ask';
  chatTextEl.textContent = fill(nextFrom(`chats:${chatLang()}`, CHAT_STARTERS[chatLang()]));
  chatInputEl.value = '';
  chatInputEl.placeholder = CHAT_UI[chatLang()].placeholder;
  chatEl.classList.add('asking');
  setTimeout(() => chatInputEl.focus(), 30);
  sfx.pop();
  armChatTimer(CHAT_IDLE_MS);
}

// Without a Gemini key the local lines answer, and the conversation is two messages long: right under the 2nd reply the
// hero says, warmly, that they would love to talk properly and that the free key can be added in Settings any time,
// and then the bubble winds down by itself. With a key set (even if the smart reply fails) there is no limit and no nudge.
// A comforting reply never ends the chat; the wish waits for the next ordinary reply.
const CHAT_LOCAL_LIMIT = 2, CHAT_FAREWELL_MS = 14000;
function keyNudge() {
  const lang = chatLang(), hero = chatHero();
  const lines = (CHAT_KEYNUDGE[lang] || CHAT_KEYNUDGE.english)[hero];
  return '\n' + fill(chatPick(`${lang}:${hero}:keynudge`, lines));
}

// Smart chat (Gemini) when a key is set and the reply arrives; otherwise the local lines in chatDialogues.js answer.
// While waiting, the bubble shows a pulsing "…" and the idle timer is paused.
async function chatSend() {
  const raw = chatInputEl.value.trim();
  if (!raw || chat.busy) return;
  const seq = ++chat.seq;
  let reply = null;
  chatInputEl.value = '';
  if (chat.ai) {
    chat.busy = true;
    clearTimeout(chat.timer);
    chatEl.classList.add('thinking');
    chatTextEl.textContent = '…';
    try {
      // never wait forever: after 20 s the built-in lines answer instead
      const text = await Promise.race([
        window.pet.askAI({ hero: chatHero(), lang: chatLang(), text: raw, history: chat.history.slice(-4) }),
        new Promise(resolve => setTimeout(() => resolve(null), 20000))
      ]);
      if (text) reply = { text, emotional: chatMood(raw) === 'emotional', cue: fill(chatPick(`${chatLang()}:cue`, (CHAT_FOLLOWUPS[chatLang()] || CHAT_FOLLOWUPS.english))) };
    } catch (_) { /* fall back to the local lines */ }
    if (seq !== chat.seq || !chat.open) return;              // closed or restarted while waiting
    chat.busy = false;
    chatEl.classList.remove('thinking');
  }
  let farewell = false;
  if (!reply) {
    reply = chatReply(raw);
    chat.localTurns++;
    if (!chat.ai && chat.localTurns >= CHAT_LOCAL_LIMIT && !reply.emotional) {
      reply.text += keyNudge();                                // friendly nudge, right below the hero's answer
      farewell = true;
    }
  }
  chat.history.push({ role: 'user', text: raw }, { role: 'model', text: reply.text });
  if (chat.history.length > 8) chat.history.splice(0, chat.history.length - 8);
  chat.step = 'reply';
  chat.holdMs = reply.emotional ? CHAT_COMFORT_MS : CHAT_IDLE_MS;   // comforting words stay up a little longer
  chatTextEl.textContent = reply.text;
  sfx.pop();
  if (farewell) {                                                   // finish gracefully: no more input, the bubble lingers, then closes
    chat.step = 'done';
    chatEl.classList.remove('asking');
    chatInputEl.blur();
    armChatTimer(CHAT_FAREWELL_MS);
    return;
  }
  chatInputEl.placeholder = reply.cue;                              // the follow-up cue waits in the box
  setTimeout(() => chatInputEl.focus(), 30);                        // ready for the next message, no click needed
  armChatTimer(chat.holdMs);
}

function closeChat() {
  if (!chat.open) return;
  clearTimeout(chat.timer);
  chat.open = false; chat.step = 'closed'; chat.seq++; chat.busy = false;
  chatEl.classList.remove('show', 'asking', 'thinking');
  chatInputEl.blur(); chatInputEl.value = '';
  window.pet.chatFocus(false);
  window.pet.setInteractive(hovering);
}

document.addEventListener('keydown', e => {
  if (!chat.open) return;
  if (e.key === 'Escape') { closeChat(); return; }
  if (e.key === 'Enter') {
    e.preventDefault();
    if (chat.step === 'invite') chatAsk();
    else if (document.activeElement === chatInputEl) chatSend();
  }
});
chatInputEl.addEventListener('input', () => { if (!chat.busy) armChatTimer(chat.holdMs); });          // typing keeps the chat open
window.addEventListener('blur', () => { if (chat.open && performance.now() - chat.openedAt > 900) closeChat(); });

// The overlay is click-through, so the bubble only takes the mouse while the pointer is over it.
let chatHover = false;
chatEl.addEventListener('mouseenter', () => { chatHover = true; window.pet.setInteractive(true); });
chatEl.addEventListener('mouseleave', () => { chatHover = false; if (!hovering && !drag && !perchDrag) window.pet.setInteractive(false); });
setInterval(() => { if (chat.open && chatHover) window.pet.setInteractive(true); }, 500);

// Two clicks within 380 ms open the chat; a single click still makes the hero perform a move.
const DOUBLE_CLICK_MS = 500;                                    // Windows' default double-click time (macOS feels fine with it too)
let lastHeroClick = 0;
function onHeroClick() {
  const now = performance.now();
  if (now - lastHeroClick < DOUBLE_CLICK_MS) { lastHeroClick = 0; openChat(); return; }
  lastHeroClick = now;
  performMove();
}

// ----- Reminders -----
const WATER_EVERY = 45 * 60 * 1000;
const REST_EVERY = 60 * 60 * 1000;
const hourKey = d => `${d.toDateString()} ${d.getHours()}`;
let nextWater = Date.now() + WATER_EVERY;
let nextRest = Date.now() + REST_EVERY + 7 * 60 * 1000;   // offset so the two rarely land together
let lastChime = hourKey(new Date());                      // no chime at launch, only on the next hour

setInterval(() => {
  const now = new Date();
  if (now.getMinutes() === 0 && hourKey(now) !== lastChime) { lastChime = hourKey(now); say('time'); }
  if (Date.now() >= nextWater) { nextWater = Date.now() + WATER_EVERY; say('water'); }
  if (Date.now() >= nextRest) { nextRest = Date.now() + REST_EVERY; say('rest'); }
}, 15000);

// Hero chatter every few minutes (skipped when something else is on screen).
(function scheduleQuip() {
  setTimeout(() => { say('quip'); scheduleQuip(); }, (4 + Math.random() * 5) * 60 * 1000);
})();

window.pet.onSay(kind => say(kind, { force: true, task: kind === 'task' ? 'Sample task' : '' }));

// A task came due: announce it in the chosen language (the bubble pops in with its sound).
window.pet.onTaskDue(({ title }) => {
  sfx.ensure();
  say('task', { always: true, task: String(title || '') });
});

// ---------- Pendulum, elastic web & snap-back ----------
// Coordinates are in unscaled px relative to the rope anchor (the pivot), +x right, +y down.
// Three layers of motion share one simulation style:
//   idle   : a self-sustaining, lightly damped pendulum (van der Pol) with a lagging body, nudged by the cursor
//   drag   : the web is a stretchable spring and the hand holds him through a second spring, so he trails
//            the cursor and the harder you pull the more the web (and he) stretches
//   release: the same springs keep running, so he overshoots and rings down before sliding back into idle
const DRAG_THRESHOLD = 6;   // px of movement that turns a click into a drag
const GRAVITY = 700;        // px/s^2 pulling the body down
const SPRING_K = 150;       // web stiffness
const RUBBER_X = 450;       // px of stretch where the web starts to stiffen: F = K x (1 + (x / RUBBER_X)^2)
const SLACK_K = 0.2;        // fraction of SPRING_K that resists the web being compressed
const RADIAL_DAMP = 4;      // damping along the web: low, so the rebound rings several times
const AIR_DAMP = 0.9;       // overall drag: low, so the swing carries on gracefully
const MAX_FORCE = 30000;    // px/s^2 cap, so a huge pull snaps back hard but never explodes
const HOLD_K = 700;         // how firmly the hand holds him while dragging (~26 rad/s)
const HOLD_C = 46;          // damping of that hold (just under critical: a hint of overshoot)
const THREAD_BASE = { spiderman: 1.6, robobuddy: 1.8, deadpool: 1.8, alien: 1.8, zoro: 1.8, ninjazen: 1.8, ninjakid: 1.8, hulk: 1.8, hoodbot: 1.8, bigears: 1.8, kakashi: 1.8, laptopguy: 1.8, neonscout: 1.8, luffy: 1.8 };
const SWING_REST_AMP = 22;  // deg: amplitude the idle swing settles into

// idle pendulum
const IDLE_MU = 0.5;        // how strongly the swing sustains itself (x natural frequency)
const LAG_K = 42;           // body-lag spring: the body swings a little behind the rope...
const LAG_C = 3.2;          // ...and rings gently (low damping)
const LAG_GAIN = 0.5;       // how much of the rope's acceleration the body feels
const LAG_MAX = 0.16;       // rad, limit of the lag
const WIND_REACH = 260;     // px: a moving cursor this close nudges the swing
const WIND_PUSH = 0.00004;  // rad/s of push per px/s of cursor speed, per mouse event

let drag = null;            // active pointer gesture
let sim = null;             // spring simulation (while dragging and after release)
let hovering = false;
let leaveTimer = null;
let swingSeconds = 3;       // period of the idle swing (set by the speed setting)

const anchor = () => { const r = pivotEl.getBoundingClientRect(); return { x: r.left, y: r.top }; };
const toLocal = (cx, cy) => { const p = anchor(); return { x: (cx - p.x) / uiScale, y: (cy - p.y) / uiScale }; };
const springEl = figure.querySelector('.spring');
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// y is the stretch along the figure's axis in px; vr is its speed (px/s) for squash & stretch.
// While held, the figure also lengthens along the pull (a visible tension cue) and the web thins.
function applyPull(y, vr = 0, holding = false) {
  let sy;
  if (holding) sy = 1 + Math.min(Math.max(y, 0) / 700, 0.16);
  else sy = 1 + Math.min(Math.abs(vr) / 2600, 0.16) - Math.max(0, -y) * 0.0025;
  const sx = 1 / Math.sqrt(sy);
  pull.style.transform = `translateY(${y}px) scale(${sx}, ${sy})`;
  const base = THREAD_BASE[current] || 2;
  thread.style.height = `${Math.max(y, 0) + 4}px`;
  thread.style.setProperty('--thread-w', `${Math.max(base * (1 - Math.min(Math.max(y, 0) / 900, 0.45)), 0.8)}px`);
}

// ----- idle pendulum -----
const idle = { th: 0.1, om: 0, lag: 0, lagv: 0, last: 0, raf: 0, running: false };

// While nothing is happening the swing is redrawn at about 30 fps (half the GPU and CPU work); a hover or drag restores full rate.
const IDLE_FRAME_MS = 25;
function idleStep(now) {
  if (!idle.running) return;
  if (!hovering && !drag && now - idle.last < IDLE_FRAME_MS) { idle.raf = requestAnimationFrame(idleStep); return; }
  const dt = Math.min((now - idle.last) / 1000, 1 / 30);
  idle.last = now;
  const w0 = 2 * Math.PI / swingSeconds;
  const a = (SWING_REST_AMP * Math.PI / 180) / 2;      // van der Pol: the limit cycle is ~2a
  const mu = IDLE_MU * w0;
  const n = 2, h = dt / n;
  for (let i = 0; i < n; i++) {
    const acc = -w0 * w0 * Math.sin(idle.th) + mu * (1 - (idle.th / a) ** 2) * idle.om;
    idle.om += acc * h;
    idle.th += idle.om * h;
    // the body is a second, lighter pendulum hanging off the rope: it lags and rings at the turns
    idle.lagv += (-LAG_K * idle.lag - LAG_C * idle.lagv - LAG_GAIN * acc) * h;
    idle.lag += idle.lagv * h;
  }
  idle.lag = clamp(idle.lag, -LAG_MAX, LAG_MAX);
  figure.style.transform = `rotate(${idle.th}rad)`;
  springEl.style.rotate = `${idle.lag}rad`;
  const speed = Math.abs(idle.om) / (w0 * a * 2);        // ~1 at the bottom of a normal swing
  springEl.style.scale = `1 ${0.99 + 0.03 * Math.min(speed, 1.4)}`;   // the line tightens as he swings through
  idle.raf = requestAnimationFrame(idleStep);
}

function startIdle(th, om = 0) {
  idle.th = th; idle.om = om; idle.lag = 0; idle.lagv = 0;
  idle.last = performance.now();
  figure.classList.remove('held');
  pull.style.transform = '';
  thread.style.height = '0';
  if (!idle.running) { idle.running = true; idle.raf = requestAnimationFrame(idleStep); }
}

function stopIdle() {
  idle.running = false;
  cancelAnimationFrame(idle.raf);
  springEl.style.rotate = '';
  springEl.style.scale = '';
}

// A cursor sweeping past nudges the swing, like a draught from a passing hand.
let lastMouse = null;
document.addEventListener('mousemove', e => {
  const now = performance.now();
  if (lastMouse && idle.running) {
    const dtm = now - lastMouse.t;
    if (dtm > 0 && dtm < 80) {
      const r = heroHit.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const reach = WIND_REACH * uiScale;
      if (dist < reach) {
        const vx = clamp((e.clientX - lastMouse.x) / dtm * 1000 / uiScale, -3000, 3000);
        idle.om = clamp(idle.om - vx * WIND_PUSH * (1 - dist / reach), -4, 4);   // moving right pushes him right
      }
    }
  }
  lastMouse = { x: e.clientX, y: e.clientY, t: now };
});

// ----- spring simulation (drag + release) -----
// Rope pose for a point P on the figure's axis: rotate about the anchor to face P, stretch to reach it.
function axisPose(x, y, vb) {
  const D = Math.hypot(x, y) || 1e-6;
  return { psi: Math.atan2(y, x) - Math.PI / 2, e: Math.max(D - vb, -0.5 * vb) };
}

function stepSim(now) {
  if (!sim || sim.paused) return;
  const dt = Math.min((now - sim.last) / 1000, 1 / 30);
  sim.last = now;
  const n = Math.max(1, Math.ceil(dt / 0.004));      // small sub-steps keep the stiff springs stable
  const h = dt / n;
  const rest = sim.L0 - GRAVITY / SPRING_K;          // so the body settles exactly at its rest pose
  let hitPeak = false;
  for (let i = 0; i < n; i++) {
    const D = Math.hypot(sim.x, sim.y) || 1e-6;
    const nx = sim.x / D, ny = sim.y / D;
    let ax = -AIR_DAMP * sim.vx, ay = GRAVITY - AIR_DAMP * sim.vy;
    // Elastic web: Hooke's law that stiffens like a rubber band the further it is stretched.
    const x = D - rest;
    let f = x > 0 ? SPRING_K * x * (1 + (x / RUBBER_X) ** 2) : SPRING_K * SLACK_K * x;
    f = clamp(f, -MAX_FORCE, MAX_FORCE) + RADIAL_DAMP * (sim.vx * nx + sim.vy * ny);
    ax -= f * nx; ay -= f * ny;
    if (sim.hold) {                                  // the hand pulls through a spring of its own
      ax += HOLD_K * (sim.hold.x - sim.x) - HOLD_C * sim.vx;
      ay += HOLD_K * (sim.hold.y - sim.y) - HOLD_C * sim.vy;
    }
    sim.vx += ax * h; sim.vy += ay * h;
    sim.x += sim.vx * h; sim.y += sim.vy * h;
    if (!sim.hold) {
      // Radial speed flipping from "toward the anchor" to "away" is the top of the rebound.
      const Dn = Math.hypot(sim.x, sim.y) || 1e-6;
      const vrNow = (sim.vx * sim.x + sim.vy * sim.y) / Dn;
      if (vrNow < -40) sim.inward = true;
      if (vrNow < sim.minVr) sim.minVr = vrNow;
      if (sim.inward && vrNow >= 0) { hitPeak = true; sim.inward = false; sim.peakSpeed = -sim.minVr; }
    }
  }
  if (hitPeak) onRebound();
  const { psi, e } = axisPose(sim.x, sim.y, sim.L0);
  const D = Math.hypot(sim.x, sim.y) || 1e-6;
  const vr = (sim.vx * sim.x + sim.vy * sim.y) / D;
  const angVel = (sim.x * sim.vy - sim.y * sim.vx) / (D * D);   // rad/s
  sim.e = e;
  figure.style.transform = `rotate(${psi}rad)`;
  applyPull(e, vr, !!sim.hold);
  if (sim.hold) sfx.setTension(e);

  // Once the web has stopped bouncing, the same swing simply carries on as the idle pendulum.
  if (!sim.hold && Math.abs(e) < 1.2 && Math.abs(vr) < 40) {
    sim = null;
    startIdle(psi, angVel);
    window.pet.setInteractive(hovering);
  } else {
    sim.raf = requestAnimationFrame(stepSim);
  }
}

// Fires on the exact frame the physics reaches the top of a rebound. Because it is driven by the
// simulation, a longer pull (more distance to cover, a harder snap) naturally lands later.
function onRebound() {
  if (!sim || sim.pulled < 12) return;                // tiny tugs make no impact
  const n = sim.rebounds++;
  if (n > 2) return;
  const fall = [1, 0.45, 0.22][n];                    // each successive bounce is softer
  const speedFactor = Math.min(1, sim.peakSpeed / 3000);
  sfx.impact((0.35 + 0.65 * speedFactor) * fall);
  sim.minVr = 0; sim.peakSpeed = 0;
}

function endDrag() {
  if (!drag) return;
  const d = drag;
  drag = null;
  try { heroHit.releasePointerCapture(d.id); } catch (_) {}
  if (!d.active) {                                   // never moved far enough: it was a click
    if (sim) { sim.paused = false; sim.last = performance.now(); sim.raf = requestAnimationFrame(stepSim); }
    else onHeroClick();
    return;
  }
  // Let go: the springs keep running from where he is, with the speed he has.
  const stretch = Math.max(sim.e || 0, 0);
  sim.hold = null;
  sim.pulled = stretch;
  sim.rebounds = 0; sim.minVr = 0; sim.peakSpeed = 0; sim.inward = false;
  sfx.stopTension();
  sfx.release(Math.min(1, stretch / 400));            // instant: whoosh the moment the button comes up
}

// ---------- Placement & pose ----------
// hanging   : pendulum from the top edge, with the elastic drag (above)
// top_edge  : hanging off the lower lip of the menu bar
// dock      : sitting / standing on the top edge of the Dock / taskbar
// free_roam : perched wherever the user last dropped him
// Which of these a character supports is decided in the main process (CHAR_PLACEMENTS). Perched modes
// show the same artwork upright (upside-down art is flipped), with the web cropped away and a gentle idle.
let placement = 'hanging';
let anchors = null;                 // { top: {x,y}, dock: {x,y} } from the main process
let freeFrac = null;                // saved free-roam position, as fractions of the screen
let perchDrag = null;

// Per character: display box (px, matches --hero-w/--hero-h), how much of the box sits above the
// ledge (`up`: 1 = feet on the ledge), the flip needed to stand him upright, and the fraction of the
// box occupied by the web at the top (cropped when perched).
const LAYOUT = {
  spiderman: { w: 98,  h: 195, up: 0.58, flip: 180, line: 0.26 },
  robobuddy: { w: 111, h: 235, up: 1, flip: 0, line: 0.282 },
  deadpool: { w: 170, h: 164, up: 1, flip: 0, line: 0.204 },
  alien: { w: 95, h: 250, up: 1, flip: 0, line: 0.205 },
  zoro: { w: 111, h: 250, up: 1, flip: 0, line: 0.205 },
  ninjazen: { w: 144, h: 230, up: 1, flip: 0, line: 0.204 },
  ninjakid: { w: 144, h: 250, up: 1, flip: 0, line: 0.205 },
  hulk: { w: 120, h: 260, up: 1, flip: 0, line: 0.205 },
  hoodbot: { w: 114, h: 245, up: 1, flip: 0, line: 0.205 },
  bigears: { w: 150, h: 245, up: 1, flip: 0, line: 0.205 },
  kakashi: { w: 136, h: 250, up: 1, flip: 0, line: 0.205 },
  laptopguy: { w: 124, h: 250, up: 1, flip: 0, line: 0.205 },
  neonscout: { w: 90, h: 255, up: 1, flip: 0, line: 0.205 },
  luffy: { w: 102, h: 250, up: 1, flip: 0, line: 0.205 }
};

function updateCharacterLayout() {
  const L = LAYOUT[current];
  if (!L) return;
  figure.style.setProperty('--perch-flip', `${L.flip}deg`);
  figure.style.setProperty('--string-frac', L.line);
  updateBubbleLayout();
}

// Positions the perched figure and the speech bubble for the current mode and character.
//   top_edge        : the top of the figure touches the bar and the legs dangle over the screen
//   dock / free_roam: feet (or hips) on the ledge, body above it
function updateBubbleLayout() {
  const L = LAYOUT[current] || LAYOUT.spiderman;
  const contentTop = (L.flip ? 0 : L.line);             // where the artwork starts inside its box (web cropped)
  if (placement === 'hanging') {
    pivotEl.style.setProperty('--bubble-top', '56px');
    pivotEl.style.setProperty('--bubble-right', '112px');
    return;
  }
  const top = placement === 'top_edge' ? -contentTop * L.h : -L.h * L.up;
  figure.style.setProperty('--perch-top', `${Math.round(top)}px`);
  figure.style.setProperty('--perch-origin', placement === 'top_edge' ? `${contentTop * 100}%` : `${L.up * 100}%`);
  const headTop = placement === 'top_edge' ? 6 : -L.h * L.up + L.h * contentTop + 4;
  pivotEl.style.setProperty('--bubble-top', `${Math.round(headTop)}px`);
  pivotEl.style.setProperty('--bubble-right', `${Math.round(L.w / 2 + 18)}px`);
}

// Undo any in-progress hanging physics when the mode changes.
function stopHangingPhysics() {
  if (drag) { try { heroHit.releasePointerCapture(drag.id); } catch (_) {} drag = null; }
  if (sim) { cancelAnimationFrame(sim.raf); sim = null; }
  stopIdle();
  sfx.stopTension();
  figure.classList.remove('held');
  figure.style.transform = '';
  pull.style.transform = '';
  thread.style.height = '0';
}

function setPivot(x, y) {
  root.style.setProperty('--pivot-x', `${x}px`);
  root.style.setProperty('--pivot-y', `${y}px`);
}

function placementPoint() {
  if (!anchors) return null;
  if (placement === 'dock') return anchors.dock;
  if (placement === 'free_roam') {
    return freeFrac ? { x: freeFrac.x * window.innerWidth, y: freeFrac.y * window.innerHeight } : anchors.dock;
  }
  return anchors.top;                                   // hanging and top edge share the top anchor
}

function applyPlacement(mode, anchorState, freeState) {
  if (anchorState) anchors = anchorState;
  if (freeState) freeFrac = freeState;
  const next = ['hanging', 'top_edge', 'dock', 'free_roam'].includes(mode) ? mode : 'hanging';
  if (next !== placement) {
    stopHangingPhysics();
    placement = next;
    figure.classList.toggle('perched', next !== 'hanging');
    clearMoves();
    if (next === 'hanging') startIdle(0.12, 0);
  }
  if (!perchDrag || !perchDrag.active) {                // never yank him while he is being dragged
    const p = placementPoint();
    if (p) setPivot(p.x, p.y);
  }
  updateBubbleLayout();
}

// ----- perched interaction: a click plays a move; in free roam a drag relocates him -----
function perchedDown(e) {
  clearTimeout(leaveTimer);
  window.pet.setInteractive(true);
  try { heroHit.setPointerCapture(e.pointerId); } catch (_) {}
  const p = anchor();
  perchDrag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, px: p.x, py: p.y, active: false };
}

function perchedMove(e) {
  if (!perchDrag || e.pointerId !== perchDrag.id) return;
  const dx = e.clientX - perchDrag.x0, dy = e.clientY - perchDrag.y0;
  if (!perchDrag.active) {
    if (placement !== 'free_roam' || Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    perchDrag.active = true;
    clearMoves();
    figure.classList.add('carried');                    // a small wobble while he is carried
  }
  setPivot(clamp(perchDrag.px + dx, 20, window.innerWidth - 20), clamp(perchDrag.py + dy, 30, window.innerHeight - 4));
}

function perchedUp() {
  if (!perchDrag) return;
  const d = perchDrag;
  perchDrag = null;
  try { heroHit.releasePointerCapture(d.id); } catch (_) {}
  figure.classList.remove('carried');
  if (!d.active) { onHeroClick(); return; }              // a click
  const p = anchor();
  freeFrac = { x: p.x / window.innerWidth, y: p.y / window.innerHeight };
  window.pet.setFreePos(freeFrac);                       // remembered across restarts
}

// Stop the browser from starting its own drag/selection/context menu on the character.
for (const t of ['dragstart', 'selectstart', 'contextmenu']) {
  document.addEventListener(t, e => e.preventDefault());
}

heroHit.addEventListener('pointerdown', e => {
  e.preventDefault();
  if (e.button !== 0 || drag || perchDrag) return;
  if (placement !== 'hanging') { sfx.warm(); perchedDown(e); return; }
  clearTimeout(leaveTimer);
  window.pet.setInteractive(true);
  sfx.warm();                                       // wake the audio device now, not at release
  try { heroHit.setPointerCapture(e.pointerId); } catch (_) {}
  if (sim) { sim.paused = true; cancelAnimationFrame(sim.raf); }   // grabbing him mid-flight
  drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, active: false, off: null };
});

// Move/up are listened for on the window, not just the character: he now trails the cursor, so the
// pointer is often outside his outline mid-drag (and capture can be dropped by the browser).
window.addEventListener('pointermove', e => {
  if (placement !== 'hanging') { perchedMove(e); return; }
  if (!drag || e.pointerId !== drag.id) return;
  // Safety net for a missed mouseup (e.g. released outside every window): end the drag only when the
  // button has been reported as up for a while. Single button-less moves happen normally (the browser
  // synthesises them as the character slides under the cursor), so they are ignored.
  if (e.buttons !== 0) drag.upSince = 0;
  else if (drag.active) {
    drag.upSince = drag.upSince || performance.now();
    if (performance.now() - drag.upSince > 500) { endDrag(); return; }
  }
  const c = toLocal(e.clientX, e.clientY);
  if (!drag.active) {
    if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < DRAG_THRESHOLD) return;
    drag.active = true;
    if (sim) {
      // grabbed mid-flight: carry on from where the springs have him
      sim.paused = false; sim.last = performance.now();
      drag.off = { x: sim.x - c.x, y: sim.y - c.y };
      sim.hold = { x: c.x + drag.off.x, y: c.y + drag.off.y };
      sim.raf = requestAnimationFrame(stepSim);
    } else {
      // from the idle swing: start the springs at his current position and speed
      clearMoves();
      stopIdle();
      const psi = idle.th;
      const vtot = -c.x * Math.sin(psi) + c.y * Math.cos(psi);        // cursor's distance along his axis
      const L0 = Math.max(vtot, 20);
      const px = -L0 * Math.sin(psi), py = L0 * Math.cos(psi);
      drag.off = { x: px - c.x, y: py - c.y };                       // the point he is gripped by stays under the cursor
      sim = {
        x: px, y: py, L0,
        vx: idle.om * -L0 * Math.cos(psi), vy: idle.om * -L0 * Math.sin(psi),
        hold: { x: px, y: py }, e: 0, pulled: 0, rebounds: 0, minVr: 0, peakSpeed: 0, inward: false,
        last: performance.now(), paused: false, raf: 0
      };
      figure.classList.add('held');
      sim.raf = requestAnimationFrame(stepSim);
    }
    sfx.startTension();
  }
  sim.hold = { x: c.x + drag.off.x, y: c.y + drag.off.y };
});

window.addEventListener('pointerup', e => { if (drag && e.pointerId === drag.id) endDrag(); else if (perchDrag && e.pointerId === perchDrag.id) perchedUp(); });
window.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) endDrag(); else if (perchDrag && e.pointerId === perchDrag.id) perchedUp(); });
window.addEventListener('blur', () => { endDrag(); perchedUp(); });

// Click-through everywhere except while the pointer is over the character (or dragging).
// The overlay covers the whole screen, so while hovering we heartbeat `interactive` — the main
// process drops back to click-through by itself if the heartbeat ever stops.
// mouseenter/mouseleave are used, but on Windows a click-through window only receives forwarded mouse MOVES, and the enter/leave
// events can be missed (also when the character swings under a still cursor). So every mouse move is hit-tested as well:
// the pointer is "over" the character when the event's target is his outline, and over the chat bubble likewise.
let interactiveSentAt = 0;
function wantInteractive() {                         // tell the main process the mouse is needed, at most every 250 ms
  const now = performance.now();
  if (now - interactiveSentAt < 250) return;
  interactiveSentAt = now;
  window.pet.setInteractive(true);
}
function pointerEntered() {
  clearTimeout(leaveTimer);
  if (!hovering) { hovering = true; sfx.ensure(); }  // build the audio graph ahead of the first press
  interactiveSentAt = performance.now();
  window.pet.setInteractive(true);
}
function pointerLeft() {
  if (!hovering) return;
  hovering = false;
  clearTimeout(leaveTimer);
  if (drag || perchDrag) return;
  leaveTimer = setTimeout(() => { if (!hovering && !chatHover) window.pet.setInteractive(false); }, 80);
}
heroHit.addEventListener('mouseenter', pointerEntered);
heroHit.addEventListener('mouseleave', pointerLeft);
let chatWasHover = false;
window.addEventListener('mousemove', e => {
  const onHero = e.target === heroHit;
  const onChat = chat.open && chatEl.contains(e.target);
  chatHover = onChat;
  if (onHero) { if (!hovering) pointerEntered(); else wantInteractive(); }
  else if (hovering && !drag && !perchDrag) pointerLeft();
  if (onChat) wantInteractive();
  else if (chatWasHover && !hovering && !drag && !perchDrag) window.pet.setInteractive(false);
  chatWasHover = onChat;
}, true);
setInterval(() => { if (hovering || drag || perchDrag) window.pet.setInteractive(true); }, 500);

heroHit.addEventListener('dblclick', e => { e.preventDefault(); lastHeroClick = 0; openChat(); });   // the browser's own double-click, in case the timing above missed

// Start swinging (small push: the self-sustaining pendulum grows into its full swing by itself).
startIdle(0.12, 0);
