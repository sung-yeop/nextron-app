import { useRouter } from "next/router";

export default function HomePage() {
  const router = useRouter();
  return (
    <div>
      gkgkgkk
      <button onClick={() => router.push("/other")}>다른 페이지 이동</button>
    </div>
  );
}
