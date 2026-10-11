// Launch at login for macOS and Windows, built on Electron's app.setLoginItemSettings.
//
// This file never imports Electron: main.js hands it the `app` object, so both platforms' behaviour can be exercised with a
// fake `app` in a plain Node process.
//
// What it keeps out of trouble:
//  - An unpackaged run (`npm start`) must never register Electron itself as a login item, and a Mac app that is not in an
//    Applications folder (run from the disk image, or translocated out of Downloads) would register a path that goes away.
//    In both cases the choice is only remembered ('saved' mode) and takes effect once the installed app runs.
//  - If the user switched the item off in the OS itself (System Settings > General > Login Items on macOS; Task Manager or
//    Settings > Apps > Startup on Windows) that is reported as `blocked` and is not quietly switched back on at launch.
//  - Electron only logs a failed macOS registration instead of throwing, so every change is followed by reading the real
//    state back rather than trusting the call.

// Windows: written after the executable in the login entry, so the app can tell the OS started it (macOS says so itself,
// through wasOpenedAtLogin). Electron compares the arguments when reading the entry back, so they must match everywhere.
const START_FLAG = '--hero-autostart';

function createAutoStart({ app, platform = process.platform, argv = process.argv, packaged = app.isPackaged, log = () => {} }) {
  const winArgs = platform === 'win32' ? [START_FLAG] : null;

  let where = null;      // resolved on first use, once the app is ready
  function place() {
    if (where) return where;
    if (platform !== 'darwin' && platform !== 'win32') where = { mode: 'none', reason: 'platform' };
    else if (!packaged) where = { mode: 'saved', reason: 'dev' };
    else {
      let inApplications = true;
      try { if (platform === 'darwin' && typeof app.isInApplicationsFolder === 'function') inApplications = app.isInApplicationsFolder() !== false; } catch (_) { /* assume yes */ }
      where = inApplications ? { mode: 'os', reason: null } : { mode: 'saved', reason: 'location' };
    }
    return where;
  }

  // What the OS will do at the next login.
  //   registered: the app has a login entry   enabled: it will really start   blocked: registered but switched off by the user
  function read() {
    const base = { ...place(), platform, enabled: false, registered: false, blocked: false };
    if (base.mode !== 'os') return base;
    let s;
    try { s = app.getLoginItemSettings(winArgs ? { args: winArgs } : undefined) || {}; } catch (err) { log('could not read the login item:', err && err.message); return base; }
    if (platform === 'darwin') {
      const st = s.status;                                   // not-registered | enabled | requires-approval | not-found
      return { ...base, status: st, enabled: st === 'enabled', registered: st === 'enabled' || st === 'requires-approval', blocked: st === 'requires-approval' };
    }
    const registered = s.openAtLogin === true;               // our entry exists (Windows ignores Task Manager's on/off here)
    const live = s.executableWillLaunchAtLogin === true;    // ...and it has not been switched off there
    return { ...base, enabled: registered && live, registered, blocked: registered && !live };
  }

  function apply(on) {
    try { app.setLoginItemSettings(winArgs ? { openAtLogin: on, args: winArgs } : { openAtLogin: on }); } catch (err) { log('could not change the login item:', err && err.message); }
  }

  // The user flipped the switch: make it so, then report what the OS now says.
  function set(on) {
    const s = read();
    if (s.mode !== 'os') return s;
    if (on) {
      // macOS never lets an app override the user's "off" in System Settings, so asking again would only repeat the notification.
      if (!s.enabled && !(platform === 'darwin' && s.blocked)) apply(true);
    } else if (s.registered || platform === 'win32') {
      apply(false);                                           // Windows: also clears an entry that another build wrote with other arguments
    }
    return read();
  }

  // App start: make the OS match the saved choice (this also repairs an entry after the app was moved or reinstalled), but
  // never undo something the user switched off in the OS itself.
  function reconcile(wanted) {
    const s = read();
    if (s.mode !== 'os') return s;
    if (wanted && !s.registered) apply(true);
    else if (!wanted && s.registered) apply(false);
    return read();
  }

  // Was this launch started by the OS at login? (Used to keep the settings window closed when the hero is already set up.)
  function launchedAtLogin(args = argv) {
    if (args.includes(START_FLAG)) return true;
    if (platform === 'darwin') {
      try { return app.getLoginItemSettings().wasOpenedAtLogin === true; } catch (_) { /* not a login launch */ }
    }
    return false;
  }

  return { read, set, reconcile, launchedAtLogin };
}

module.exports = { createAutoStart, START_FLAG };
