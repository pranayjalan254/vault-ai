import { usePrivy } from "@privy-io/react-auth";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginButton() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();

  useEffect(() => {
    const handleLogin = () => {
      router.push("/dashboard");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("privy:signup", handleLogin);
      return () => {
        window.removeEventListener("privy:signup", handleLogin);
      };
    }
  }, [router]);

  const handleClick = () => {
    if (authenticated) {
      router.push("/dashboard");
    } else {
      login();
    }
  };

  return (
    <button
      className="px-8 py-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
      disabled={!ready}
      onClick={handleClick}
    >
      {authenticated ? "Go to Dashboard" : "Get Started"}
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}
