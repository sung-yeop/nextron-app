import path from "path";
import { app, session, dialog } from "electron";
import serve from "electron-serve";
import { autoUpdater } from "electron-updater";
import { createWindow } from "./helpers";
import { log } from "electron-log";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();
  let isUpdate = false;

  autoUpdater.on("checking-for-update", () => {
    log("업데이트 확인 중...");
  });

  autoUpdater.on("update-available", _info => {
    dialog
      .showMessageBox({
        type: "info",
        title: "업데이트 가능",
        message: "새로운 버전이 있습니다. 다운로드하시겠습니까?",
        buttons: ["예", "아니오"],
      })
      .then(result => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
          isUpdate = true;
        }
      });
  });

  autoUpdater.on("update-not-available", () => {
    log("현재 최신버전입니다.");
  });

  autoUpdater.on("error", err => {
    dialog.showErrorBox("업데이트 오류", err.message);
  });

  autoUpdater.on("download-progress", progressObj => {
    log(`다운로드 진행률: ${Math.round(progressObj.percent)}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    if (isUpdate) {
      dialog
        .showMessageBox({
          type: "info",
          title: "업데이트 완료",
          message: "업데이트가 다운로드되었습니다. 지금 재시작하시겠습니까?",
          buttons: ["재시작", "나중에"],
        })
        .then(result => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall();
          }
        });
    }
  });

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: !isProd,
      webSecurity: isProd,
    },
  });

  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === "media") {
        callback(true);
      } else {
        callback(false);
      }
    }
  );

  if (isProd) {
    await mainWindow.loadURL("app://./home");
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});
