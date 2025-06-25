import { useEffect, useState } from "react";

export default function Updater() {
  const [isProgressUpdate, setIsProgressUpdate] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("업데이트 확인 중...");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpdateCheck = async () => {
    try {
      setIsLoading(true);
      const response = await window.ipc.updateCheck();
      console.log("response : ", response);
      if (response?.updateInfo) {
        setMessage(`새 버전 ${response.updateInfo.version} 사용 가능`);
        setIsProgressUpdate(true);
      } else {
        setMessage("최신 버전입니다.");
      }
    } catch (error) {
      console.error("업데이트 확인 실패:", error);
      setMessage("업데이트 확인 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setMessage("다운로드 중...");
      setIsLoading(true);
      const result = await window.ipc.updateDownload();

      console.log("다운로드 결과 : ", result);

      if (result.success) {
        setMessage("업데이트 설치 중... 앱이 재시작됩니다.");
        await window.ipc.updateInstall();
      } else {
        setMessage(`다운로드 실패: ${result.error}`);
      }
    } catch (error) {
      console.error("다운로드 실패:", error);
      setMessage("다운로드 실패 에러");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleUpdateCheck();
  }, []);

  return (
    <div className="cursor-pointer">
      <div>상태: {message}</div>
      {isProgressUpdate && (
        <button onClick={handleDownload} disabled={isLoading}>
          업데이트 다운로드
        </button>
      )}
    </div>
  );
}
