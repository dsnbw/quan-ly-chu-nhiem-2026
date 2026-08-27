const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-app'),
  deploySSH: (params) => ipcRenderer.invoke('deploy-ssh', params)
});
