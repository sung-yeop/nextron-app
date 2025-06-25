import { ipcMain } from "electron";
import { autoUpdater, UpdateInfo } from "electron-updater";
import { log } from "electron-log";

export function setupMainUpdateHandlers() {
  ipcMain.handle("update-check", _event => {
    log("업데이트 체크 요청");

    return new Promise(resolve => {
      // 이벤트 리스너 등록
      const onUpdateAvailable = (info: UpdateInfo) => {
        autoUpdater.removeListener("update-available", onUpdateAvailable);
        autoUpdater.removeListener(
          "update-not-available",
          onUpdateNotAvailable
        );
        autoUpdater.removeListener("error", onError);
        resolve({ isUpdateAvailable: true, updateInfo: info });
      };

      const onUpdateNotAvailable = () => {
        autoUpdater.removeListener("update-available", onUpdateAvailable);
        autoUpdater.removeListener(
          "update-not-available",
          onUpdateNotAvailable
        );
        autoUpdater.removeListener("error", onError);
        resolve({ isUpdateAvailable: false, updateInfo: null });
      };

      const onError = (error: Error) => {
        autoUpdater.removeListener("update-available", onUpdateAvailable);
        autoUpdater.removeListener(
          "update-not-available",
          onUpdateNotAvailable
        );
        autoUpdater.removeListener("error", onError);
        resolve({
          isUpdateAvailable: false,
          updateInfo: null,
          error: error.message,
        });
      };

      autoUpdater.once("update-available", onUpdateAvailable);
      autoUpdater.once("update-not-available", onUpdateNotAvailable);
      autoUpdater.once("error", onError);

      // 업데이트 확인 시작
      autoUpdater.checkForUpdates();
    });
  });

  ipcMain.handle("update-download", () => {
    log("업데이트 다운로드");

    return new Promise((resolve, reject) => {
      const onDownloaded = () => {
        autoUpdater.removeListener("update-downloaded", onDownloaded);
        autoUpdater.removeListener("error", onDownloadError);
        resolve({ success: true, message: "다운로드 완료" });
      };

      const onDownloadError = (error: Error) => {
        autoUpdater.removeListener("update-downloaded", onDownloaded);
        autoUpdater.removeListener("error", onDownloadError);
        reject({ success: false, error: error.message });
      };

      autoUpdater.once("update-downloaded", onDownloaded);
      autoUpdater.once("error", onDownloadError);

      // 다운로드 시작
      autoUpdater.downloadUpdate();
    });
  });

  ipcMain.handle("update-install", () => {
    log("업데이트 설치 및 재시작");
    autoUpdater.quitAndInstall();
  });

  ipcMain.handle("download-progress", () => {
    log("");
  });

  autoUpdater.on("download-progress", progressObj => {
    log(`다운로드 진행률: ${Math.round(progressObj.percent)}%`);
  });
}
