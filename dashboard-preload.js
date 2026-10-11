const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dashboard', {
  getState: () => ipcRenderer.invoke('get-state'),
  set: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  task: (op, payload) => ipcRenderer.invoke('task', op, payload),
  saveProfile: profile => ipcRenderer.invoke('save-profile', profile),
  checkGeminiKey: key => ipcRenderer.invoke('check-gemini-key', key),
  getAutoStart: () => ipcRenderer.invoke('get-auto-start'),
  setAutoStart: on => ipcRenderer.invoke('set-auto-start', on),
  say: kind => ipcRenderer.send('say', kind),
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s))
});
