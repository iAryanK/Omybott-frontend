import type { Metadata } from "next";

import { DashboardNavbar } from "@/components/shared/DashboardNavbar";

export const metadata: Metadata = {
  title: "Welcome to Omybott",
  description: "Plugin your customized AI assistant to your web apps.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full">
      <div className="mx-auto flex h-full max-w-5xl flex-col">
        <DashboardNavbar />
        {children}
      </div>
    </main>
  );
}
