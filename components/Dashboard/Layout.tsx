import { AnimatedBackground } from "./Background/AnimatedBackground";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
