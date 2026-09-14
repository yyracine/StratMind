import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  version: process.version,
  platform: process.platform,
  arch: process.arch,
});
