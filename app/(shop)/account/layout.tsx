import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/account/Sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Enforce login for all account routes
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account");
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 flex-grow w-full">
      <div className="flex flex-col md:flex-row gap-12">
        <Sidebar />
        <section className="flex-grow">
          {children}
        </section>
      </div>
    </main>
  );
}
