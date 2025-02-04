import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { ready, authenticated, logout } = usePrivy();
  const router = useRouter();

  const disableLogout = !ready || (ready && !authenticated);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <button
      className="py-2 px-4 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500/10 flex items-center justify-center gap-2 transition-colors text-sm"
      disabled={disableLogout}
      onClick={handleLogout}
    >
      Log out
    </button>
  );
}
