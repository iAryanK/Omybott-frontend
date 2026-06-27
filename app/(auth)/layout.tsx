import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register / Login to Omybott",
  description: "Plugin your customized AI assistant to your web apps.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-full">
      {children}
    </main>
  );
}
