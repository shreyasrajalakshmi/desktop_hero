const $ = id => document.getElementById(id);

// Launch reveal: each top-level block rises in, 60 ms after the one before it (the CSS reads --i).
document.querySelectorAll('main > header, main > section, .credit-wrap, #gift').forEach((el, i) => {
  el.style.setProperty('--i', i);
  el.classList.add('reveal');
});
const cards = [...document.querySelectorAll('.char')];
const speedBtns = [...document.querySelectorAll('#speed button')];
const scaleEl = $('scale');
const switches = [...document.querySelectorAll('.switch[data-setting]')];
const languageEl = $('language');
const nameEl = $('userName');
const genderEl = $('userGender');
let profileConfigured = false;
const draft = { gemini: '', name: '', gender: null, dob: '', age: null, lang: null, rel: null, status: null, adult: false };
const placementEl = $('placement');
const PLACE_LABELS = { hanging: 'Hanging', top_edge: 'Top edge', dock: 'Dock', free_roam: 'Free roam' };
const PLACE_HINTS = {
  hanging: 'swings from the top; drag to stretch the web',
  top_edge: 'hangs off the menu bar edge',
  dock: 'sits on the Dock / taskbar',
  free_roam: 'drag him anywhere; he stays put'
};
let tasks = [];

let scaleDragging = false;

function applyTheme(t) {
  const theme = t === 'red-white' ? 'red-white' : 'red-black';
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll('#themeSwitch button').forEach(b => b.classList.toggle('on', b.dataset.theme === theme));
}
document.querySelectorAll('#themeSwitch button').forEach(b => b.addEventListener('click', () => {
  applyTheme(b.dataset.theme);
  window.dashboard.set('dashboardTheme', b.dataset.theme);
}));

function render(s) {
  applyTheme(s.dashboardTheme);
  cards.forEach(card => {
    card.classList.toggle('selected', card.dataset.id === s.character);
  });
  speedBtns.forEach(b => b.classList.toggle('on', b.dataset.speed === s.speed));

  if (!scaleDragging) scaleEl.value = s.scale;
  $('scaleOut').textContent = `${Math.round(s.scale * 100)}%`;
  fillSlider();

  // default-on settings are true unless explicitly false; 18+ mode is off unless explicitly true
  switches.forEach(sw => {
    const key = sw.dataset.setting;
    sw.setAttribute('aria-checked', String(key === 'adultMode' ? s[key] === true : s[key] !== false));
  });
  renderPlacement(s);
  if (Array.isArray(s.tasks)) { tasks = s.tasks; renderCalendar(); }
  renderProfile(s);
  renderWish(s);
  checkWishDay(s);

  // Don't overwrite the name while it's being typed.
  if (profileConfigured && document.activeElement !== nameEl && typeof s.userName === 'string') nameEl.value = s.userName;

}

cards.forEach(card => card.addEventListener('click', () => {
  window.dashboard.set('character', card.dataset.id);
}));

speedBtns.forEach(b => b.addEventListener('click', () => window.dashboard.set('speed', b.dataset.speed)));

switches.forEach(sw => sw.addEventListener('click', async () => {
  const key = sw.dataset.setting;
  if (key === 'adultMode' && !profileConfigured) {            // before activation the toggle only edits the draft
    if (!draft.adult && !(draft.age >= 18)) { flashAdultHint('Enter an age of 18 or more first to unlock 18+ mode.'); return; }
    draft.adult = !draft.adult;
    sw.setAttribute('aria-checked', String(draft.adult));
    return;
  }
  const ok = await window.dashboard.set(key, sw.getAttribute('aria-checked') !== 'true');
  if (!ok && key === 'adultMode') flashAdultHint('Enter an age of 18 or more first to unlock 18+ mode.');
}));

// Save the name shortly after typing stops, and immediately on Enter / blur.
let nameTimer = null;
const saveName = () => { clearTimeout(nameTimer); if (profileConfigured) window.dashboard.set('userName', nameEl.value); };
nameEl.addEventListener('input', () => {
  if (!profileConfigured) { draft.name = nameEl.value.trim(); updateGate(); return; }
  clearTimeout(nameTimer); nameTimer = setTimeout(saveName, 500);
});
nameEl.addEventListener('change', saveName);
nameEl.addEventListener('keydown', e => { if (e.key === 'Enter') nameEl.blur(); });

languageEl.addEventListener('change', () => {
  if (profileConfigured) window.dashboard.set('language', languageEl.value);
  else { draft.lang = languageEl.value || null; updateGate(); }
});
document.querySelectorAll('[data-say]').forEach(b => b.addEventListener('click', () => window.dashboard.say(b.dataset.say)));

// Filled-track portion of the slider
function fillSlider() {
  const pct = ((scaleEl.value - scaleEl.min) / (scaleEl.max - scaleEl.min)) * 100;
  scaleEl.style.setProperty('--fill', `${pct}%`);
}

scaleEl.addEventListener('input', () => {
  fillSlider();
  $('scaleOut').textContent = `${Math.round(scaleEl.value * 100)}%`;
  window.dashboard.set('scale', Number(scaleEl.value));
});

window.dashboard.onState(render);
window.dashboard.getState().then(s => s && render(s));

// ---------- Placement & pose (only the poses the selected character supports) ----------
function renderPlacement(s) {
  const me = (s.characters || []).find(c => c.id === s.character);
  const allowed = (me && me.placements) || ['hanging'];
  placementEl.replaceChildren(...allowed.map(id => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.place = id;
    b.textContent = PLACE_LABELS[id] || id;
    b.classList.toggle('on', id === s.placementMode);
    b.addEventListener('click', () => window.dashboard.set('placementMode', id));
    return b;
  }));
  placementEl.classList.toggle('single', allowed.length === 1);
  $('placeHint').textContent = allowed.length === 1
    ? `${me ? me.label : 'This hero'} only does this pose`
    : (PLACE_HINTS[s.placementMode] || '');
}


// ---------- User profile (also shown as a modal on first launch) ----------
const dobEl = $('userDob');
const pad = n => String(n).padStart(2, '0');
const todayIso = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
dobEl.max = todayIso();
// Age from a YYYY-MM-DD date of birth, by local calendar dates; null when invalid, in the future or out of range.
function ageFromDob(dob, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob || '')) return null;
  const [y, m, d] = dob.split('-').map(Number);
  const b = new Date(y, m - 1, d);
  if (b.getFullYear() !== y || b.getMonth() !== m - 1 || b.getDate() !== d || b > now) return null;
  let age = now.getFullYear() - y;
  if (now.getMonth() < m - 1 || (now.getMonth() === m - 1 && now.getDate() < d)) age--;
  return age >= 5 && age <= 120 ? age : null;
}
const relEl = $('userRelationship');
const statusEl = $('userStatus');
const profileCard = $('profileCard');
let modalDismissed = false;

const genderPills = [...genderEl.querySelectorAll('.pill')];
const setGenderUI = v => genderPills.forEach(p => p.setAttribute('aria-checked', String(p.dataset.value === v)));
genderPills.forEach(p => p.addEventListener('click', () => {
  setGenderUI(p.dataset.value);
  if (profileConfigured) window.dashboard.set('userGender', p.dataset.value);
  else { draft.gender = p.dataset.value; updateGate(); }
}));

function renderProfile(s) {
  profileConfigured = s.profileConfigured === true;
  showGeminiState(s.hasGeminiKey === true);
  if (profileConfigured) {
    if (document.activeElement !== dobEl) dobEl.value = s.dob || '';
    languageEl.value = s.language || '';
    setGenderUI(s.userGender);
    relEl.value = s.userRelationship || '';
    statusEl.value = s.userStatus || '';
    closeProfileModal();
  } else {
    $('adult').setAttribute('aria-checked', String(draft.adult));   // nothing is pre-filled: the form is edited as a draft
    openProfileModal();
    updateGate();
  }
  const age = profileConfigured ? s.userAge : draft.age;
  const adultOk = Number.isInteger(age) && age >= 18;
  showAge(age);
  $('adultHint').textContent = adultOk
    ? 'raw roasts, slang and swearing between friends (off = clean & family-friendly)'
    : 'needs an age of 18 or more';
}

// The hero stays asleep until every field has been entered by hand and the profile is saved.
function updateGate() {
  const missing = [];
  if (!draft.name) missing.push('Name');
  if (!draft.gender) missing.push('Gender');
  if (!Number.isInteger(draft.age)) missing.push('Date of birth');
  if (!draft.lang) missing.push('Language');
  if (!draft.rel) missing.push('Relationship status');
  if (!draft.status) missing.push('Current status');
  $('profileSave').disabled = missing.length > 0;
  const hint = $('profileMissing');
  hint.style.color = '';
  hint.textContent = missing.length ? `Still needed: ${missing.join(', ')}` : 'All set. Ready to activate.';
}

function openProfileModal() {
  profileCard.classList.add('modal');
  $('modalBackdrop').classList.remove('hidden');
  $('profileActions').classList.remove('hidden');
  $('profileIntro').classList.remove('hidden');
}

function closeProfileModal() {
  profileCard.classList.remove('modal');
  $('modalBackdrop').classList.add('hidden');
  $('profileActions').classList.add('hidden');
  $('profileIntro').classList.add('hidden');
}

$('profileSave').addEventListener('click', async () => {
  const btn = $('profileSave');
  btn.disabled = true;
  const res = await window.dashboard.saveProfile({
    userName: nameEl.value, userGender: draft.gender, dob: draft.dob, userLanguage: draft.lang,
    userRelationship: draft.rel, userStatus: draft.status, adultMode: draft.adult, geminiKey: draft.gemini
  });
  if (!res || !res.ok) {
    const hint = $('profileMissing');
    hint.textContent = (res && res.error) || 'Could not save. Check the fields and try again.';
    hint.style.color = 'var(--err)';
    updateGateKeepMessage();
  }
});
function updateGateKeepMessage() { $('profileSave').disabled = false; }

relEl.addEventListener('change', () => {
  if (profileConfigured) window.dashboard.set('userRelationship', relEl.value);
  else { draft.rel = relEl.value || null; updateGate(); }
});
statusEl.addEventListener('change', () => {
  if (profileConfigured) window.dashboard.set('userStatus', statusEl.value);
  else { draft.status = statusEl.value || null; updateGate(); }
});

function showAge(age) {
  $('ageHint').textContent = !Number.isInteger(age) ? 'needed for 18+ mode' : age >= 18 ? `age ${age} · adult` : `age ${age} · 18+ locked`;
}
dobEl.addEventListener('input', () => {
  const age = ageFromDob(dobEl.value);
  showAge(age);
  if (!profileConfigured) {
    draft.dob = age === null ? '' : dobEl.value;
    draft.age = age;
    if (!(age >= 18) && draft.adult) { draft.adult = false; $('adult').setAttribute('aria-checked', 'false'); }
    $('adultHint').textContent = age >= 18 ? 'raw roasts, slang and swearing between friends (off = clean & family-friendly)' : 'needs an age of 18 or more';
    updateGate();
  } else if (age !== null) {
    window.dashboard.set('dob', dobEl.value);
  }
});

function flashAdultHint(text) {
  const el = $('adultHint');
  el.textContent = text;
  el.style.color = 'var(--err)';
  setTimeout(() => { el.style.color = ''; }, 2500);
  dobEl.focus();
}

// ---------- To-do & calendar ----------
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const parseYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PRIO_ORDER = { high: 0, med: 1, low: 2 };
const PRIO_LABEL = { high: 'High', med: 'Medium', low: 'Low' };
const timeFmt = new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' });

const calGridEl = $('calGrid');
const taskListEl = $('taskList');
const upcomingEl = $('upcomingList');
const taskTitleEl = $('taskTitle');
const taskTimeEl = $('taskTime');
const todayStr = () => ymd(new Date());
let selectedDate = todayStr();
let calView = (() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; })();
let taskPrio = 'med';

const timeLabel = t => (t.time ? timeFmt.format(new Date(2000, 0, 1, ...t.time.split(':').map(Number))) : 'All day');

function renderCalendar() {
  $('calTitle').textContent = `${MONTHS[calView.m]} ${calView.y}`;
  const first = new Date(calView.y, calView.m, 1);
  const start = new Date(calView.y, calView.m, 1 - first.getDay());            // Sunday-first grid, 6 weeks
  const today = todayStr();
  const pendingByDate = {};
  for (const t of tasks) if (!t.done && t.date) (pendingByDate[t.date] = pendingByDate[t.date] || []).push(t);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const key = ymd(d);
    const pending = (pendingByDate[key] || []).sort((a, b) => PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority]);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day' +
      (d.getMonth() !== calView.m ? ' other' : '') + (key === today ? ' today' : '') +
      (key === selectedDate ? ' selected' : '') + (pending.length && key < today ? ' overdue' : '');
    btn.setAttribute('role', 'gridcell');
    btn.setAttribute('aria-label', `${d.toDateString()}${pending.length ? `, ${pending.length} pending` : ''}`);
    btn.setAttribute('aria-selected', String(key === selectedDate));
    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = d.getDate();
    const dots = document.createElement('span');
    dots.className = 'dots';
    pending.slice(0, 3).forEach(t => { const dot = document.createElement('i'); dot.className = `dot ${t.priority}`; dots.append(dot); });
    if (pending.length > 3) { const more = document.createElement('b'); more.textContent = `+${pending.length - 3}`; dots.append(more); }
    btn.append(num, dots);
    btn.addEventListener('click', () => {
      selectedDate = key;
      if (d.getMonth() !== calView.m) calView = { y: d.getFullYear(), m: d.getMonth() };
      renderCalendar();
    });
    cells.push(btn);
  }
  calGridEl.replaceChildren(...cells);
  renderDay();
  renderUpcoming();
}

function taskRow(t, { showDate = false } = {}) {
  const li = document.createElement('li');
  li.className = `task${t.done ? ' done' : ''}`;

  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.checked = t.done;
  cb.setAttribute('aria-label', `Mark "${t.title}" ${t.done ? 'not done' : 'done'}`);
  cb.addEventListener('change', () => window.dashboard.task('toggle', t.id));

  const main = document.createElement('div');
  main.className = 't-main';
  const title = document.createElement('span');
  title.className = 't-title';
  title.textContent = t.title;                                  // textContent: titles are never parsed as HTML
  const due = document.createElement('span');
  const late = !t.done && t.dueAt !== null && t.dueAt < Date.now();
  due.className = `t-due${late ? ' late' : ''}`;
  const when = showDate && t.date ? `${parseYmd(t.date).toLocaleDateString([], { day: 'numeric', month: 'short' })} · ` : '';
  due.textContent = `${when}${timeLabel(t)}${t.notified && !t.done ? ' · announced' : ''}`;
  main.append(title, due);

  const chip = document.createElement('span');
  chip.className = `prio-chip ${t.priority}`;
  chip.textContent = PRIO_LABEL[t.priority] || 'Medium';

  const del = document.createElement('button');
  del.type = 'button';
  del.className = 'del';
  del.textContent = '×';
  del.setAttribute('aria-label', `Delete "${t.title}"`);
  del.addEventListener('click', () => window.dashboard.task('delete', t.id));

  li.append(cb, main, chip, del);
  if (showDate && t.date) {
    main.style.cursor = 'pointer';
    main.addEventListener('click', () => {
      selectedDate = t.date;
      const d = parseYmd(t.date);
      calView = { y: d.getFullYear(), m: d.getMonth() };
      renderCalendar();
    });
  }
  return li;
}

function renderDay() {
  const d = parseYmd(selectedDate);
  const isToday = selectedDate === todayStr();
  $('dayTitle').textContent = `${isToday ? 'Today · ' : ''}${d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}`;
  const items = tasks.filter(t => t.date === selectedDate).sort((a, b) =>
    (a.done - b.done) || ((a.time || '99:99') < (b.time || '99:99') ? -1 : 1) || (PRIO_ORDER[a.priority] - PRIO_ORDER[b.priority]));
  taskListEl.replaceChildren(...items.map(t => taskRow(t)));
  $('taskEmpty').classList.toggle('hidden', items.length > 0);
  $('clearDone').classList.toggle('hidden', !tasks.some(t => t.done));
}

function renderUpcoming() {
  const today = todayStr();
  const items = tasks.filter(t => !t.done && t.date)
    .sort((a, b) => (a.date + (a.time || '24:00')).localeCompare(b.date + (b.time || '24:00')))
    .filter(t => t.date >= today || t.dueAt !== null)             // keep overdue timed tasks visible too
    .slice(0, 6);
  upcomingEl.replaceChildren(...items.map(t => taskRow(t, { showDate: true })));
  $('upcomingEmpty').classList.toggle('hidden', items.length > 0);
}

$('calPrev').addEventListener('click', () => { calView = calView.m === 0 ? { y: calView.y - 1, m: 11 } : { y: calView.y, m: calView.m - 1 }; renderCalendar(); });
$('calNext').addEventListener('click', () => { calView = calView.m === 11 ? { y: calView.y + 1, m: 0 } : { y: calView.y, m: calView.m + 1 }; renderCalendar(); });
$('calToday').addEventListener('click', () => {
  selectedDate = todayStr();
  const d = new Date();
  calView = { y: d.getFullYear(), m: d.getMonth() };
  renderCalendar();
});

document.querySelectorAll('#prio button').forEach(b => b.addEventListener('click', () => {
  taskPrio = b.dataset.prio;
  document.querySelectorAll('#prio button').forEach(x => x.classList.toggle('on', x === b));
}));

$('taskForm').addEventListener('submit', async e => {
  e.preventDefault();
  const title = taskTitleEl.value.trim();
  if (!title) { taskTitleEl.focus(); return; }
  const ok = await window.dashboard.task('add', { title, date: selectedDate, time: taskTimeEl.value || null, priority: taskPrio });
  if (ok) { taskTitleEl.value = ''; taskTitleEl.focus(); }
});

$('clearDone').addEventListener('click', () => window.dashboard.task('clear-done'));

// keep overdue marks and "today" fresh
setInterval(renderCalendar, 60000);

// ---------- Daily wish card ----------
// An uplifting note built from the profile (name, what they do, relationship) in the chosen language.
// Always family-friendly, whatever the 18+ setting says. The closing line changes with the date.
const WISHES = {
  english: {
    hi: 'Good to see you, {n}.', friend: 'friend',
    status: {
      working: "Your work is building something real. Take it one task at a time, drink some water, and remember a job is part of you, not all of you.",
      student: "Every page you study is an investment no one can take away. Keep going: a little every day beats cramming.",
      idle: "Resting is fine; drifting isn't. Pick one small thing today and finish it. Momentum starts tiny."
    },
    rel: {
      single: "Your own company is a great place to grow, so enjoy your life as it is. The right people find those busy becoming their best.",
      relationship: "Be kind to your partner today. Small gestures, like a reply or a hello, hold love together.",
      married: "Thank your family for holding the fort with you. A strong home is the quiet backbone of every big win."
    },
    close: ["Today is a fresh page. Make it count.", "You are doing better than you think.", "Small steps, every single day. You've got this."]
  },
  manglish: {
    hi: 'Hi {n}!', friend: 'suhruthe',
    status: {
      working: "Ninte joli oru valiya karyam undaakkunnu. Oro task-um onnonnaayi cheyyu, vellam kudikku, joli ninte oru bhaagam aanu, muzhuvan alla ennu orkku.",
      student: "Nee padikkunna oro pageum aarkkum edukkaan pattaatha nikshepam aanu. Dhinavum kurachu padikku, last-minute cramming-ine kaal nallathu.",
      idle: "Vishramam nallathaanu, pakshe ozhukki pokaruthu. Innu oru cheriya karyam theerthu nokku, athu mathi thudakkam aavaan."
    },
    rel: {
      single: "Ninakku ninte koode thanne nalla company aanu. Ninte jeevitham aaswadichu munnott pogu, sheriyaaya aalukal sheriyaaya samayath varum.",
      relationship: "Innu ninte partner-odu kurachu snehathode perumaaru. Oru reply, oru 'hi' polum bandham urappikkum.",
      married: "Ninte kudumbathinodu nandhi parayu. Nalla veedu aanu ellaa valiya vijayathinteyum shaanthamaaya adithara."
    },
    close: ["Innu oru puthiya page aanu. Nannaayi ezhuthu.", "Nee vicharikkunnathinekkaal nannaayi cheyyunnundu.", "Cheriya cheriya step-ukal, ellaa divasavum. Nee cheyyum!"]
  },
  malayalam: {
    hi: 'ഹായ് {n}!', friend: 'സുഹൃത്തേ',
    status: {
      working: "നിന്റെ ജോലി വലിയൊരു കാര്യം പണിതുയർത്തുകയാണ്. ഓരോ ടാസ്കും ഒന്നൊന്നായി ചെയ്യൂ, വെള്ളം കുടിക്കൂ, ജോലി നിന്റെ ഒരു ഭാഗമാണ്, മുഴുവനല്ല എന്ന് ഓർക്കൂ.",
      student: "നീ പഠിക്കുന്ന ഓരോ പേജും ആർക്കും എടുത്തുകളയാൻ പറ്റാത്ത നിക്ഷേപമാണ്. ദിവസവും കുറച്ച് പഠിക്കൂ, അവസാന നിമിഷത്തെ പരക്കംപാച്ചിലിനേക്കാൾ നല്ലത്.",
      idle: "വിശ്രമം നല്ലതാണ്, പക്ഷേ ഒഴുകി പോകരുത്. ഇന്ന് ഒരു ചെറിയ കാര്യം തീർത്തു നോക്കൂ, അത് മതി തുടക്കത്തിന്."
    },
    rel: {
      single: "നിനക്ക് നിന്റെ കൂടെ തന്നെ നല്ല കമ്പനിയാണ്. നിന്റെ ജീവിതം ആസ്വദിച്ച് മുന്നോട്ട് പോകൂ, ശരിയായ ആളുകൾ ശരിയായ സമയത്ത് വരും.",
      relationship: "ഇന്ന് പാർട്ണറോട് കുറച്ച് സ്നേഹത്തോടെ പെരുമാറൂ. ഒരു റിപ്ലൈ, ഒരു 'ഹായ്' പോലും ബന്ധം ഉറപ്പിക്കും.",
      married: "നിന്റെ കുടുംബത്തോട് നന്ദി പറയൂ. നല്ല വീടാണ് എല്ലാ വലിയ വിജയങ്ങളുടെയും ശാന്തമായ അടിത്തറ."
    },
    close: ["ഇന്ന് ഒരു പുതിയ പേജാണ്. നന്നായി എഴുതൂ.", "നീ വിചാരിക്കുന്നതിനേക്കാൾ നന്നായി ചെയ്യുന്നുണ്ട്.", "ചെറിയ ചെറിയ ചുവടുകൾ, എല്ലാ ദിവസവും. നീ ചെയ്യും!"]
  },
  hinglish: {
    hi: 'Hi {n}!', friend: 'dost',
    status: {
      working: "Tumhara kaam kuch bada bana raha hai. Ek ek task karo, paani piyo, aur yaad rakho job tumhara ek hissa hai, poori pehchaan nahi.",
      student: "Tum jo har page padhte ho wo aisa nivesh hai jo koi cheen nahi sakta. Roz thoda padho, last-minute ki bhaagdaud se behtar hai.",
      idle: "Aaram theek hai, par bahte mat jao. Aaj ek chhota kaam pura karke dekho, wahi shuruaat hai."
    },
    rel: {
      single: "Tumhari apni company bahut acchi hai. Apni zindagi ka maza lekar aage badho, sahi log sahi waqt par milte hain.",
      relationship: "Aaj apne partner ke saath thoda pyaar se pesh aao. Ek reply, ek 'hi' bhi rishta mazboot karta hai.",
      married: "Apne parivaar ko shukriya kaho. Ek achha ghar har badi jeet ki shaant neev hota hai."
    },
    close: ["Aaj ek naya page hai. Achhe se likho.", "Tum soch se bhi behtar kar rahe ho.", "Chhote chhote kadam, har din. Tum kar loge!"]
  },
  hindi: {
    hi: 'नमस्ते {n}!', friend: 'दोस्त',
    status: {
      working: "तुम्हारा काम कुछ बड़ा बना रहा है। एक-एक टास्क करो, पानी पियो, और याद रखो नौकरी तुम्हारा एक हिस्सा है, पूरी पहचान नहीं।",
      student: "तुम जो हर पन्ना पढ़ते हो वो ऐसा निवेश है जिसे कोई छीन नहीं सकता। रोज़ थोड़ा पढ़ो, आख़िरी वक़्त की भागदौड़ से बेहतर है।",
      idle: "आराम ठीक है, पर बहते मत जाओ। आज एक छोटा काम पूरा करके देखो, वही शुरुआत है।"
    },
    rel: {
      single: "तुम्हारी अपनी कंपनी बहुत अच्छी है। अपनी ज़िंदगी का मज़ा लेकर आगे बढ़ो, सही लोग सही वक़्त पर मिलते हैं।",
      relationship: "आज अपने पार्टनर के साथ थोड़ा प्यार से पेश आओ। एक रिप्लाई, एक 'हाय' भी रिश्ता मज़बूत करता है।",
      married: "अपने परिवार को शुक्रिया कहो। एक अच्छा घर हर बड़ी जीत की शांत नींव होता है।"
    },
    close: ["आज एक नया पन्ना है। अच्छे से लिखो।", "तुम सोच से भी बेहतर कर रहे हो।", "छोटे-छोटे कदम, हर दिन। तुम कर लोगे!"]
  },
  tanglish: {
    hi: 'Hi {n}!', friend: 'nanba',
    status: {
      working: "Un velai edho periya vishayatha kattudhu. Oru oru task-a senju, thanni kudi, job un oru paguthi dhaan, muzhu adaiyalam illa nu nyabagam vechiko.",
      student: "Nee padikkira ovvoru pagea yaarum edukka mudiyadha mudhalitu. Dhinamum konjam padi, last-minute ottatha vida adhu nalladhu.",
      idle: "Rest edukkuradhu paravaala, aana thaana poga koodaadhu. Innaiku oru sinna velaya mudichu paaru, adhu podhum aarambikka."
    },
    rel: {
      single: "Unakku nee dhaan nalla company. Un vaazhkaiya rasichu munnadi po, sariyaana aalga sariyaana nerathula varuvaanga.",
      relationship: "Innaiku un partner kitta konjam anbaa irunga. Oru reply, oru 'hi' kooda uravai urudhiyaakkum.",
      married: "Un kudumbathukku nandri sollu. Nalla veedu dhaan ella periya vetriyin amaidhiyaana adithalam."
    },
    close: ["Innaiku oru pudhu page. Nalla ezhudhu.", "Nee ninaikkiradha vida nalla senjuttu irukka.", "Sinna sinna step, dhinamum. Nee panniduva!"]
  },
  tamil: {
    hi: 'ஹாய் {n}!', friend: 'நண்பா',
    status: {
      working: "உன் வேலை ஏதோ பெரிய விஷயத்தைக் கட்டுகிறது. ஒவ்வொரு டாஸ்க்காக செய், தண்ணி குடி, வேலை உன்னோட ஒரு பகுதி தான், முழு அடையாளம் இல்லைன்னு நினைவு வச்சுக்க.",
      student: "நீ படிக்கிற ஒவ்வொரு பக்கமும் யாரும் எடுக்க முடியாத முதலீடு. தினமும் கொஞ்சம் படி, கடைசி நேர ஓட்டத்தை விட அது நல்லது.",
      idle: "ஓய்வு எடுக்கிறது பரவாயில்ல, ஆனா தானா போகக் கூடாது. இன்னைக்கு ஒரு சின்ன வேலையை முடிச்சுப் பாரு, அது போதும் ஆரம்பிக்க."
    },
    rel: {
      single: "உனக்கு நீயே நல்ல கம்பெனி. உன் வாழ்க்கையை ரசிச்சு முன்னாடி போ, சரியான ஆட்கள் சரியான நேரத்துல வருவாங்க.",
      relationship: "இன்னைக்கு உன் பார்ட்னர்கிட்ட கொஞ்சம் அன்பா இரு. ஒரு ரிப்ளை, ஒரு 'ஹாய்' கூட உறவை உறுதியாக்கும்.",
      married: "உன் குடும்பத்துக்கு நன்றி சொல்லு. நல்ல வீடு தான் எல்லா பெரிய வெற்றியோட அமைதியான அடித்தளம்."
    },
    close: ["இன்னைக்கு ஒரு புது பக்கம். நல்லா எழுது.", "நீ நினைக்கிறதை விட நல்லா பண்ணிட்டு இருக்க.", "சின்ன சின்ன அடி, தினமும். நீ பண்ணிடுவ!"]
  },
  kanglish: {
    hi: 'Hi {n}!', friend: 'geleya',
    status: {
      working: "Ninna kelasa yeno dodda vishaya kattuttide. Obbobba task maadu, neeru kudi, job ninna obba bhaaga, poorti gurutu alla antha gnapaka iddko.",
      student: "Nee odtiro prathi pageu yaaru tegeyalaagadha hoodike. Dinadinakke swalpa odu, kone kshanada ootakkinta adu chennagide.",
      idle: "Vishraanti tegedukolloke tondare illa, aadre thaane hogbeda. Ivattu obba chikka kelasa mugsi nodu, adu saaku shuru maadoke."
    },
    rel: {
      single: "Ninge neene olle company. Ninna jeevana aaswadisi munde hogu, sariyaada janaru sariyaada samayakke baruttare.",
      relationship: "Ivattu ninna partner jothe swalpa preetiyinda iru. Obba reply, obba 'hi' kooda sambandha gattigolisutte.",
      married: "Ninna kutumbakke dhanyavaada heli. Olleya mane yella dodda gellugala shaanta adipaya."
    },
    close: ["Ivattu hosa pageu. Chennagi baredu.", "Nee anukondiddakkinta chennagi maadtiddiya.", "Chikka chikka hejje, prathi dina. Nee maadtiya!"]
  },
  kannada: {
    hi: 'ಹಾಯ್ {n}!', friend: 'ಗೆಳೆಯಾ',
    status: {
      working: "ನಿನ್ನ ಕೆಲಸ ಏನೋ ದೊಡ್ಡದನ್ನು ಕಟ್ಟುತ್ತಿದೆ. ಒಂದೊಂದೇ ಟಾಸ್ಕ್ ಮಾಡು, ನೀರು ಕುಡಿ, ಕೆಲಸ ನಿನ್ನ ಒಂದು ಭಾಗ, ಪೂರ್ತಿ ಗುರುತಲ್ಲ ಅಂತ ನೆನಪಿಟ್ಕೋ.",
      student: "ನೀನು ಓದುವ ಪ್ರತಿ ಪುಟವೂ ಯಾರೂ ಕಸಿದುಕೊಳ್ಳಲಾಗದ ಹೂಡಿಕೆ. ದಿನವೂ ಸ್ವಲ್ಪ ಓದು, ಕೊನೆ ಕ್ಷಣದ ಓಟಕ್ಕಿಂತ ಅದು ಚೆನ್ನಾಗಿದೆ.",
      idle: "ವಿಶ್ರಾಂತಿ ತಗೊಳ್ಳೋಕೆ ತೊಂದರೆ ಇಲ್ಲ, ಆದ್ರೆ ತಾನಾಗಿ ತೇಲಿ ಹೋಗಬೇಡ. ಇವತ್ತು ಒಂದು ಚಿಕ್ಕ ಕೆಲಸ ಮುಗಿಸಿ ನೋಡು, ಅದು ಸಾಕು ಶುರು ಮಾಡೋಕೆ."
    },
    rel: {
      single: "ನಿನಗೆ ನೀನೇ ಒಳ್ಳೆಯ ಕಂಪನಿ. ನಿನ್ನ ಜೀವನ ಆಸ್ವಾದಿಸಿ ಮುಂದೆ ಹೋಗು, ಸರಿಯಾದ ಜನರು ಸರಿಯಾದ ಸಮಯಕ್ಕೆ ಬರ್ತಾರೆ.",
      relationship: "ಇವತ್ತು ನಿನ್ನ ಪಾರ್ಟ್ನರ್ ಜೊತೆ ಸ್ವಲ್ಪ ಪ್ರೀತಿಯಿಂದ ಇರು. ಒಂದು ರಿಪ್ಲೈ, ಒಂದು 'ಹಾಯ್' ಕೂಡ ಸಂಬಂಧ ಗಟ್ಟಿ ಮಾಡುತ್ತೆ.",
      married: "ನಿನ್ನ ಕುಟುಂಬಕ್ಕೆ ಧನ್ಯವಾದ ಹೇಳು. ಒಳ್ಳೆಯ ಮನೆ ಎಲ್ಲಾ ದೊಡ್ಡ ಗೆಲುವುಗಳ ಶಾಂತ ಅಡಿಪಾಯ."
    },
    close: ["ಇವತ್ತು ಹೊಸ ಪುಟ. ಚೆನ್ನಾಗಿ ಬರೆ.", "ನೀನು ಅಂದುಕೊಂಡಿದ್ದಕ್ಕಿಂತ ಚೆನ್ನಾಗಿ ಮಾಡ್ತಿದ್ದೀಯ.", "ಚಿಕ್ಕ ಚಿಕ್ಕ ಹೆಜ್ಜೆ, ಪ್ರತಿದಿನ. ನೀನು ಮಾಡ್ತೀಯ!"]
  }
};

// More wishes per language, joined onto the sets above so the daily card has a real rotation:
// 4 status lines, 3 relationship lines and 5 closing lines each, plus birthday messages.
const WISHES_MORE = {
  english: {
    status: {
      working: ["A tough day at work doesn't cancel your progress. Finish what matters, leave the rest for tomorrow, and log off on time.", "Nobody remembers the inbox you cleared; they remember the problem you solved. Aim at the second.", "Be patient with your own growth at work. Skills compound quietly, then all at once."],
      student: ["You don't need to feel ready to start a chapter. Start, and readiness follows.", "Marks measure a moment; learning lasts a lifetime. Study to understand and the marks will follow.", "Take short breaks, sleep properly and ask the doubts you're hiding. That's the real study hack."],
      idle: ["A quiet stretch is a good time to learn one new skill, even twenty minutes a day. Future you will say thanks.", "You don't have to fix your whole life today. Make your bed, drink water, send one message. That's momentum.", "Not having a plan yet isn't failure; it's room. Try something small and see what interests you."]
    },
    rel: {
      single: ["Being single is a season, not a verdict. Invest in friends, health and the things that make you glad to wake up.", "The best relationship to build first is the one with yourself. Be kind to that person today."],
      relationship: ["Listen a little longer than usual today. Being heard is one of the quietest forms of love.", "Plan one small thing to look forward to together. Shared anticipation keeps a bond young."],
      married: ["Marriage is made of ordinary Tuesdays. Notice one thing your partner did right and say it out loud.", "A home runs on small kindnesses. Do one thing today without being asked."]
    },
    close: ["Be proud of how far you've come, and patient with how far there's left to go.", "Progress, not perfection. One good decision today is plenty."],
    bday: ["Happy Birthday, {n}! 🎂 May this year bring you good health, good people and a little more courage than the last. You deserve a lovely day.", "Many happy returns, {n}! 🎉 Today the world celebrates the day you arrived. Eat the cake, ignore the to-do list, and enjoy being you."]
  },
  manglish: {
    status: {
      working: ["Joliyile oru kashtta divasam ninte munnettam illaathaakkunnilla. Mukhyamaayath theerthu, baakki naale vechu, samayathinu log off cheyyu.", "Inbox clear cheythathu aarum ormikkilla, pakshe nee theerttha prashnam ormikkum. Randam kaaryathil shraddhikku.", "Ninte valarchayodu kshama kaanikku. Kazhivukal ariyathe koodum, pinne ottaykku verum."],
      student: ["Chapter thudangaan ready aakano ennu nokkenda. Thudangu, ready aavum.", "Mark oru nimishathe alavaanu, padippu jeevitha kaalam. Manasilaakki padikku, mark thaanaayi varum.", "Cheriya break edukku, nannaayi urangu, olichu vecha samshayangal chodikku. Athaanu asal study hack."],
      idle: ["Shaanthamaaya ee neram oru puthiya kazhivu padikkaan nalla samayam aanu, divasam 20 minute mathi. Ninte bhaavi nandhi parayum.", "Innu jeevitham muzhuvan shariyaakkenda. Kattil orukku, vellam kudikku, oru message ayakku. Athaanu momentum.", "Plan illaathathu tholvi alla, idam aanu. Cheriya onnu try cheythu nokku, ethu ishtappedum ennu ariyaam."]
    },
    rel: {
      single: ["Single aayirikkunnathu oru kaalam aanu, vidhi alla. Suhruthukkalilum aarogyathilum ninakku santhosham tharunna karyangalilum mudakkam cheyyu.", "Aadyam undaakkenda bandham ninnodu thanne aanu. Innu aa aalodu dayavode irikku."],
      relationship: ["Innu kurachu koodi shradhayode kelkku. Kelkkappedunnathu snehathinte ettavum shaanthamaaya roopam aanu.", "Randuperkkum koodi aagrahikkaan oru cheriya karyam plan cheyyu. Onnichulla kaathirippu bandham puthuthaayi nirthum."],
      married: ["Vivaaham saadhaarana divasangalil ninnu undaakunnathaanu. Partner cheytha oru nalla karyam shraddhichu paranju nokku.", "Veedu cheriya dayavukalil odunnu. Innu parayaathe oru joli cheyyu."]
    },
    close: ["Ninte yaathrayil abhimaanikku, ini ulla dooratthinodu kshama kaanikku.", "Perfection alla, progress aanu mukhyam. Innu oru nalla theerumaanam mathi."],
    bday: ["Janmadina aashamsakal, {n}! 🎂 ee varsham nalla aarogyavum nalla aalukalum kurachu koodi dhairyavum tharatte. Innu santhoshikku!", "Happy Birthday {n}! 🎉 Cake kazhikku, to-do list marakku, ninte aa dhivasam aaswadikku."]
  },
  malayalam: {
    status: {
      working: ["ജോലിയിലെ ഒരു കഷ്ടപ്പാടുള്ള ദിവസം നിന്റെ മുന്നേറ്റം ഇല്ലാതാക്കുന്നില്ല. പ്രധാനപ്പെട്ടത് തീർത്ത്, ബാക്കി നാളേക്ക് വെച്ച്, സമയത്തിന് ലോഗ് ഓഫ് ചെയ്യൂ.", "ഇൻബോക്സ് ക്ലിയർ ചെയ്തത് ആരും ഓർക്കില്ല, പക്ഷേ നീ തീർത്ത പ്രശ്നം ഓർക്കും. രണ്ടാമത്തേതിൽ ശ്രദ്ധിക്കൂ.", "നിന്റെ വളർച്ചയോട് ക്ഷമ കാണിക്കൂ. കഴിവുകൾ അറിയാതെ കൂടും, പിന്നെ ഒറ്റയടിക്ക് തെളിയും."],
      student: ["ഒരു ചാപ്റ്റർ തുടങ്ങാൻ തയ്യാറാകണം എന്നില്ല. തുടങ്ങൂ, തയ്യാറെടുപ്പ് പിന്നാലെ വരും.", "മാർക്ക് ഒരു നിമിഷത്തെ അളവാണ്, പഠനം ജീവിതകാലം നിൽക്കും. മനസ്സിലാക്കി പഠിക്കൂ, മാർക്ക് താനേ വരും.", "ചെറിയ ബ്രേക്ക് എടുക്കൂ, നന്നായി ഉറങ്ങൂ, ഒളിപ്പിച്ച സംശയങ്ങൾ ചോദിക്കൂ. അതാണ് യഥാർത്ഥ സ്റ്റഡി ഹാക്ക്."],
      idle: ["ശാന്തമായ ഈ സമയം ഒരു പുതിയ കഴിവ് പഠിക്കാൻ നല്ലതാണ്, ദിവസം 20 മിനിറ്റ് മതി. നിന്റെ ഭാവി നന്ദി പറയും.", "ഇന്ന് ജീവിതം മുഴുവൻ ശരിയാക്കേണ്ട. കിടക്ക ഒരുക്കൂ, വെള്ളം കുടിക്കൂ, ഒരു മെസ്സേജ് അയക്കൂ. അതാണ് മൊമന്റം.", "പ്ലാൻ ഇല്ലാത്തത് തോൽവിയല്ല, ഇടമാണ്. ചെറിയ എന്തെങ്കിലും പരീക്ഷിച്ചു നോക്കൂ, ഏതാണ് ഇഷ്ടപ്പെടുക എന്ന് അറിയാം."]
    },
    rel: {
      single: ["സിംഗിളായിരിക്കുന്നത് ഒരു കാലമാണ്, വിധിയല്ല. സുഹൃത്തുക്കളിലും ആരോഗ്യത്തിലും നിനക്ക് സന്തോഷം തരുന്ന കാര്യങ്ങളിലും മുതൽമുടക്കൂ.", "ആദ്യം ഉണ്ടാക്കേണ്ട ബന്ധം നിന്നോട് തന്നെയാണ്. ഇന്ന് ആ ആളോട് ദയയോടെ ഇരിക്കൂ."],
      relationship: ["ഇന്ന് കുറച്ച് കൂടി ശ്രദ്ധയോടെ കേൾക്കൂ. കേൾക്കപ്പെടുന്നത് സ്നേഹത്തിന്റെ ഏറ്റവും ശാന്തമായ രൂപമാണ്.", "രണ്ടുപേർക്കും കൂടി ആഗ്രഹിക്കാൻ ഒരു ചെറിയ കാര്യം പ്ലാൻ ചെയ്യൂ. ഒന്നിച്ചുള്ള കാത്തിരിപ്പ് ബന്ധം പുതുമയോടെ നിർത്തും."],
      married: ["വിവാഹം സാധാരണ ദിവസങ്ങളിൽ നിന്നാണ് ഉണ്ടാകുന്നത്. പാർട്ണർ ചെയ്ത ഒരു നല്ല കാര്യം ശ്രദ്ധിച്ച് പറഞ്ഞു നോക്കൂ.", "വീട് ചെറിയ ദയകളിൽ ഓടുന്നു. ഇന്ന് പറയാതെ ഒരു ജോലി ചെയ്യൂ."]
    },
    close: ["നിന്റെ യാത്രയിൽ അഭിമാനിക്കൂ, ഇനിയുള്ള ദൂരത്തോട് ക്ഷമ കാണിക്കൂ.", "പെർഫക്ഷൻ അല്ല, പുരോഗതിയാണ് പ്രധാനം. ഇന്ന് ഒരു നല്ല തീരുമാനം മതി."],
    bday: ["ജന്മദിനാശംസകൾ, {n}! 🎂 ഈ വർഷം നല്ല ആരോഗ്യവും നല്ല ആളുകളും കുറച്ച് കൂടി ധൈര്യവും തരട്ടെ. ഇന്ന് സന്തോഷിക്കൂ!", "ഹാപ്പി ബർത്ത്ഡേ {n}! 🎉 കേക്ക് കഴിക്കൂ, ടു-ഡു ലിസ്റ്റ് മറക്കൂ, നിന്റെ ദിവസം ആസ്വദിക്കൂ."]
  },
  hinglish: {
    status: {
      working: ["Kaam mein ek mushkil din tumhari progress ko cancel nahi karta. Jo zaroori hai woh khatam karo, baaki kal par chhodo, aur time par log off karo.", "Inbox clear karna kisi ko yaad nahi rehta, par jo problem tumne solve ki woh yaad rehti hai. Doosri cheez par dhyaan do.", "Apni growth ke saath sabr rakho. Skills chupke se judti hain, phir ek saath dikhti hain."],
      student: ["Chapter shuru karne ke liye ready feel karna zaroori nahi. Shuru karo, readiness peeche aa jayegi.", "Marks ek pal ka naap hain, seekhna umar bhar rehta hai. Samajh kar padho, marks apne aap aayenge.", "Chhote break lo, theek se so, aur jo doubts chhupa rahe ho woh poochho. Yahi asli study hack hai."],
      idle: ["Yeh shaant waqt ek nayi skill seekhne ke liye achha hai, din mein sirf 20 minute. Future tum shukriya kahega.", "Aaj poori zindagi theek nahi karni. Bistar theek karo, paani piyo, ek message bhejo. Yahi momentum hai.", "Plan na hona failure nahi, jagah hai. Kuch chhota try karo aur dekho kya pasand aata hai."]
    },
    rel: {
      single: ["Single hona ek mausam hai, faisla nahi. Doston, sehat aur un cheezon mein invest karo jo tumhe khush rakhti hain.", "Sabse pehle jo rishta banana hai woh khud se hai. Aaj us insaan ke saath pyaar se pesh aao."],
      relationship: ["Aaj thoda zyada dhyaan se suno. Suna jaana pyaar ka sabse shaant roop hai.", "Dono ke liye ek chhoti si cheez plan karo jiska intezaar ho. Saath ka intezaar rishte ko jawaan rakhta hai."],
      married: ["Shaadi aam dino se banti hai. Partner ne jo ek achha kaam kiya woh dhyaan se dekho aur kehkar batao.", "Ghar chhoti meherbaaniyon par chalta hai. Aaj bina kehe ek kaam kar do."]
    },
    close: ["Jahan tak pahunche ho us par garv karo, aur jo baaki hai us ke saath sabr.", "Perfection nahi, progress. Aaj ek achha faisla kaafi hai."],
    bday: ["Janamdin mubarak, {n}! 🎂 Yeh saal achhi sehat, achhe log aur thoda zyada himmat laaye. Aaj khoob enjoy karo!", "Happy Birthday {n}! 🎉 Cake khao, to-do list bhool jao aur apna din jiyo."]
  },
  hindi: {
    status: {
      working: ["काम में एक मुश्किल दिन तुम्हारी प्रगति को रद्द नहीं करता। जो ज़रूरी है वह ख़त्म करो, बाकी कल पर छोड़ो, और समय पर लॉग ऑफ़ करो।", "इनबॉक्स साफ़ करना किसी को याद नहीं रहता, पर जो समस्या तुमने सुलझाई वह याद रहती है। दूसरी चीज़ पर ध्यान दो।", "अपनी ग्रोथ के साथ सब्र रखो। स्किल्स चुपचाप जुड़ती हैं, फिर एक साथ दिखती हैं।"],
      student: ["चैप्टर शुरू करने के लिए तैयार महसूस करना ज़रूरी नहीं। शुरू करो, तैयारी पीछे आ जाएगी।", "मार्क्स एक पल का माप हैं, सीखना उम्र भर रहता है। समझकर पढ़ो, मार्क्स अपने आप आएँगे।", "छोटे ब्रेक लो, ठीक से सोओ, और जो डाउट छिपा रहे हो वह पूछो। यही असली स्टडी हैक है।"],
      idle: ["यह शांत समय एक नई स्किल सीखने के लिए अच्छा है, दिन में सिर्फ़ 20 मिनट। भविष्य का तुम शुक्रिया कहेगा।", "आज पूरी ज़िंदगी ठीक नहीं करनी। बिस्तर ठीक करो, पानी पियो, एक मैसेज भेजो। यही मोमेंटम है।", "प्लान न होना असफलता नहीं, जगह है। कुछ छोटा आज़माओ और देखो क्या पसंद आता है।"]
    },
    rel: {
      single: ["सिंगल होना एक मौसम है, फ़ैसला नहीं। दोस्तों, सेहत और उन चीज़ों में निवेश करो जो तुम्हें ख़ुश रखती हैं।", "सबसे पहले जो रिश्ता बनाना है वह ख़ुद से है। आज उस इंसान के साथ प्यार से पेश आओ।"],
      relationship: ["आज थोड़ा ज़्यादा ध्यान से सुनो। सुना जाना प्यार का सबसे शांत रूप है।", "दोनों के लिए एक छोटी सी चीज़ प्लान करो जिसका इंतज़ार हो। साथ का इंतज़ार रिश्ते को जवान रखता है।"],
      married: ["शादी आम दिनों से बनती है। पार्टनर ने जो एक अच्छा काम किया वह ध्यान से देखो और कहकर बताओ।", "घर छोटी मेहरबानियों पर चलता है। आज बिना कहे एक काम कर दो।"]
    },
    close: ["जहाँ तक पहुँचे हो उस पर गर्व करो, और जो बाकी है उसके साथ सब्र।", "परफ़ेक्शन नहीं, प्रोग्रेस। आज एक अच्छा फ़ैसला काफ़ी है।"],
    bday: ["जन्मदिन मुबारक, {n}! 🎂 यह साल अच्छी सेहत, अच्छे लोग और थोड़ी ज़्यादा हिम्मत लाए। आज ख़ूब मज़े करो!", "हैप्पी बर्थडे {n}! 🎉 केक खाओ, टू-डू लिस्ट भूल जाओ और अपना दिन जियो।"]
  },
  tanglish: {
    status: {
      working: ["Velaiyila oru kashtamaana naal un munnettrathai cancel pannaadhu. Mukkiyamaanadhai mudichu, meedhi naalaikku vechu, neraththuku log off pannu.", "Inbox clear panninadhu yaarum nyabagam vechukka maattaanga, nee theertha prachanai nyabagam irukkum. Rendavadhula gavanam vei.", "Un valarchikku porumaiyaa iru. Thiramaigal amaidhiyaa serum, appuram ore adiyaa theriyum."],
      student: ["Chapter aarambikka ready-aa irukkanum nu illa. Aarambi, ready-aa aayidum.", "Mark oru nimishathin alavu, kalvi vaazhnaal muzhukka. Purinjikittu padi, mark thaanaa varum.", "Sinna break edu, nalla thoongu, olichu vechcha sandhegangalai ketu. Adhu dhaan unmaiyaana study hack."],
      idle: ["Amaidhiyaana indha neram oru pudhu thiramaiyai kathukka nalladhu, naalaikku 20 nimidam podhum. Un bhavishyam nandri solum.", "Innaiku vaazhkai muzhuvadhum sari pannanum nu illa. Padukkaiyai sari pannu, thanni kudi, oru message anuppu. Adhu dhaan momentum.", "Plan illaadhadhu thoalvi illa, idam. Sinnadhaa edhavadhu try panni paaru, edhu pidikkum nu theriyum."]
    },
    rel: {
      single: ["Single-aa irukkarathu oru kaalam, theerppu illa. Nanbargal, udal nalam, unnai magizhcha vaikkum vishayangalil mudhaleedu pannu.", "Mudhalil uruvaakka vendiya uravu unnodu dhaan. Innaiku andha nabarudan anbaa iru."],
      relationship: ["Innaiku konjam adhigam gavanamaa ketu paaru. Kekkappadudhal anbin amaidhiyaana vadivam.", "Rendu perukkum edhirpaarkka oru sinna vishayam plan pannu. Serndhu kaathirukkuradhu uravai pudhidhaa vechirukkum."],
      married: ["Thirumanam saadharana naatkalil uruvaagudhu. Partner senja oru nalla vishayatha gavanichu sollunga.", "Veedu sinna dhayavil odudhu. Innaiku sollaama oru velai pannunga."]
    },
    close: ["Neenga vandha dhooraththukku perumai padu, innum irukkura dhooraththukku porumaiyaa iru.", "Perfection illa, progress. Innaiku oru nalla mudivu podhum."],
    bday: ["Pirandha naal nalvaazhthukkal, {n}! 🎂 Indha varusham nalla udal nalam, nalla manidhargal, konjam adhigam dhairiyam kondu varattum. Innaiku santhoshama iru!", "Happy Birthday {n}! 🎉 Cake saappidu, to-do list maranthudu, un naalai anubavi."]
  },
  tamil: {
    status: {
      working: ["வேலையில் ஒரு கஷ்டமான நாள் உன் முன்னேற்றத்தை ரத்து செய்யாது. முக்கியமானதை முடிச்சு, மீதியை நாளைக்கு வச்சு, நேரத்துக்கு லாக் ஆஃப் பண்ணு.", "இன்பாக்ஸ் க்ளியர் பண்ணதை யாரும் நினைவு வச்சுக்க மாட்டாங்க, நீ தீர்த்த பிரச்சனையை நினைவு வச்சுப்பாங்க. ரெண்டாவதுல கவனம் வை.", "உன் வளர்ச்சிக்கு பொறுமையா இரு. திறமைகள் அமைதியா சேரும், அப்புறம் ஒரே அடியா தெரியும்."],
      student: ["சேப்டர் ஆரம்பிக்க ரெடியா இருக்கணும்னு இல்ல. ஆரம்பி, ரெடி ஆகிடும்.", "மார்க் ஒரு நிமிஷத்தோட அளவு, கல்வி வாழ்நாள் முழுக்க. புரிஞ்சுகிட்டு படி, மார்க் தானா வரும்.", "சின்ன பிரேக் எடு, நல்லா தூங்கு, ஒளிச்சு வச்ச சந்தேகங்களை கேளு. அதுதான் உண்மையான ஸ்டடி ஹேக்."],
      idle: ["அமைதியான இந்த நேரம் புது திறமை கத்துக்க நல்லது, நாளைக்கு 20 நிமிஷம் போதும். உன் எதிர்காலம் நன்றி சொல்லும்.", "இன்னைக்கு வாழ்க்கை முழுசும் சரி பண்ணணும்னு இல்ல. படுக்கையை சரி பண்ணு, தண்ணி குடி, ஒரு மெசேஜ் அனுப்பு. அதுதான் மொமன்டம்.", "பிளான் இல்லாதது தோல்வி இல்ல, இடம். சின்னதா எதாவது முயற்சி பண்ணி பாரு, எது புடிக்கும்னு தெரியும்."]
    },
    rel: {
      single: ["சிங்கிளா இருக்கிறது ஒரு காலம், தீர்ப்பு இல்ல. நண்பர்கள், ஆரோக்கியம், உன்னை சந்தோஷப்படுத்துற விஷயங்கள்ல முதலீடு பண்ணு.", "முதல்ல உருவாக்க வேண்டிய உறவு உன்கூடவே தான். இன்னைக்கு அந்த ஆளுகிட்ட அன்பா இரு."],
      relationship: ["இன்னைக்கு கொஞ்சம் கவனமா கேளு. கேட்கப்படுறது அன்போட அமைதியான வடிவம்.", "ரெண்டு பேருக்கும் எதிர்பார்க்க ஒரு சின்ன விஷயம் பிளான் பண்ணு. சேர்ந்து காத்திருக்கிறது உறவை புதுசா வச்சிருக்கும்."],
      married: ["திருமணம் சாதாரண நாட்கள்ல உருவாகுது. பார்ட்னர் செஞ்ச ஒரு நல்ல விஷயத்தை கவனிச்சு சொல்லு.", "வீடு சின்ன தயவுல ஓடுது. இன்னைக்கு சொல்லாம ஒரு வேலை பண்ணு."]
    },
    close: ["நீ வந்த தூரத்துக்கு பெருமைப்படு, இன்னும் இருக்கிற தூரத்துக்கு பொறுமையா இரு.", "பெர்ஃபெக்ஷன் இல்ல, ப்ரோக்ரஸ். இன்னைக்கு ஒரு நல்ல முடிவு போதும்."],
    bday: ["பிறந்தநாள் வாழ்த்துகள், {n}! 🎂 இந்த வருஷம் நல்ல ஆரோக்கியம், நல்ல மனிதர்கள், கொஞ்சம் அதிக தைரியம் கொண்டு வரட்டும். இன்னைக்கு சந்தோஷமா இரு!", "ஹேப்பி பர்த்டே {n}! 🎉 கேக் சாப்பிடு, டு-டூ லிஸ்ட்டை மறந்துடு, உன் நாளை அனுபவி."]
  },
  kanglish: {
    status: {
      working: ["Kelasadalli kasta dina ninna pragatiyannu raddu maadalla. Mukhyavaadannu mugsi, ulidaddu naalege ittu, samayakke log off maadu.", "Inbox clear maadiddu yaarigu gnapaka irolla, nee parihaarisida samasye gnapaka irutte. Eradaneyadara mele gamana kodu.", "Ninna belavanigege sahane iru. Kaushalya mouna aagi serutte, naanthara ondu saari kaanutte."],
      student: ["Chapter shuru maadoke ready aagbeku anta illa. Shuru maadu, ready aaguttade.", "Mark ondu kshanada alate, kalike jeevana poora. Artha maadkondu odu, mark thaane barutte.", "Chikka break tegedko, chennagi malagu, ududittiro samshayagalannu keLu. Adu nijavada study hack."],
      idle: ["Shaanthavaada ee samaya hosa kaushalya kaliyoke olleyadu, dinakke 20 nimisha saaku. Ninna bhavishya dhanyavaada heluttade.", "Ivattu jeevana poora sari maadbeku anta illa. Haasige sari maadu, neeru kudi, ondu message kaLisu. Adu momentum.", "Plan illadiddu sola alla, jaaga. Chikkadagi yenadru try maadi nodu, yenu ishta aaguttade anta gottaaguttade."]
    },
    rel: {
      single: ["Single aagiruvudu ondu kaala, theerpu alla. Snehitaru, aarogya mattu ninage khushi kodo vishayagalalli hoodike maadu.", "Modalu maadbekaada sambandha ninna jothe. Ivattu aa vyakthi jothe preetiyinda iru."],
      relationship: ["Ivattu swalpa hecchu gamanadinda kelu. Kelalpaduvudu preetiya ati shaanta swaroopa.", "Ibbarigu nirikshisalu chikka vishaya plan maadi. Jothe kaayuvudu sambandhavannu hosadaagi ittirutte."],
      married: ["Maduve saamanya dinagalinda aagutte. Partner maadida ondu olle kelasavannu gamanisi hELi.", "Mane chikka dayeyalli nadeyutte. Ivattu helade ondu kelasa maadi."]
    },
    close: ["Neevu bandha dooradalli abhimaana padi, innu iruva dooradalli sahane iri.", "Perfection alla, progress. Ivattu ondu olle nirdhara saaku."],
    bday: ["Huttu habbada shubhaashayagalu, {n}! 🎂 Ee varsha olle aarogya, olle janaru mattu swalpa hecchu dhairya tarali. Ivattu khushiyaagi iru!", "Happy Birthday {n}! 🎉 Cake tinnu, to-do list marethogu, ninna dina aaswadisu."]
  },
  kannada: {
    status: {
      working: ["ಕೆಲಸದಲ್ಲಿ ಕಷ್ಟದ ದಿನ ನಿನ್ನ ಪ್ರಗತಿಯನ್ನು ರದ್ದು ಮಾಡಲ್ಲ. ಮುಖ್ಯವಾದದ್ದನ್ನು ಮುಗಿಸಿ, ಉಳಿದದ್ದು ನಾಳೆಗೆ ಇಟ್ಟು, ಸಮಯಕ್ಕೆ ಲಾಗ್ ಆಫ್ ಮಾಡು.", "ಇನ್‌ಬಾಕ್ಸ್ ಕ್ಲಿಯರ್ ಮಾಡಿದ್ದು ಯಾರಿಗೂ ನೆನಪಿರಲ್ಲ, ನೀನು ಪರಿಹರಿಸಿದ ಸಮಸ್ಯೆ ನೆನಪಿರುತ್ತೆ. ಎರಡನೆಯದರ ಮೇಲೆ ಗಮನ ಕೊಡು.", "ನಿನ್ನ ಬೆಳವಣಿಗೆಗೆ ಸಹನೆ ಇರಲಿ. ಕೌಶಲ್ಯ ಮೌನವಾಗಿ ಸೇರುತ್ತೆ, ನಂತರ ಒಂದೇ ಸಾರಿ ಕಾಣುತ್ತೆ."],
      student: ["ಚಾಪ್ಟರ್ ಶುರು ಮಾಡೋಕೆ ರೆಡಿ ಆಗಬೇಕು ಅಂತ ಇಲ್ಲ. ಶುರು ಮಾಡು, ರೆಡಿ ಆಗುತ್ತೆ.", "ಮಾರ್ಕ್ ಒಂದು ಕ್ಷಣದ ಅಳತೆ, ಕಲಿಕೆ ಜೀವನ ಪೂರ್ತಿ. ಅರ್ಥ ಮಾಡ್ಕೊಂಡು ಓದು, ಮಾರ್ಕ್ ತಾನಾಗೇ ಬರುತ್ತೆ.", "ಚಿಕ್ಕ ಬ್ರೇಕ್ ತಗೋ, ಚೆನ್ನಾಗಿ ಮಲಗು, ಅಡಗಿಸಿಟ್ಟ ಸಂದೇಹಗಳನ್ನು ಕೇಳು. ಅದೇ ನಿಜವಾದ ಸ್ಟಡಿ ಹ್ಯಾಕ್."],
      idle: ["ಶಾಂತವಾದ ಈ ಸಮಯ ಹೊಸ ಕೌಶಲ್ಯ ಕಲಿಯೋಕೆ ಒಳ್ಳೆಯದು, ದಿನಕ್ಕೆ 20 ನಿಮಿಷ ಸಾಕು. ನಿನ್ನ ಭವಿಷ್ಯ ಧನ್ಯವಾದ ಹೇಳುತ್ತೆ.", "ಇವತ್ತು ಜೀವನ ಪೂರ್ತಿ ಸರಿ ಮಾಡಬೇಕು ಅಂತ ಇಲ್ಲ. ಹಾಸಿಗೆ ಸರಿ ಮಾಡು, ನೀರು ಕುಡಿ, ಒಂದು ಮೆಸೇಜ್ ಕಳಿಸು. ಅದೇ ಮೊಮೆಂಟಮ್.", "ಪ್ಲಾನ್ ಇಲ್ಲದಿರೋದು ಸೋಲು ಅಲ್ಲ, ಜಾಗ. ಚಿಕ್ಕದಾಗಿ ಏನಾದ್ರೂ ಟ್ರೈ ಮಾಡಿ ನೋಡು, ಏನು ಇಷ್ಟ ಆಗುತ್ತೆ ಅಂತ ಗೊತ್ತಾಗುತ್ತೆ."]
    },
    rel: {
      single: ["ಸಿಂಗಲ್ ಆಗಿರೋದು ಒಂದು ಕಾಲ, ತೀರ್ಪು ಅಲ್ಲ. ಸ್ನೇಹಿತರು, ಆರೋಗ್ಯ ಮತ್ತು ನಿನಗೆ ಖುಷಿ ಕೊಡೋ ವಿಷಯಗಳಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡು.", "ಮೊದಲು ಮಾಡಬೇಕಾದ ಸಂಬಂಧ ನಿನ್ನ ಜೊತೆಗೇ. ಇವತ್ತು ಆ ವ್ಯಕ್ತಿ ಜೊತೆ ಪ್ರೀತಿಯಿಂದ ಇರು."],
      relationship: ["ಇವತ್ತು ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಗಮನದಿಂದ ಕೇಳು. ಕೇಳಲ್ಪಡುವುದು ಪ್ರೀತಿಯ ಅತಿ ಶಾಂತ ರೂಪ.", "ಇಬ್ಬರಿಗೂ ನಿರೀಕ್ಷಿಸಲು ಒಂದು ಚಿಕ್ಕ ವಿಷಯ ಪ್ಲಾನ್ ಮಾಡಿ. ಜೊತೆ ಕಾಯುವುದು ಸಂಬಂಧವನ್ನು ಹೊಸದಾಗಿ ಇಡುತ್ತೆ."],
      married: ["ಮದುವೆ ಸಾಮಾನ್ಯ ದಿನಗಳಿಂದ ಆಗುತ್ತೆ. ಪಾರ್ಟ್ನರ್ ಮಾಡಿದ ಒಂದು ಒಳ್ಳೆಯ ಕೆಲಸವನ್ನು ಗಮನಿಸಿ ಹೇಳಿ.", "ಮನೆ ಚಿಕ್ಕ ದಯೆಯಲ್ಲಿ ನಡೆಯುತ್ತೆ. ಇವತ್ತು ಹೇಳದೆ ಒಂದು ಕೆಲಸ ಮಾಡಿ."]
    },
    close: ["ನೀವು ಬಂದ ದೂರದಲ್ಲಿ ಅಭಿಮಾನ ಪಡಿ, ಇನ್ನು ಇರುವ ದೂರದಲ್ಲಿ ಸಹನೆ ಇರಲಿ.", "ಪರ್ಫೆಕ್ಷನ್ ಅಲ್ಲ, ಪ್ರೋಗ್ರೆಸ್. ಇವತ್ತು ಒಂದು ಒಳ್ಳೆಯ ನಿರ್ಧಾರ ಸಾಕು."],
    bday: ["ಹುಟ್ಟುಹಬ್ಬದ ಶುಭಾಶಯಗಳು, {n}! 🎂 ಈ ವರ್ಷ ಒಳ್ಳೆಯ ಆರೋಗ್ಯ, ಒಳ್ಳೆಯ ಜನರು ಮತ್ತು ಸ್ವಲ್ಪ ಹೆಚ್ಚು ಧೈರ್ಯ ತರಲಿ. ಇವತ್ತು ಖುಷಿಯಾಗಿರು!", "ಹ್ಯಾಪಿ ಬರ್ತ್‌ಡೇ {n}! 🎉 ಕೇಕ್ ತಿನ್ನು, ಟು-ಡು ಲಿಸ್ಟ್ ಮರೆತುಬಿಡು, ನಿನ್ನ ದಿನವನ್ನು ಆಸ್ವಾದಿಸು."]
  }
};
for (const [lang, more] of Object.entries(WISHES_MORE)) {
  const w = WISHES[lang];
  if (!w) continue;
  for (const group of ['status', 'rel']) {
    for (const [key, lines] of Object.entries(more[group])) w[group][key] = [].concat(w[group][key], lines);
  }
  w.close = w.close.concat(more.close);
  w.bday = more.bday;
}

// The card shows a new wish every calendar day. main.js keeps `lastWishDate` and a counter in settings.json and
// advances the counter when the date changes; the counter picks a different line for each part of the message.
function renderWish(s) {
  const lang = WISHES[s.language] ? s.language : 'english';
  const w = WISHES[lang];
  const name = (s.userName || '').trim() || w.friend;
  const n = Number.isInteger(s.wishCounter) ? s.wishCounter : 0;
  if (s.birthday) {
    $('giftTag').textContent = `🎂 A Birthday Gift for You, ${name} — Tap to unwrap`;
    document.querySelector('.wish-kicker').textContent = 'Happy birthday';
    $('wishText').textContent = w.bday[n % w.bday.length].replace('{n}', name);
    return;
  }
  const statuses = w.status[s.userStatus] || w.status.working;
  const rels = w.rel[s.userRelationship] || w.rel.single;
  $('giftTag').textContent = `🎁 A Gift for You, ${name} — Tap to unwrap`;
  document.querySelector('.wish-kicker').textContent = 'Your daily wish';
  $('wishText').textContent = `${w.hi.replace('{n}', name)}\n\n${statuses[n % statuses.length]} ${rels[(n + 1) % rels.length]}\n\n${w.close[n % w.close.length]}`;
}

// Ask main.js to move the wish on whenever the calendar day has changed (also while the app stays open past midnight).
let lastWishState = null;
function checkWishDay(s) {
  if (s) lastWishState = s;
  if (lastWishState && lastWishState.profileConfigured && lastWishState.lastWishDate !== todayIso()) window.dashboard.set('wishDay', todayIso());
}
setInterval(() => checkWishDay(), 60000);

// Unwrap: ribbon and bow come away, the paper peels back and the card rises. The fold button wraps it up again.
const giftEl = $('gift');
let giftTimer = null;
function setGift(state) {
  clearTimeout(giftTimer);
  giftEl.dataset.state = state;
  $('giftWrap').setAttribute('aria-expanded', String(state !== 'closed'));
}
$('giftWrap').addEventListener('click', () => {
  if (giftEl.dataset.state !== 'closed') return;
  setGift('opening');
  giftTimer = setTimeout(() => {
    setGift('open');
    giftEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 1450);
});
$('foldBtn').addEventListener('click', () => setGift('closed'));

// ---------- Optional Gemini key for the smart chat ----------
// The key is sent to the main process and kept there; the page only ever learns whether one is saved.
const geminiEl = $('geminiKey');
let geminiSaved = false;
function showGeminiState(saved) {
  geminiSaved = saved;
  geminiEl.placeholder = saved ? '•••••••• saved. Paste a new key to replace it' : 'Paste your key here';
  $('geminiRemove').classList.toggle('hidden', !saved);
  if (!geminiEl.value) $('geminiHint').textContent = saved ? 'smart chat on' : 'optional';
}
function geminiMessage(text, bad) {
  const hint = $('geminiHint');
  hint.textContent = text;
  hint.style.color = bad ? 'var(--err)' : '';
  setTimeout(() => { hint.style.color = ''; showGeminiState(geminiSaved); }, 2500);
}
geminiEl.addEventListener('input', () => { if (!profileConfigured) draft.gemini = geminiEl.value.trim(); });

// The Save button (or Enter) checks the key, stores it in settings.json right away and shows "saved".
async function saveGeminiKey() {
  const value = geminiEl.value.trim();
  if (!value) { geminiMessage('paste your key first', true); geminiEl.focus(); return; }
  const btn = $('geminiSave');
  btn.disabled = true;
  const ok = await window.dashboard.set('geminiKey', value);
  btn.disabled = false;
  if (ok) {
    geminiEl.value = ''; draft.gemini = '';
    showGeminiState(true);
    geminiMessage('key saved', false);
  } else {
    geminiMessage('that does not look like a valid key', true);
  }
}
$('geminiSave').addEventListener('click', saveGeminiKey);
geminiEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); saveGeminiKey(); } });
$('geminiRemove').addEventListener('click', async () => {
  geminiEl.value = ''; draft.gemini = '';
  await window.dashboard.set('geminiKey', '');
  showGeminiState(false);
  geminiMessage('key removed', false);
});
