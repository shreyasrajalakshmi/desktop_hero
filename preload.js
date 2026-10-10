const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pet', {
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s)),
  onTaskDue: cb => ipcRenderer.on('task-due', (_e, t) => cb(t)),
  onSay: cb => ipcRenderer.on('say', (_e, kind) => cb(kind)),
  setFreePos: pos => ipcRenderer.send('free-pos', pos),
  askAI: req => ipcRenderer.invoke('ask-ai', req),
  chatFocus: on => ipcRenderer.send('chat-focus', !!on),
  setInteractive: on => ipcRenderer.send('overlay-interactive', !!on)
});
