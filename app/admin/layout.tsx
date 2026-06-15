import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Basic role check, also handled in middleware, but good to have here
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="bg-background text-foreground font-body-md overflow-x-hidden min-h-screen">
      <AdminSidebar />
      <AdminHeader />
      
      <main className="md:ml-64 pt-20 md:pt-24 px-4 md:px-8 pb-12">
        {children}
      </main>
    </div>
  );
}
