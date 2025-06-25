import { ipcRenderer } from "electron";
import { UpdateCheckResult } from "electron-updater";

const preloadUpdateHandlers = {
  updateCheck: (): Promise<UpdateCheckResult | null> =>
    ipcRenderer.invoke("update-check"),
  updateDownload: (): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> => ipcRenderer.invoke("update-download"),
  updateInstall: (): Promise<void> => ipcRenderer.invoke("update-install"),
};

export default preloadUpdateHandlers;
