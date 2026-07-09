import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar variant="solid" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
