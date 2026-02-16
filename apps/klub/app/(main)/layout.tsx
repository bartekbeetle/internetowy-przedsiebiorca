import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Toaster } from "react-hot-toast";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string })?.role;

  return (
    <div className="min-h-screen bg-brand-primary">
      <Sidebar userRole={userRole} />
      <div className="lg:pl-64">
        <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1E293B",
            color: "#F1F5F9",
            border: "1px solid #334155",
          },
        }}
      />
    </div>
  );
}
